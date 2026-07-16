import { describe, expect, it } from 'vitest'
import { filterGamesCatalog } from './games.selectors'
import type { GameCatalogItem } from './games.types'

const game = (id: string, status: GameCatalogItem['status']): GameCatalogItem => ({
  id,
  slug: id,
  name: id,
  shortDescription: 'Jogo para testar a ordem da biblioteca.',
  category: 'Festa',
  minPlayers: 3,
  maxPlayers: 8,
  averageDurationMinutes: 15,
  difficulty: 'easy',
  status,
  requiredPlan: 'free',
  tags: [],
  featured: false,
  isNew: false,
  icon: 'spark',
  colors: ['#111111', '#eeeeee']
})

describe('filterGamesCatalog', () => {
  it('keeps available games before locked games without changing their relative order', () => {
    const games = [game('bloqueado-1', 'coming-soon'), game('disponivel-1', 'available'), game('bloqueado-2', 'coming-soon'), game('disponivel-2', 'available')]

    expect(filterGamesCatalog(games, 'Todos').map(({ id }) => id)).toEqual([
      'disponivel-1',
      'disponivel-2',
      'bloqueado-1',
      'bloqueado-2'
    ])
    expect(games.map(({ id }) => id)).toEqual(['bloqueado-1', 'disponivel-1', 'bloqueado-2', 'disponivel-2'])
  })
})
