import { ConflictException } from '@nestjs/common';

import type { AppConfigService } from '../../config/app-config.service.js';
import type { PrismaService } from '../../database/prisma.service.js';
import { AuthService } from './auth.service.js';
import type { GoogleTokenVerifierService } from './google-token-verifier.service.js';
import type { PasswordService } from './password.service.js';
import type { TokenService } from './token.service.js';

jest.mock('../../database/prisma.service.js', () => ({
  PrismaService: class PrismaService {},
}));

const user = {
  id: '10fa81c7-7fba-4bce-bcb8-6a052fd52ad2',
  nickname: 'Jogador Google',
  email: 'jogador@gmail.com',
  passwordHash: null,
  role: 'player' as const,
  status: 'active' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  subscription: {
    id: '2b7bc277-e50c-4e7e-a162-99c07ae90112',
    userId: '10fa81c7-7fba-4bce-bcb8-6a052fd52ad2',
    planCode: 'free' as const,
    status: 'active' as const,
    startsAt: new Date(),
    currentPeriodEnd: null,
    canceledAt: null,
    provider: null,
    providerSubscriptionId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

describe('AuthService Google login', () => {
  it('creates a passwordless internal user and a free subscription', async () => {
    const tx = {
      externalIdentity: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn(),
      },
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(user),
      },
    };
    const { service, prisma } = createService(tx);

    const session = await service.loginWithGoogle('signed-id-token');

    expect(tx.user.create).toHaveBeenCalledWith({
      data: {
        nickname: 'Jogador Google',
        email: 'jogador@gmail.com',
        passwordHash: null,
        subscription: { create: { planCode: 'free', status: 'active' } },
        externalIdentities: {
          create: {
            provider: 'google',
            providerSubject: 'google-subject-123',
            email: 'jogador@gmail.com',
          },
        },
      },
      include: { subscription: true },
    });
    expect(prisma.refreshToken.create).toHaveBeenCalled();
    expect(session.user).toMatchObject({
      email: 'jogador@gmail.com',
      planCode: 'free',
    });
  });

  it('does not silently link a non-Google-managed e-mail', async () => {
    const tx = {
      externalIdentity: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn(),
      },
      user: {
        findUnique: jest.fn().mockResolvedValue(user),
        create: jest.fn(),
      },
    };
    const { service } = createService(tx, false);

    await expect(
      service.loginWithGoogle('signed-id-token')
    ).rejects.toBeInstanceOf(ConflictException);
    expect(tx.externalIdentity.create).not.toHaveBeenCalled();
  });
});

function createService(tx: object, emailIsGoogleAuthoritative = true) {
  const prisma = {
    $transaction: jest.fn(async (callback: (transaction: object) => unknown) =>
      callback(tx)
    ),
    externalIdentity: { findUnique: jest.fn() },
    refreshToken: { create: jest.fn() },
  };
  const verifier = {
    verify: jest.fn().mockResolvedValue({
      subject: 'google-subject-123',
      email: 'jogador@gmail.com',
      nickname: 'Jogador Google',
      emailIsGoogleAuthoritative,
    }),
  };
  const tokenService = {
    createOpaqueToken: jest.fn().mockReturnValue('refresh-token'),
    hashOpaqueToken: jest.fn().mockReturnValue('refresh-token-hash'),
    createAccessToken: jest.fn().mockReturnValue('access-token'),
  };
  const config = {
    authAccessTokenTtlSeconds: 900,
    authRefreshTokenTtlSeconds: 3600,
  };
  const service = new AuthService(
    prisma as unknown as PrismaService,
    {} as PasswordService,
    tokenService as unknown as TokenService,
    verifier as unknown as GoogleTokenVerifierService,
    config as AppConfigService
  );

  return { service, prisma };
}
