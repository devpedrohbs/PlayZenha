import { API_ENDPOINTS, apiClient } from '../../shared/api'
import type { GameCatalogItem, GameIconName } from './games.types'

interface GameResponse extends Omit<GameCatalogItem, 'colors' | 'icon'> {
  colors: readonly string[]
  icon: string | null
}

const GAME_ICONS = new Set<GameIconName>([
  'mask',
  'cards',
  'users',
  'spark',
  'bolt',
  'heart',
  'home',
  'target',
  'party',
  'brain',
  'star'
])

const isGameIcon = (icon: string): icon is GameIconName =>
  GAME_ICONS.has(icon as GameIconName)

export const mapGameResponse = (game: GameResponse): GameCatalogItem => ({
  ...game,
  icon: game.icon && isGameIcon(game.icon) ? game.icon : undefined,
  colors: game.colors.length >= 2 ? [game.colors[0], game.colors[1]] : undefined
})

export const listGames = async (signal: AbortSignal) => {
  const games = await apiClient.get<GameResponse[]>(API_ENDPOINTS.games, { signal })
  return games.map(mapGameResponse)
}
