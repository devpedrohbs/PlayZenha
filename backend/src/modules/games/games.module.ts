import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AuthorizationModule } from '../authorization/authorization.module.js';

import { GAMES_REPOSITORY } from './domain/games.repository.js';
import { GamesController } from './games.controller.js';
import { GamesService } from './games.service.js';
import { PrismaGamesRepository } from './infrastructure/prisma-games.repository.js';

@Module({
  imports: [AuthModule, AuthorizationModule],
  controllers: [GamesController],
  providers: [
    GamesService,
    { provide: GAMES_REPOSITORY, useClass: PrismaGamesRepository },
  ],
})
export class GamesModule {}
