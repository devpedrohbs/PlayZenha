import { Injectable } from '@nestjs/common';

import type { Game as PrismaGame } from '../../../generated/prisma/client.js';
import { PrismaService } from '../../../database/prisma.service.js';
import type {
  Game,
  GameStatus,
} from '../domain/game.js';
import type { GamesRepository } from '../domain/games.repository.js';

const gameStatusMap = {
  available: 'available',
  comingSoon: 'coming-soon',
  disabled: 'disabled',
} as const satisfies Record<PrismaGame['status'], GameStatus>;

@Injectable()
export class PrismaGamesRepository implements GamesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<readonly Game[]> {
    const games = await this.prisma.game.findMany({
      orderBy: [{ featured: 'desc' }, { name: 'asc' }],
    });

    return games.map(mapGame);
  }

  async findBySlug(slug: string): Promise<Game | null> {
    const game = await this.prisma.game.findUnique({ where: { slug } });
    return game ? mapGame(game) : null;
  }
}

function mapGame(game: PrismaGame): Game {
  return {
    ...game,
    difficulty: game.difficulty,
    status: gameStatusMap[game.status],
    requiredPlan: game.requiredPlan,
    tags: [...game.tags],
    colors: [...game.colors],
  };
}
