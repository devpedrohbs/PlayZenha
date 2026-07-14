import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { Game } from './domain/game.js';
import {
  GAMES_REPOSITORY,
  type GamesRepository,
} from './domain/games.repository.js';

@Injectable()
export class GamesService {
  constructor(
    @Inject(GAMES_REPOSITORY)
    private readonly gamesRepository: GamesRepository,
  ) {}

  findAll(): Promise<readonly Game[]> {
    return this.gamesRepository.findAll();
  }

  async findBySlug(slug: string): Promise<Game> {
    const game = await this.gamesRepository.findBySlug(slug);

    if (!game) {
      throw new NotFoundException(`Game with slug "${slug}" was not found`);
    }

    return game;
  }
}
