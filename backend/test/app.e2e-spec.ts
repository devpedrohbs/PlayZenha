import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { configureApp } from '../src/app.setup.js';
import { AppConfigService } from '../src/config/app-config.service.js';
import type { Game } from '../src/modules/games/domain/game.js';
import { GAMES_REPOSITORY } from '../src/modules/games/domain/games.repository.js';
import { GamesController } from '../src/modules/games/games.controller.js';
import { GamesService } from '../src/modules/games/games.service.js';
import { GameAccessPolicyService } from '../src/modules/authorization/game-access-policy.service.js';
import { AccessTokenGuard } from '../src/modules/auth/guards/access-token.guard.js';
import { TokenService } from '../src/modules/auth/token.service.js';
import { HealthController } from '../src/modules/health/health.controller.js';
import { HealthService } from '../src/modules/health/health.service.js';
import type { SubscriptionPlan } from '../src/modules/subscriptions/domain/subscription-plan.js';
import { SUBSCRIPTION_PLANS_REPOSITORY } from '../src/modules/subscriptions/domain/subscription-plans.repository.js';
import { SubscriptionsController } from '../src/modules/subscriptions/subscriptions.controller.js';
import { SubscriptionsService } from '../src/modules/subscriptions/subscriptions.service.js';

const game: Game = {
  id: '1fc7d122-6c67-42a7-8337-f2a2ed5db4eb',
  slug: 'impostor',
  name: 'Impostor',
  shortDescription: 'Encontre o impostor.',
  category: 'Deduction',
  minPlayers: 3,
  maxPlayers: 16,
  averageDurationMinutes: 15,
  difficulty: 'easy',
  status: 'available',
  requiredPlan: 'free',
  tags: ['party'],
  featured: true,
  isNew: false,
  icon: null,
  colors: ['#0441F2', '#FFC603'],
};

const plan: SubscriptionPlan = {
  code: 'free',
  name: 'Free',
  priceCents: 0,
  currency: 'BRL',
  billingInterval: 'month',
  entitlements: ['play_free_games'],
  active: true,
};

describe('HTTP API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [
        HealthController,
        GamesController,
        SubscriptionsController,
      ],
      providers: [
        HealthService,
        GamesService,
        {
          provide: GameAccessPolicyService,
          useValue: { authorize: async () => ({}) },
        },
        {
          provide: AccessTokenGuard,
          useValue: { canActivate: () => false },
        },
        {
          provide: TokenService,
          useValue: { verifyAccessToken: () => ({ sub: 'test-user' }) },
        },
        SubscriptionsService,
        {
          provide: AppConfigService,
          useValue: {
            corsOrigins: ['http://localhost:5173'],
            swaggerEnabled: false,
          },
        },
        {
          provide: GAMES_REPOSITORY,
          useValue: {
            findAll: async () => [game],
            findBySlug: async (slug: string) =>
              slug === game.slug ? game : null,
          },
        },
        {
          provide: SUBSCRIPTION_PLANS_REPOSITORY,
          useValue: { findActive: async () => [plan] },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => app.close());

  it('GET /health', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);
    expect(response.body).toMatchObject({ status: 'ok', service: 'playzenha-api' });
  });

  it('GET /v1/games', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/games')
      .expect(200);
    expect(response.body).toEqual([game]);
  });

  it('GET /v1/games/:slug', async () => {
    await request(app.getHttpServer()).get('/v1/games/impostor').expect(200);
    await request(app.getHttpServer()).get('/v1/games/missing').expect(404);
  });

  it('GET /v1/subscriptions', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/subscriptions')
      .expect(200);
    expect(response.body).toEqual([plan]);
  });
});
