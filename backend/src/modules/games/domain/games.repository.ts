import type { Game } from './game.js';

export const GAMES_REPOSITORY = Symbol('GAMES_REPOSITORY');

export interface GamesRepository {
  findAll(): Promise<readonly Game[]>;
  findBySlug(slug: string): Promise<Game | null>;
}
