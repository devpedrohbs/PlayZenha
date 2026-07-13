export type QuemSouEuPhase =
  | 'setup'
  | 'writing-pass'
  | 'writing-reveal'
  | 'round-intro'
  | 'countdown'
  | 'guessing'
  | 'round-result'
  | 'final-results'

export interface QuemSouEuPlayer {
  id: number
  name: string
}

export interface QuemSouEuAssignment {
  writerId: number
  targetId: number
  character: string
}

export type QuemSouEuRoundStatus = 'acertou' | 'desistiu'

export interface QuemSouEuRoundResult {
  playerId: number
  status: QuemSouEuRoundStatus
  timeUsed: number
  character: string
}
