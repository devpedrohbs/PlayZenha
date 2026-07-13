export type ImpostorPhase =
  | 'setup'
  | 'role-distribution-start'
  | 'role-reveal'
  | 'game-start'
  | 'discussion'
  | 'voting-intro'
  | 'voting'
  | 'voting-results'

export type ImpostorRole = 'Impostor' | 'Cidadao'

export type ImpostorWinner = 'Impostor' | 'Cidadaos'

export interface ImpostorPlayer {
  id: number
  name: string
  role: ImpostorRole
  isAlive: boolean
  votes: number
}

export interface ImpostorGameState {
  phase: ImpostorPhase
  playerNames: string[]
  players: ImpostorPlayer[]
  revealOrder: number[]
  currentRevealStep: number
  theme: string
  discussionTime: number
  timeLeft: number
  selectedVote: number | null
  winner: ImpostorWinner | null
}

export interface CreateImpostorRoundInput {
  playerNames: string[]
  themeIndex: number
  impostorIndex: number
  revealOrder: number[]
}

export interface CreateImpostorRoundResult {
  players: ImpostorPlayer[]
  revealOrder: number[]
  theme: string
}
