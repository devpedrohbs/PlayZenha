import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHmac, randomBytes } from 'node:crypto';

import { AppConfigService } from '../../config/app-config.service.js';
import type { AuthenticatedUser } from './auth.types.js';

interface AccessTokenPayload extends AuthenticatedUser {
  type: 'access';
}

@Injectable()
export class TokenService {
  constructor(
    private readonly config: AppConfigService,
    private readonly jwtService: JwtService
  ) {}

  createAccessToken(user: AuthenticatedUser): string {
    const payload: AccessTokenPayload = {
      ...user,
      type: 'access',
    };

    return this.jwtService.sign(payload, {
      algorithm: 'HS256',
      audience: this.config.authJwtAudience,
      expiresIn: this.config.authAccessTokenTtlSeconds,
      issuer: this.config.authJwtIssuer,
      secret: this.config.authJwtSecret,
    });
  }

  verifyAccessToken(token: string): AuthenticatedUser {
    let payload: Record<string, unknown>;

    try {
      payload = this.jwtService.verify<Record<string, unknown>>(token, {
        algorithms: ['HS256'],
        audience: this.config.authJwtAudience,
        issuer: this.config.authJwtIssuer,
        secret: this.config.authJwtSecret,
      });
    } catch {
      throwInvalidToken();
    }

    if (
      payload.type !== 'access' ||
      typeof payload.sub !== 'string'
    ) {
      throw new UnauthorizedException({
        code: 'INVALID_ACCESS_TOKEN',
        message: 'Sessao invalida. Entre novamente.',
      });
    }

    return {
      sub: payload.sub,
    };
  }

  createOpaqueToken(): string {
    return randomBytes(48).toString('base64url');
  }

  hashOpaqueToken(token: string): string {
    return createHmac('sha256', this.config.authJwtSecret)
      .update(token)
      .digest('hex');
  }

  private sign(value: string): string {
    return createHmac('sha256', this.config.authJwtSecret)
      .update(value)
      .digest('base64url');
  }
}

function throwInvalidToken(): never {
  throw new UnauthorizedException({
    code: 'INVALID_ACCESS_TOKEN',
    message: 'Sessao invalida. Entre novamente.',
  });
}
