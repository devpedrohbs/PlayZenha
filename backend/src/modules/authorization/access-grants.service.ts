import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class AccessGrantsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    actorUserId: string,
    input: {
      userId: string;
      startsAt?: string;
      expiresAt?: string;
      reason: string;
    }
  ) {
    const startsAt = input.startsAt ? new Date(input.startsAt) : new Date();
    const expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;
    const reason = input.reason.trim();

    if (expiresAt && expiresAt <= startsAt) {
      throw new BadRequestException({
        code: 'INVALID_GRANT_PERIOD',
        message: 'A expiracao deve ocorrer depois do inicio da concessao.',
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const target = await tx.user.findUnique({
        where: { id: input.userId },
        select: { id: true },
      });
      if (!target) throwGrantNotFound('Usuario nao encontrado.');

      const grant = await tx.accessGrant.create({
        data: {
          userId: input.userId,
          type: 'allGames',
          startsAt,
          expiresAt,
          reason,
          grantedByUserId: actorUserId,
        },
      });

      await tx.privilegedAuditLog.create({
        data: {
          actorUserId,
          targetUserId: input.userId,
          action: 'accessGrantCreated',
          resourceType: 'AccessGrant',
          resourceId: grant.id,
          reason,
          metadata: { type: grant.type, startsAt, expiresAt },
        },
      });

      return grant;
    });
  }

  async revoke(actorUserId: string, grantId: string, reasonInput: string) {
    const reason = reasonInput.trim();
    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      const grant = await tx.accessGrant.findUnique({ where: { id: grantId } });
      if (!grant || grant.revokedAt) {
        throwGrantNotFound('Concessao ativa nao encontrada.');
      }

      const updated = await tx.accessGrant.updateMany({
        where: { id: grantId, revokedAt: null },
        data: { revokedAt: now, revokedByUserId: actorUserId },
      });
      if (updated.count !== 1) {
        throwGrantNotFound('Concessao ativa nao encontrada.');
      }

      await tx.privilegedAuditLog.create({
        data: {
          actorUserId,
          targetUserId: grant.userId,
          action: 'accessGrantRevoked',
          resourceType: 'AccessGrant',
          resourceId: grant.id,
          reason,
          metadata: { type: grant.type, revokedAt: now },
        },
      });

      return { id: grant.id, revokedAt: now };
    });
  }
}

function throwGrantNotFound(message: string): never {
  throw new NotFoundException({ code: 'ACCESS_GRANT_NOT_FOUND', message });
}
