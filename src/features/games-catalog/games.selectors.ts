import { GAME_DIFFICULTY_LABELS, GAME_ROUTE_PREFIX } from './games.constants'
import type { GameCatalogItem, GamesCatalogFilter } from './games.types'

export const getGamePath = (game: GameCatalogItem) =>
  game.status === 'available' ? `${GAME_ROUTE_PREFIX}/${game.slug}` : undefined

export const isGameAvailable = (game: GameCatalogItem) => game.status === 'available'

export const getAvailableGames = (games: GameCatalogItem[]) => games.filter(isGameAvailable)

export const getHomeFeaturedGames = (games: GameCatalogItem[]) =>
  games.filter(isGameAvailable).slice(0, 4)

export const getGameCategories = (games: GameCatalogItem[]) =>
  Array.from(new Set(games.map((game) => game.category)))

export const normalizeCatalogSearch = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export const formatPlayersRange = (game: GameCatalogItem) =>
  game.minPlayers === game.maxPlayers ? String(game.minPlayers) : `${game.minPlayers}-${game.maxPlayers}`

export const formatDuration = (game: GameCatalogItem) => `${game.averageDurationMinutes} min`

export const mapDifficultyLabel = (game: GameCatalogItem) =>
  GAME_DIFFICULTY_LABELS[game.difficulty]

export const filterGamesCatalog = (games: GameCatalogItem[], activeFilter: GamesCatalogFilter, query = '') => {
  const normalizedQuery = normalizeCatalogSearch(query.trim())

  return games.filter((game) => {
    const matchesFilter =
      activeFilter === 'all' ||
      activeFilter === 'Todos' ||
      (activeFilter === 'featured' && game.featured) ||
      (activeFilter === 'Em Alta' && game.featured) ||
      (activeFilter === 'new' && game.isNew) ||
      (activeFilter === 'Novidades' && game.isNew) ||
      game.category === activeFilter

    const searchable = normalizeCatalogSearch([
      game.name,
      game.category,
      game.shortDescription,
      game.difficulty,
      game.requiredPlan,
      game.status,
      ...game.tags
    ].join(' '))

    return matchesFilter && (!normalizedQuery || searchable.includes(normalizedQuery))
  }).sort((first, second) => Number(second.status === 'available') - Number(first.status === 'available'))
}
