export type ContatoPhase =
  | 'setup'
  | 'judge-draw'
  | 'judge-word-start'
  | 'judge-word-reveal'
  | 'round-play'
  | 'round-result'

export type ContatoRoundWinner = 'Adivinhadores' | 'Juiz'

export interface ContatoPlayer {
  id: number
  name: string
}

export interface ContatoGameState {
  phase: ContatoPhase
  playerNames: string[]
  players: ContatoPlayer[]
  round: number
  rotateJudge: boolean
  judgeId: number | null
  currentWord: string
  revealedLetters: number
  lastWord: string
  roundWinner: ContatoRoundWinner | null
  feedback: string
}

export interface ContatoRoundSetup {
  judgeId: number
  word: string
  round: number
}
