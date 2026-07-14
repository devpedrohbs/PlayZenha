import { NotFoundException } from '@nestjs/common';

import type { Game } from './domain/game.js';
import type { GamesRepository } from './domain/games.repository.js';
import { GamesService } from './games.service.js';

const game: Game = {
  id: '1fc7d122-6c67-42a7-8337-f2a2ed5db4eb',
  slug: 'impostor',
  name: 'Impostor',
  shortDescription: 'Encontre quem nao conhece a palavra secreta.',
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

describe('GamesService', () => {
  const repository: jest.Mocked<GamesRepository> = {
    findAll: jest.fn(),
    findBySlug: jest.fn(),
  };
  const service = new GamesService(repository);

  beforeEach(() => jest.clearAllMocks());

  it('returns games from the repository', async () => {
    repository.findAll.mockResolvedValue([game]);

    await expect(service.findAll()).resolves.toEqual([game]);
  });

  it('returns a game by slug', async () => {
    repository.findBySlug.mockResolvedValue(game);

    await expect(service.findBySlug('impostor')).resolves.toEqual(game);
    expect(repository.findBySlug).toHaveBeenCalledWith('impostor');
  });

  it('throws when the slug does not exist', async () => {
    repository.findBySlug.mockResolvedValue(null);

    await expect(service.findBySlug('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
