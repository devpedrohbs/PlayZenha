import type { ContatoGameState } from './contato.types'

export const CONTATO_PLAYER_COUNT = 3
export const CONTATO_DEFAULT_PLAYER_NAMES = ['', '', '']

export const CONTATO_WORD_BANK = [
  'BACIA',
  'ABACAXI',
  'PIPOCA',
  'CADEIRA',
  'GIRAFA',
  'BICICLETA',
  'CHUVEIRO',
  'ESTOJO',
  'TOMATE',
  'SORVETE',
  'FUTEBOL',
  'LANTERNA',
  'CACHORRO',
  'JANELA',
  'VIOLAO',
  'PANELA',
  'TRAVESSEIRO',
  'MELANCIA',
  'PIRULITO',
  'LIVRARIA'
]

export const INITIAL_CONTATO_STATE: ContatoGameState = {
  phase: 'setup',
  playerNames: CONTATO_DEFAULT_PLAYER_NAMES,
  players: [],
  round: 1,
  rotateJudge: true,
  judgeId: null,
  currentWord: '',
  revealedLetters: 1,
  lastWord: '',
  roundStartedAtMs: null,
  wordRevealedAtMs: null,
  feedback: ''
}
