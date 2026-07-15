import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

import type { AuthenticatedUser } from '../auth.types.js';
import { TokenService } from '../token.service.js';

export type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = extractBearerToken(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException({
        code: 'AUTH_REQUIRED',
        message: 'Entre para acessar esta area.',
      });
    }

    request.user = this.tokenService.verifyAccessToken(token);
    return true;
  }
}

function extractBearerToken(value: unknown): string | null {
  if (typeof value !== 'string') return null;

  const [scheme, token] = value.split(' ');
  if (scheme !== 'Bearer' || !token) return null;

  return token;
}
