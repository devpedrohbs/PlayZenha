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
  id: string
  name: string
}

export interface QuemSouEuAssignment {
  writerId: string
  targetId: string
  character: string
}

export type QuemSouEuRoundStatus = 'acertou' | 'desistiu'

export interface QuemSouEuRoundResult {
  playerId: string
  status: QuemSouEuRoundStatus
  timeUsed: number
  character: string
}
