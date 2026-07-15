import type { ImpostorGameState, ImpostorPhase } from './impostor.types'

export const IMPOSTOR_MIN_PLAYERS = 3
export const IMPOSTOR_MAX_PLAYERS = 16
export const IMPOSTOR_DEFAULT_PLAYER_NAMES = ['', '', '']
export const IMPOSTOR_DEFAULT_DISCUSSION_TIME = 180
export const IMPOSTOR_MIN_DISCUSSION_TIME = 60
export const IMPOSTOR_MAX_DISCUSSION_TIME = 900
export const IMPOSTOR_DISCUSSION_STEP = 60

export const IMPOSTOR_PHASE_LABEL: Record<ImpostorPhase, string> = {
  setup: 'Configuracao',
  'role-distribution-start': 'Passe o celular',
  'role-reveal': 'Papel secreto',
  'game-start': 'Investigacao',
  discussion: 'Timer',
  'voting-intro': 'Alerta',
  voting: 'Votacao',
  'voting-results': 'Resultado'
}

export const INITIAL_IMPOSTOR_STATE: ImpostorGameState = {
  phase: 'setup',
  playerNames: IMPOSTOR_DEFAULT_PLAYER_NAMES,
  players: [],
  revealOrder: [],
  currentRevealStep: 0,
  theme: '',
  discussionTime: IMPOSTOR_DEFAULT_DISCUSSION_TIME,
  timeLeft: 0,
  selectedVote: null,
  winner: null,
  feedback: ''
}
