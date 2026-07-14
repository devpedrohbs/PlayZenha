import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';

describe('PostgreSQL integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => app.close());

  it('reads seeded games through the Prisma repository', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/games')
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ slug: 'impostor', requiredPlan: 'free' }),
      ]),
    );
  });

  it('reads seeded plans through the Prisma repository', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/subscriptions')
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'ultimate', priceCents: 3490 }),
      ]),
    );
  });
});
