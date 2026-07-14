import { Module } from '@nestjs/common';

import { GAMES_REPOSITORY } from './domain/games.repository.js';
import { GamesController } from './games.controller.js';
import { GamesService } from './games.service.js';
import { PrismaGamesRepository } from './infrastructure/prisma-games.repository.js';

@Module({
  controllers: [GamesController],
  providers: [
    GamesService,
    { provide: GAMES_REPOSITORY, useClass: PrismaGamesRepository },
  ],
})
export class GamesModule {}
