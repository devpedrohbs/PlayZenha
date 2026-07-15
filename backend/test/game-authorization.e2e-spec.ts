import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import request from 'supertest';

import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';
import { PrismaService } from '../src/database/prisma.service.js';

interface AuthResponseBody {
  tokens: { accessToken: string };
  user: { planCode: string | null; status: string };
}

interface StartGameResponseBody {
  content: { themes: unknown[] };
}

describe('Game authorization (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const email = `security-${randomUUID()}@playzenha.test`;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
    await app.close();
  });

  it('returns 401 without a validated JWT and ignores spoofed headers', async () => {
    await request(app.getHttpServer())
      .post('/v1/games/impostor/start')
      .set('x-user-role', 'admin')
      .set('x-user-plan', 'ultimate')
      .send({ userId: randomUUID() })
      .expect(401);
  });

  it('creates an explicit free subscription and returns protected content', async () => {
    const registration = await request(app.getHttpServer())
      .post('/v1/auth/register')
      .send({ nickname: 'Teste Seguro', email, password: 'senha-segura-123' })
      .expect(201);
    const registrationBody = registration.body as unknown as AuthResponseBody;

    expect(registration.headers['set-cookie']?.[0]).toContain('HttpOnly');
    expect(registrationBody.tokens).not.toHaveProperty('refreshToken');
    expect(registrationBody.user).toMatchObject({ planCode: 'free', status: 'active' });

    const response = await request(app.getHttpServer())
      .post('/v1/games/impostor/start')
      .set('Authorization', `Bearer ${registrationBody.tokens.accessToken}`)
      .send({})
      .expect(200);
    const responseBody = response.body as unknown as StartGameResponseBody;

    expect(response.body).toMatchObject({
      source: 'subscription',
      game: { slug: 'impostor', requiredPlan: 'free' },
    });
    expect(responseBody.content.themes.length).toBeGreaterThan(0);
  });

  it('denies every available Premium game to a Free subscription', async () => {
    const login = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({ email, password: 'senha-segura-123' })
      .expect(200);
    const loginBody = login.body as unknown as AuthResponseBody;

    const contatoDenied = await request(app.getHttpServer())
      .post('/v1/games/contato/start')
      .set('Authorization', `Bearer ${loginBody.tokens.accessToken}`)
      .send({})
      .expect(403);
    expect(contatoDenied.body).toMatchObject({
      code: 'GAME_ACCESS_DENIED',
      game: { name: 'Contato', requiredPlan: 'premium' },
    });

    await request(app.getHttpServer())
      .post('/v1/games/ultima-noite/start')
      .set('Authorization', `Bearer ${loginBody.tokens.accessToken}`)
      .send({})
      .expect(403);

    await request(app.getHttpServer())
      .post('/v1/games/quem-sou-eu/start')
      .set('Authorization', `Bearer ${loginBody.tokens.accessToken}`)
      .send({})
      .expect(403);
  });

  it('allows a Premium subscription to start a Premium game', async () => {
    await prisma.userSubscription.update({
      where: { userId: (await prisma.user.findUniqueOrThrow({ where: { email } })).id },
      data: { planCode: 'premium' },
    });

    const login = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({ email, password: 'senha-segura-123' })
      .expect(200);
    const loginBody = login.body as unknown as AuthResponseBody;

    await request(app.getHttpServer())
      .post('/v1/games/contato/start')
      .set('Authorization', `Bearer ${loginBody.tokens.accessToken}`)
      .send({})
      .expect(200);
  });

  it('denies a suspended account even with its previously issued token', async () => {
    const login = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({ email, password: 'senha-segura-123' })
      .expect(200);
    const loginBody = login.body as unknown as AuthResponseBody;

    await prisma.user.update({ where: { email }, data: { status: 'suspended' } });

    await request(app.getHttpServer())
      .post('/v1/games/impostor/start')
      .set('Authorization', `Bearer ${loginBody.tokens.accessToken}`)
      .send({})
      .expect(403);
  });

  it('rejects a tampered access token', async () => {
    await request(app.getHttpServer())
      .post('/v1/games/impostor/start')
      .set('Authorization', 'Bearer forged.header.signature')
      .send({})
      .expect(401);
  });
});
