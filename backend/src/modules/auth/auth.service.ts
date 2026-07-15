import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { Prisma } from '../../generated/prisma/client.js';

import { AppConfigService } from '../../config/app-config.service.js';
import { NodeEnvironment } from '../../config/env.validation.js';
import { PrismaService } from '../../database/prisma.service.js';
import type {
  AuthSession,
  AuthenticatedUser,
  PublicUser,
} from './auth.types.js';
import { PasswordService } from './password.service.js';
import { TokenService } from './token.service.js';

const GENERIC_RESET_MESSAGE =
  'Se este e-mail existir, enviaremos as instrucoes de recuperacao.';

type SessionUser = Prisma.UserGetPayload<{
  include: { subscription: true };
}>;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly config: AppConfigService
  ) {}

  async register(input: {
    nickname: string;
    email: string;
    password: string;
  }): Promise<AuthSession> {
    const email = normalizeEmail(input.email);
    const passwordHash = await this.passwordService.hash(input.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          nickname: input.nickname.trim(),
          email,
          passwordHash,
          subscription: {
            create: { planCode: 'free', status: 'active' },
          },
        },
        include: { subscription: true },
      });

      return this.createSession(user);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException({
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Este e-mail ja esta cadastrado.',
        });
      }

      throw error;
    }
  }

  async login(input: { email: string; password: string }): Promise<AuthSession> {
    const user = await this.prisma.user.findUnique({
      where: { email: normalizeEmail(input.email) },
      include: { subscription: true },
    });

    if (!user) {
      throwInvalidCredentials();
    }

    const passwordMatches = await this.passwordService.verify(
      input.password,
      user.passwordHash
    );

    if (!passwordMatches) {
      throwInvalidCredentials();
    }

    assertAccountActive(user);

    return this.createSession(user);
  }

  async refresh(refreshToken: string): Promise<AuthSession> {
    const tokenHash = this.tokenService.hashOpaqueToken(refreshToken);
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: { include: { subscription: true } } },
    });

    if (!storedToken) {
      throwInvalidRefreshToken();
    }

    if (storedToken.revokedAt) {
      await this.revokeTokenFamily(storedToken.familyId, 'reuse_detected');
      throwInvalidRefreshToken();
    }

    if (storedToken.expiresAt <= new Date()) {
      await this.prisma.refreshToken.updateMany({
        where: { id: storedToken.id, revokedAt: null },
        data: { revokedAt: new Date(), revokedReason: 'expired' },
      });
      throwInvalidRefreshToken();
    }

    assertAccountActive(storedToken.user);

    const nextRefreshToken = this.tokenService.createOpaqueToken();
    const nextTokenHash = this.tokenService.hashOpaqueToken(nextRefreshToken);
    const now = new Date();
    const rotated = await this.prisma.$transaction(async (tx) => {
      const consumed = await tx.refreshToken.updateMany({
        where: { id: storedToken.id, revokedAt: null, expiresAt: { gt: now } },
        data: { revokedAt: now, revokedReason: 'rotated' },
      });

      if (consumed.count !== 1) return false;

      await tx.refreshToken.create({
        data: {
          userId: storedToken.userId,
          familyId: storedToken.familyId,
          tokenHash: nextTokenHash,
          expiresAt: fromNow(this.config.authRefreshTokenTtlSeconds),
        },
      });
      return true;
    });

    if (!rotated) {
      await this.revokeTokenFamily(storedToken.familyId, 'reuse_detected');
      throwInvalidRefreshToken();
    }

    return this.buildSession(storedToken.user, nextRefreshToken);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = this.tokenService.hashOpaqueToken(refreshToken);

    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date(), revokedReason: 'logout' },
    });
  }

  async getProfile(userId: string): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      throw new UnauthorizedException({
        code: 'USER_NOT_FOUND',
        message: 'Usuario nao encontrado. Entre novamente.',
      });
    }

    return mapPublicUser(user);
  }

  async updateProfile(
    userId: string,
    input: { nickname: string }
  ): Promise<PublicUser> {
    const nickname = input.nickname.trim();

    if (!nickname) {
      throw new ConflictException({
        code: 'INVALID_NICKNAME',
        message: 'Informe um apelido valido.',
      });
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { nickname },
      include: { subscription: true },
    });

    return mapPublicUser(user);
  }

  async requestPasswordReset(emailInput: string): Promise<{
    message: string;
    resetToken?: string;
  }> {
    const email = normalizeEmail(emailInput);
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || user.status !== 'active') {
      return { message: GENERIC_RESET_MESSAGE };
    }

    const resetToken = this.tokenService.createOpaqueToken();
    await this.prisma.$transaction([
      this.prisma.passwordResetToken.updateMany({
        where: { userId: user.id, usedAt: null },
        data: { usedAt: new Date() },
      }),
      this.prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: this.tokenService.hashOpaqueToken(resetToken),
          expiresAt: fromNow(this.config.authPasswordResetTtlSeconds),
        },
      }),
    ]);

    if (this.config.nodeEnvironment === NodeEnvironment.Production) {
      return { message: GENERIC_RESET_MESSAGE };
    }

    return { message: GENERIC_RESET_MESSAGE, resetToken };
  }

  async resetPassword(input: { token: string; password: string }): Promise<void> {
    const tokenHash = this.tokenService.hashOpaqueToken(input.token);
    const storedToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (
      !storedToken ||
      storedToken.usedAt ||
      storedToken.expiresAt <= new Date()
    ) {
      throw new UnauthorizedException({
        code: 'INVALID_PASSWORD_RESET_TOKEN',
        message: 'Token de recuperacao invalido ou expirado.',
      });
    }

    const now = new Date();
    const passwordHash = await this.passwordService.hash(input.password);
    await this.prisma.$transaction(async (tx) => {
      const claimed = await tx.passwordResetToken.updateMany({
        where: {
          id: storedToken.id,
          usedAt: null,
          expiresAt: { gt: now },
        },
        data: { usedAt: now },
      });

      if (claimed.count !== 1) {
        throw new UnauthorizedException({
          code: 'INVALID_PASSWORD_RESET_TOKEN',
          message: 'Token de recuperacao invalido ou expirado.',
        });
      }

      await tx.user.update({
        where: { id: storedToken.userId },
        data: { passwordHash },
      });
      await tx.refreshToken.updateMany({
        where: { userId: storedToken.userId, revokedAt: null },
        data: { revokedAt: now, revokedReason: 'password_reset' },
      });
    });
  }

  private async createSession(user: SessionUser): Promise<AuthSession> {
    const refreshToken = this.tokenService.createOpaqueToken();

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        familyId: randomUUID(),
        tokenHash: this.tokenService.hashOpaqueToken(refreshToken),
        expiresAt: fromNow(this.config.authRefreshTokenTtlSeconds),
      },
    });

    return this.buildSession(user, refreshToken);
  }

  private buildSession(user: SessionUser, refreshToken: string): AuthSession {
    return {
      user: mapPublicUser(user),
      tokens: {
        accessToken: this.tokenService.createAccessToken(mapAuthenticatedUser(user)),
        tokenType: 'Bearer',
        expiresIn: this.config.authAccessTokenTtlSeconds,
      },
      refreshToken,
    };
  }

  private revokeTokenFamily(familyId: string, reason: string): Promise<unknown> {
    return this.prisma.refreshToken.updateMany({
      where: { familyId, revokedAt: null },
      data: { revokedAt: new Date(), revokedReason: reason },
    });
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function fromNow(seconds: number): Date {
  return new Date(Date.now() + seconds * 1000);
}

function mapPublicUser(user: SessionUser): PublicUser {
  return {
    id: user.id,
    nickname: user.nickname,
    email: user.email,
    role: user.role,
    status: user.status,
    planCode: user.subscription?.planCode ?? null,
    createdAt: user.createdAt,
  };
}

function mapAuthenticatedUser(user: SessionUser): AuthenticatedUser {
  return {
    sub: user.id,
  };
}

function assertAccountActive(user: Pick<SessionUser, 'status'>): void {
  if (user.status !== 'active') {
    throw new UnauthorizedException({
      code: 'ACCOUNT_INACTIVE',
      message: 'Esta conta nao esta disponivel para acesso.',
    });
  }
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2002'
  );
}

function throwInvalidCredentials(): never {
  throw new UnauthorizedException({
    code: 'INVALID_CREDENTIALS',
    message: 'E-mail ou senha invalidos.',
  });
}

function throwInvalidRefreshToken(): never {
  throw new UnauthorizedException({
    code: 'INVALID_REFRESH_TOKEN',
    message: 'Sessao expirada. Entre novamente.',
  });
}
