export type ContatoPhase =
  | 'setup'
  | 'judge-draw'
  | 'judge-word-start'
  | 'judge-word-reveal'
  | 'round-play'
  | 'round-result'

export interface ContatoPlayer {
  id: string
  name: string
}

export interface ContatoGameState {
  phase: ContatoPhase
  playerNames: string[]
  players: ContatoPlayer[]
  round: number
  rotateJudge: boolean
  judgeId: string | null
  currentWord: string
  revealedLetters: number
  lastWord: string
  roundStartedAtMs: number | null
  wordRevealedAtMs: number | null
  feedback: string
}

export interface ContatoRoundSetup {
  judgeId: string
  word: string
  round: number
}
