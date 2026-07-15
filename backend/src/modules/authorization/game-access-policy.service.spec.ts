import {
  ForbiddenException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';

import type { PrismaService } from '../../database/prisma.service.js';
import { GameAccessPolicyService } from './game-access-policy.service.js';

jest.mock('../../database/prisma.service.js', () => ({
  PrismaService: class PrismaService {},
}));

const activePlan = {
  code: 'free',
  name: 'Free',
  priceCents: 0,
  currency: 'BRL',
  billingInterval: 'month',
  entitlements: ['play_free_games'],
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const activeSubscription = {
  id: 'subscription-id',
  userId: 'user-id',
  planCode: 'free',
  status: 'active',
  startsAt: new Date(Date.now() - 60_000),
  currentPeriodEnd: null,
  canceledAt: null,
  provider: null,
  providerSubscriptionId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  plan: activePlan,
};

const activeUser = {
  id: 'user-id',
  nickname: 'Jogador',
  email: 'jogador@email.com',
  passwordHash: 'hidden',
  role: 'player',
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date(),
  subscription: activeSubscription,
  accessGrants: [],
};

const availableGame = {
  id: 'game-id',
  slug: 'impostor',
  name: 'Impostor',
  requiredPlan: 'free',
  content: {
    id: 'content-id',
    gameId: 'game-id',
    version: 1,
    payload: { themes: ['Tema seguro'] },
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

function createPolicy(user: unknown = activeUser, game: unknown = availableGame) {
  const prisma = {
    user: { findUnique: jest.fn().mockResolvedValue(user) },
    game: { findFirst: jest.fn().mockResolvedValue(game) },
  };
  return {
    policy: new GameAccessPolicyService(prisma as unknown as PrismaService),
    prisma,
  };
}

describe('GameAccessPolicyService', () => {
  it('denies an unknown identity', async () => {
    const { policy } = createPolicy(null);
    await expect(policy.authorize('missing', 'impostor')).rejects.toBeInstanceOf(
      UnauthorizedException
    );
  });

  it('denies a suspended administrator before commercial bypass', async () => {
    const { policy, prisma } = createPolicy({
      ...activeUser,
      role: 'admin',
      status: 'suspended',
    });
    await expect(policy.authorize('user-id', 'impostor')).rejects.toBeInstanceOf(
      ForbiddenException
    );
    expect(prisma.game.findFirst).not.toHaveBeenCalled();
  });

  it('hides unpublished or disabled games', async () => {
    const { policy } = createPolicy(activeUser, null);
    await expect(policy.authorize('user-id', 'disabled')).rejects.toBeInstanceOf(
      NotFoundException
    );
  });

  it('allows an entitlement from an active subscription', async () => {
    const { policy } = createPolicy();
    await expect(policy.authorize('user-id', 'impostor')).resolves.toMatchObject({
      source: 'subscription',
      content: { themes: ['Tema seguro'] },
    });
  });

  it('denies an expired subscription', async () => {
    const { policy } = createPolicy({
      ...activeUser,
      subscription: {
        ...activeSubscription,
        currentPeriodEnd: new Date(Date.now() - 1),
      },
    });
    await expect(policy.authorize('user-id', 'impostor')).rejects.toBeInstanceOf(
      ForbiddenException
    );
  });

  it('denies a Free subscription for a Premium game', async () => {
    const { policy } = createPolicy(activeUser, {
      ...availableGame,
      requiredPlan: 'premium',
    });
    await expect(policy.authorize('user-id', 'impostor')).rejects.toBeInstanceOf(
      ForbiddenException
    );
  });

  it('allows Premium and Ultimate entitlements only when explicitly granted', async () => {
    const premiumUser = {
      ...activeUser,
      subscription: {
        ...activeSubscription,
        planCode: 'ultimate',
        plan: {
          ...activePlan,
          code: 'ultimate',
          entitlements: [
            'play_free_games',
            'play_premium_games',
            'play_adult_games',
          ],
        },
      },
    };
    const { policy } = createPolicy(premiumUser, {
      ...availableGame,
      requiredPlan: 'ultimate',
    });
    await expect(policy.authorize('user-id', 'impostor')).resolves.toMatchObject({
      source: 'subscription',
    });
  });

  it('allows an active administrator without a subscription', async () => {
    const { policy } = createPolicy({
      ...activeUser,
      role: 'admin',
      subscription: null,
    });
    await expect(policy.authorize('user-id', 'impostor')).resolves.toMatchObject({
      source: 'administrator',
    });
  });

  it('allows an active ALL_GAMES grant without making the user admin', async () => {
    const { policy } = createPolicy({
      ...activeUser,
      subscription: null,
      accessGrants: [{ id: 'grant-id', type: 'allGames' }],
    });
    await expect(policy.authorize('user-id', 'impostor')).resolves.toMatchObject({
      source: 'allGamesGrant',
    });
  });

  it('fails closed when stored protected content is malformed', async () => {
    const { policy } = createPolicy(activeUser, {
      ...availableGame,
      content: { ...availableGame.content, payload: { themes: [] } },
    });
    await expect(policy.authorize('user-id', 'impostor')).rejects.toBeInstanceOf(
      ServiceUnavailableException
    );
  });

  it('does not return content when the database lookup fails', async () => {
    const { policy, prisma } = createPolicy();
    prisma.user.findUnique.mockRejectedValueOnce(new Error('database unavailable'));
    await expect(policy.authorize('user-id', 'impostor')).rejects.toThrow(
      'database unavailable'
    );
    expect(prisma.game.findFirst).not.toHaveBeenCalled();
  });
});
