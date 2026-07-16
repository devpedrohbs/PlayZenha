export type QuemEstaMentindoPhase =
  | 'setup'
  | 'settings'
  | 'role-distribution-start'
  | 'role-reveal'
  | 'question'
  | 'discussion'
  | 'voting-intro'
  | 'voting-distribution-start'
  | 'voting'
  | 'results'

export type QuemEstaMentindoRole = 'Mentiroso' | 'Verdadeiro'
export type QuemEstaMentindoDifficulty = 'Leve' | 'Médio' | 'Sem filtro'
export type QuemEstaMentindoWinner = 'Grupo' | 'Mentirosos'

export type QuemEstaMentindoCategory =
  | 'Cotidiano'
  | 'Preferências'
  | 'Situações absurdas'
  | 'Relacionamentos'
  | 'Trabalho e estudos'
  | 'Constrangedoras'

export interface QuemEstaMentindoQuestion {
  category: QuemEstaMentindoCategory
  text: string
  personal: boolean
  difficulty: QuemEstaMentindoDifficulty
}

export interface QuemEstaMentindoPlayer {
  id: string
  name: string
  role: QuemEstaMentindoRole
  score: number
}

export interface QuemEstaMentindoSettings {
  rounds: number
  responseTime: number
  discussionTime: number
  difficulty: QuemEstaMentindoDifficulty
  categories: QuemEstaMentindoCategory[]
  scoringEnabled: boolean
  allowPersonalQuestions: boolean
  doubleLie: boolean
}

export interface QuemEstaMentindoResult {
  winner: QuemEstaMentindoWinner
  liarIds: string[]
  voteCounts: Record<string, number>
  correctVoterIds: string[]
  topVotedIds: string[]
}

export interface QuemEstaMentindoGameState {
  phase: QuemEstaMentindoPhase
  playerNames: string[]
  players: QuemEstaMentindoPlayer[]
  settings: QuemEstaMentindoSettings
  round: number
  revealOrder: string[]
  currentRevealStep: number
  votingOrder: string[]
  currentVotingStep: number
  selectedVote: string | null
  votes: Record<string, string>
  question: QuemEstaMentindoQuestion | null
  timeLeft: number
  result: QuemEstaMentindoResult | null
  feedback: string
}

export interface CreateQuemEstaMentindoRoundInput {
  playerNames: string[]
  liarIndexes: number[]
  revealOrder?: string[]
  question: QuemEstaMentindoQuestion
}

export interface CreateQuemEstaMentindoRoundResult {
  players: QuemEstaMentindoPlayer[]
  revealOrder: string[]
  question: QuemEstaMentindoQuestion
}
