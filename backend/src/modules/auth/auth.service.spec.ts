import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import type {
  PasswordResetToken,
  RefreshToken,
  User,
  UserSubscription,
} from '../../generated/prisma/client.js';
import { NodeEnvironment } from '../../config/env.validation.js';
import type { AppConfigService } from '../../config/app-config.service.js';
import type { PrismaService } from '../../database/prisma.service.js';
import { AuthService } from './auth.service.js';
import { PasswordService } from './password.service.js';
import { TokenService } from './token.service.js';
import type { GoogleTokenVerifierService } from './google-token-verifier.service.js';

jest.mock('../../database/prisma.service.js', () => ({
  PrismaService: class PrismaService {},
}));

class UniqueConstraintError extends Error {
  code = 'P2002';
}

class InMemoryPrisma {
  readonly users: User[] = [];
  readonly refreshTokens: RefreshToken[] = [];
  readonly passwordResetTokens: PasswordResetToken[] = [];
  readonly subscriptions: UserSubscription[] = [];

  user = {
    create: async ({ data }: { data: Pick<User, 'nickname' | 'email' | 'passwordHash'> }) => {
      if (this.users.some((user) => user.email === data.email)) {
        throw new UniqueConstraintError();
      }

      const user: User = {
        id: randomUUID(),
        nickname: data.nickname,
        email: data.email,
        passwordHash: data.passwordHash,
        role: 'player',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.push(user);
      const subscription: UserSubscription = {
        id: randomUUID(),
        userId: user.id,
        planCode: 'free',
        status: 'active',
        startsAt: new Date(),
        currentPeriodEnd: null,
        canceledAt: null,
        provider: null,
        providerSubscriptionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.subscriptions.push(subscription);
      return { ...user, subscription };
    },
    findUnique: async ({ where }: { where: { id?: string; email?: string } }) => {
      const user = this.users.find(
        (user) => user.id === where.id || user.email === where.email
      ) ?? null;
      return user
        ? { ...user, subscription: this.subscriptions.find((item) => item.userId === user.id) ?? null }
        : null;
    },
    update: async ({
      where,
      data,
    }: {
      where: { id: string };
      data: Partial<Pick<User, 'passwordHash' | 'nickname'>>;
    }) => {
      const user = this.users.find((item) => item.id === where.id);
      if (!user) throw new Error('User not found');
      Object.assign(user, data, { updatedAt: new Date() });
      return {
        ...user,
        subscription: this.subscriptions.find((item) => item.userId === user.id) ?? null,
      };
    },
  };

  refreshToken = {
    create: async ({
      data,
    }: {
      data: Pick<RefreshToken, 'userId' | 'familyId' | 'tokenHash' | 'expiresAt'>;
    }) => {
      const token: RefreshToken = {
        id: randomUUID(),
        userId: data.userId,
        familyId: data.familyId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
        revokedAt: null,
        revokedReason: null,
        createdAt: new Date(),
      };
      this.refreshTokens.push(token);
      return token;
    },
    findUnique: async ({ where }: { where: { tokenHash: string } }) => {
      const token =
        this.refreshTokens.find((item) => item.tokenHash === where.tokenHash) ??
        null;
      if (!token) return null;

      return {
        ...token,
        user: {
          ...this.users.find((user) => user.id === token.userId)!,
          subscription: this.subscriptions.find((item) => item.userId === token.userId) ?? null,
        },
      };
    },
    update: async ({
      where,
      data,
    }: {
      where: { id: string };
      data: Partial<Pick<RefreshToken, 'revokedAt'>>;
    }) => {
      const token = this.refreshTokens.find((item) => item.id === where.id);
      if (!token) throw new Error('Token not found');
      Object.assign(token, data);
      return token;
    },
    updateMany: async ({
      where,
      data,
    }: {
      where: { id?: string; tokenHash?: string; userId?: string; familyId?: string; revokedAt?: null; expiresAt?: { gt: Date } };
      data: Partial<Pick<RefreshToken, 'revokedAt' | 'revokedReason'>>;
    }) => {
      const matches = this.refreshTokens.filter((token) => {
        if (where.id && token.id !== where.id) return false;
        if (where.tokenHash && token.tokenHash !== where.tokenHash) return false;
        if (where.userId && token.userId !== where.userId) return false;
        if (where.familyId && token.familyId !== where.familyId) return false;
        if (where.revokedAt === null && token.revokedAt !== null) return false;
        if (where.expiresAt?.gt && token.expiresAt <= where.expiresAt.gt) return false;
        return true;
      });
      matches.forEach((token) => Object.assign(token, data));
      return { count: matches.length };
    },
  };

  passwordResetToken = {
    create: async ({
      data,
    }: {
      data: Pick<PasswordResetToken, 'userId' | 'tokenHash' | 'expiresAt'>;
    }) => {
      const token: PasswordResetToken = {
        id: randomUUID(),
        userId: data.userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
        usedAt: null,
        createdAt: new Date(),
      };
      this.passwordResetTokens.push(token);
      return token;
    },
    findUnique: async ({ where }: { where: { tokenHash: string } }) =>
      this.passwordResetTokens.find(
        (token) => token.tokenHash === where.tokenHash
      ) ?? null,
    update: async ({
      where,
      data,
    }: {
      where: { id: string };
      data: Partial<Pick<PasswordResetToken, 'usedAt'>>;
    }) => {
      const token = this.passwordResetTokens.find((item) => item.id === where.id);
      if (!token) throw new Error('Reset token not found');
      Object.assign(token, data);
      return token;
    },
    updateMany: async ({
      where,
      data,
    }: {
      where: { userId?: string; id?: string; usedAt?: null; expiresAt?: { gt: Date } };
      data: Partial<Pick<PasswordResetToken, 'usedAt'>>;
    }) => {
      const matches = this.passwordResetTokens.filter((token) =>
        (!where.userId || token.userId === where.userId) &&
        (!where.id || token.id === where.id) &&
        (where.usedAt !== null || token.usedAt === null) &&
        (!where.expiresAt?.gt || token.expiresAt > where.expiresAt.gt)
      );
      matches.forEach((token) => Object.assign(token, data));
      return { count: matches.length };
    },
  };

  async $transaction<T>(input: Promise<T>[] | ((tx: this) => Promise<T>)): Promise<T[] | T> {
    return typeof input === 'function' ? input(this) : Promise.all(input);
  }
}

const config = {
  nodeEnvironment: NodeEnvironment.Test,
  authJwtSecret: 'test-only-playzenha-auth-secret-with-32-chars',
  authJwtIssuer: 'playzenha-api-test',
  authJwtAudience: 'playzenha-web-test',
  authAccessTokenTtlSeconds: 900,
  authRefreshTokenTtlSeconds: 60 * 60,
  authPasswordResetTtlSeconds: 60 * 60,
} as AppConfigService;

function createService() {
  const prisma = new InMemoryPrisma();
  const passwordService = new PasswordService();
  const tokenService = new TokenService(config, new JwtService());
  const googleTokenVerifier = {
    verify: jest.fn(),
  } as unknown as GoogleTokenVerifierService;
  const authService = new AuthService(
    prisma as unknown as PrismaService,
    passwordService,
    tokenService,
    googleTokenVerifier,
    config
  );

  return { authService, prisma };
}

describe('AuthService', () => {
  it('registers a user without exposing the password hash', async () => {
    const { authService, prisma } = createService();

    const response = await authService.register({
      nickname: 'Pedro',
      email: 'PEDRO@EMAIL.COM',
      password: 'senha-forte-123',
    });

    expect(response.user).toMatchObject({
      nickname: 'Pedro',
      email: 'pedro@email.com',
      role: 'player',
      planCode: 'free',
    });
    expect(response).not.toHaveProperty('user.passwordHash');
    expect(prisma.users[0]?.passwordHash).toMatch(/^scrypt\$/);
  });

  it('rejects duplicated e-mails with a safe error code', async () => {
    const { authService } = createService();
    const input = {
      nickname: 'Pedro',
      email: 'pedro@email.com',
      password: 'senha-forte-123',
    };

    await authService.register(input);
    await expect(authService.register(input)).rejects.toBeInstanceOf(
      ConflictException
    );
  });

  it('rejects invalid credentials with a generic message', async () => {
    const { authService } = createService();

    await authService.register({
      nickname: 'Pedro',
      email: 'pedro@email.com',
      password: 'senha-forte-123',
    });

    await expect(
      authService.login({
        email: 'pedro@email.com',
        password: 'senha-errada-123',
      })
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rotates refresh tokens and refuses a reused token', async () => {
    const { authService } = createService();
    const session = await authService.register({
      nickname: 'Pedro',
      email: 'pedro@email.com',
      password: 'senha-forte-123',
    });

    const refreshedSession = await authService.refresh(session.refreshToken);

    expect(refreshedSession.refreshToken).not.toBe(session.refreshToken);
    await expect(
      authService.refresh(session.refreshToken)
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('updates the nickname and returns it as the display name', async () => {
    const { authService } = createService();
    const session = await authService.register({
      nickname: 'Pedro',
      email: 'pedro@email.com',
      password: 'senha-forte-123',
    });

    const profile = await authService.updateProfile(session.user.id, {
      nickname: '  Pedrinho  ',
    });

    expect(profile).toMatchObject({
      nickname: 'Pedrinho',
    });
  });
});
