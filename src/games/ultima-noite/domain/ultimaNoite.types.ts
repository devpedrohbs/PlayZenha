export type UltimaNoiteRole = 'Lobo' | 'Anjo' | 'Detetive' | 'Cidadão' | 'Mediador'

export type UltimaNoitePhase =
  | 'setup'
  | 'role-distribution-start'
  | 'role-reveal'
  | 'night-intro'
  | 'night-angel'
  | 'night-wolf'
  | 'night-detective'
  | 'morning'
  | 'discussion'
  | 'voting-start'
  | 'voting'
  | 'voting-suspense'
  | 'voting-results'
  | 'game-over'

export type UltimaNoiteWinner = 'Lobos' | 'Cidadãos'

export interface UltimaNoitePlayer {
  id: number
  name: string
  role: UltimaNoiteRole
  isAlive: boolean
  votes: number
}

export interface UltimaNoiteVotingResolution {
  players: UltimaNoitePlayer[]
  eliminatedPlayerId: number | null
  isTie: boolean
  winner: UltimaNoiteWinner | null
}

export interface UltimaNoiteSettings {
  wolvesCount: number
  hasAngel: boolean
  hasDetective: boolean
  hasMediator: boolean
}
