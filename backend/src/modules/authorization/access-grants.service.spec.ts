import type { PrismaService } from '../../database/prisma.service.js';
import { AccessGrantsService } from './access-grants.service.js';

jest.mock('../../database/prisma.service.js', () => ({
  PrismaService: class PrismaService {},
}));

describe('AccessGrantsService', () => {
  it('creates the grant and immutable audit event in the same transaction', async () => {
    const accessGrantCreate = jest.fn(
      async (input: { data: Record<string, unknown> }) => {
        void input;
        return {
          id: 'grant-id',
          userId: 'target-id',
          type: 'allGames',
          startsAt: new Date(),
          expiresAt: null,
        };
      }
    );
    const auditCreate = jest.fn(
      async (input: { data: Record<string, unknown> }) => {
        void input;
        return {};
      }
    );
    const tx = {
      user: { findUnique: jest.fn().mockResolvedValue({ id: 'target-id' }) },
      accessGrant: { create: accessGrantCreate },
      privilegedAuditLog: { create: auditCreate },
    };
    const prisma = {
      $transaction: jest.fn((operation: (client: typeof tx) => unknown) => operation(tx)),
    };
    const service = new AccessGrantsService(prisma as unknown as PrismaService);

    await service.create('admin-id', {
      userId: 'target-id',
      reason: 'Concessao de suporte aprovada',
    });

    expect(accessGrantCreate.mock.calls[0]?.[0].data).toMatchObject({
      userId: 'target-id',
      grantedByUserId: 'admin-id',
      type: 'allGames',
    });
    expect(auditCreate.mock.calls[0]?.[0].data).toMatchObject({
      actorUserId: 'admin-id',
      targetUserId: 'target-id',
      action: 'accessGrantCreated',
      resourceId: 'grant-id',
    });
  });

  it('records actor, target and reason when revoking a grant', async () => {
    const auditCreate = jest.fn(
      async (input: { data: Record<string, unknown> }) => {
        void input;
        return {};
      }
    );
    const tx = {
      accessGrant: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'grant-id',
          userId: 'target-id',
          type: 'allGames',
          revokedAt: null,
        }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      privilegedAuditLog: { create: auditCreate },
    };
    const prisma = {
      $transaction: jest.fn((operation: (client: typeof tx) => unknown) => operation(tx)),
    };
    const service = new AccessGrantsService(prisma as unknown as PrismaService);

    await service.revoke('admin-id', 'grant-id', 'Acesso temporario encerrado');

    expect(auditCreate.mock.calls[0]?.[0].data).toMatchObject({
      actorUserId: 'admin-id',
      targetUserId: 'target-id',
      action: 'accessGrantRevoked',
      reason: 'Acesso temporario encerrado',
    });
  });
});
