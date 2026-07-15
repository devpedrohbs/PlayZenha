import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PrismaService } from '../../../database/prisma.service.js';
import type { AuthenticatedRequest } from '../../auth/guards/access-token.guard.js';
import {
  REQUIRED_PERMISSION_KEY,
} from './require-permission.decorator.js';
import {
  ROLE_PERMISSIONS,
  type ApplicationPermission,
} from './permission.types.js';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.getAllAndOverride<ApplicationPermission>(
      REQUIRED_PERMISSION_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!permission) throwPermissionDenied();

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = await this.prisma.user.findUnique({
      where: { id: request.user.sub },
      select: { role: true, status: true },
    });

    const permissions: readonly ApplicationPermission[] = ROLE_PERMISSIONS[user?.role ?? 'player'];

    if (
      !user ||
      user.status !== 'active' ||
      !permissions.includes(permission)
    ) {
      throwPermissionDenied();
    }

    return true;
  }
}

function throwPermissionDenied(): never {
  throw new ForbiddenException({
    code: 'PERMISSION_DENIED',
    message: 'Voce nao possui permissao para esta operacao.',
  });
}
