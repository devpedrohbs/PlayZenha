import type { GameDifficulty, GamePlan, GameStatus } from './games.types'

export const GAME_ROUTE_PREFIX = '/jogos'

export const GAME_CATALOG_FILTERS = [
  { value: 'all', label: 'Todos' },
  { value: 'Quebra-Gelo', label: 'Quebra-gelo' },
  { value: 'Blefe', label: 'Desafio' },
  { value: 'Festa', label: 'Festa' }
] as const

export const GAMES_PAGE_FILTERS = ['Todos', 'Em Alta', 'Novidades', 'Festa', 'Blefe', 'Estrategia', 'Casal', 'Familia', 'Quebra-Gelo', 'IA'] as const

export const GAME_DIFFICULTY_LABELS: Record<GameDifficulty, string> = {
  easy: 'facil',
  medium: 'media',
  hard: 'alta'
}

export const GAME_STATUS_LABELS: Record<GameStatus, string> = {
  available: 'Disponivel',
  'coming-soon': 'Em breve',
  disabled: 'Indisponivel'
}

export const GAME_PLAN_LABELS: Record<GamePlan, string> = {
  free: 'Free',
  premium: 'Premium',
  ultimate: 'Ultimate'
}
