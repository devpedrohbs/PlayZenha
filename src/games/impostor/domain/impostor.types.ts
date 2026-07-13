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
  id: string
  name: string
  role: ImpostorRole
  isAlive: boolean
  votes: number
}

export interface ImpostorGameState {
  phase: ImpostorPhase
  playerNames: string[]
  players: ImpostorPlayer[]
  revealOrder: string[]
  currentRevealStep: number
  theme: string
  discussionTime: number
  timeLeft: number
  selectedVote: string | null
  winner: ImpostorWinner | null
  feedback: string
}

export interface CreateImpostorRoundInput {
  playerNames: string[]
  themeIndex: number
  impostorIndex: number
  revealOrder: string[]
}

export interface CreateImpostorRoundResult {
  players: ImpostorPlayer[]
  revealOrder: string[]
  theme: string
}
