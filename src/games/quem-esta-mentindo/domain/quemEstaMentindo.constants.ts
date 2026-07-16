import type {
  QuemEstaMentindoCategory,
  QuemEstaMentindoGameState,
  QuemEstaMentindoPhase,
  QuemEstaMentindoSettings
} from './quemEstaMentindo.types'

export const QUEM_MENTE_MIN_PLAYERS = 3
export const QUEM_MENTE_MAX_PLAYERS = 12
export const QUEM_MENTE_DEFAULT_PLAYER_NAMES = ['', '', '']
export const QUEM_MENTE_NAME_MAX_LENGTH = 18
export const QUEM_MENTE_DISCUSSION_MIN = 60
export const QUEM_MENTE_DISCUSSION_MAX = 180
export const QUEM_MENTE_DISCUSSION_STEP = 30
export const QUEM_MENTE_RESPONSE_MIN = 15
export const QUEM_MENTE_RESPONSE_MAX = 90
export const QUEM_MENTE_RESPONSE_STEP = 15
export const QUEM_MENTE_MIN_ROUNDS = 1
export const QUEM_MENTE_MAX_ROUNDS = 10

export const QUEM_MENTE_CATEGORIES: QuemEstaMentindoCategory[] = [
  'Cotidiano',
  'Preferências',
  'Situações absurdas',
  'Relacionamentos',
  'Trabalho e estudos',
  'Constrangedoras'
]

export const QUEM_MENTE_DEFAULT_SETTINGS: QuemEstaMentindoSettings = {
  rounds: 3,
  responseTime: 30,
  discussionTime: 90,
  difficulty: 'Médio',
  categories: ['Cotidiano', 'Preferências', 'Situações absurdas'],
  scoringEnabled: true,
  allowPersonalQuestions: false,
  doubleLie: false
}

export const QUEM_MENTE_PHASE_LABEL: Record<QuemEstaMentindoPhase, string> = {
  setup: 'Jogadores',
  settings: 'Configuração',
  'role-distribution-start': 'Passe o celular',
  'role-reveal': 'Papel secreto',
  question: 'Pergunta',
  discussion: 'Discussão',
  'voting-intro': 'Votação',
  'voting-distribution-start': 'Voto secreto',
  voting: 'Voto',
  results: 'Resultado'
}

export const createInitialQuemEstaMentindoState = (): QuemEstaMentindoGameState => ({
  phase: 'setup',
  playerNames: [...QUEM_MENTE_DEFAULT_PLAYER_NAMES],
  players: [],
  settings: { ...QUEM_MENTE_DEFAULT_SETTINGS, categories: [...QUEM_MENTE_DEFAULT_SETTINGS.categories] },
  round: 1,
  revealOrder: [],
  currentRevealStep: 0,
  votingOrder: [],
  currentVotingStep: 0,
  selectedVote: null,
  votes: {},
  question: null,
  timeLeft: 0,
  result: null,
  feedback: ''
})
