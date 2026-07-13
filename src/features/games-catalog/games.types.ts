import type { PlanCode } from '../subscriptions'

export type GamePlan = PlanCode

export type GameStatus = 'available' | 'coming-soon' | 'disabled'

export type GameDifficulty = 'easy' | 'medium' | 'hard'

export type GameIconName =
  | 'mask'
  | 'cards'
  | 'users'
  | 'spark'
  | 'bolt'
  | 'heart'
  | 'home'
  | 'target'
  | 'party'
  | 'brain'
  | 'star'

export interface GameCatalogItem {
  id: string
  slug: string
  name: string
  shortDescription: string
  category: string
  minPlayers: number
  maxPlayers: number
  averageDurationMinutes: number
  difficulty: GameDifficulty
  status: GameStatus
  requiredPlan: GamePlan
  tags: string[]
  featured?: boolean
  isNew?: boolean
  icon?: GameIconName
  colors?: [string, string]
}

export type GamesCatalogFilter = 'all' | 'featured' | 'new' | string
