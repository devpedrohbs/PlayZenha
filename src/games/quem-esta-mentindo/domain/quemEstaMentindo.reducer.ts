import {
  createInitialQuemEstaMentindoState,
  QUEM_MENTE_DEFAULT_PLAYER_NAMES,
  QUEM_MENTE_DISCUSSION_MAX,
  QUEM_MENTE_DISCUSSION_MIN,
  QUEM_MENTE_MAX_PLAYERS,
  QUEM_MENTE_RESPONSE_MAX,
  QUEM_MENTE_RESPONSE_MIN,
  QUEM_MENTE_MAX_ROUNDS,
  QUEM_MENTE_MIN_ROUNDS
} from './quemEstaMentindo.constants'
import { scoreQuemEstaMentindoRound } from './quemEstaMentindo.rules'
import type {
  CreateQuemEstaMentindoRoundResult,
  QuemEstaMentindoGameState,
  QuemEstaMentindoPhase,
  QuemEstaMentindoResult,
  QuemEstaMentindoSettings
} from './quemEstaMentindo.types'

type Action =
  | { type: 'add-player-slot' }
  | { type: 'remove-player-slot'; index: number }
  | { type: 'update-player-name'; index: number; value: string }
  | { type: 'update-settings'; settings: Partial<QuemEstaMentindoSettings> }
  | { type: 'change-rounds'; amount: number }
  | { type: 'change-response-time'; amount: number }
  | { type: 'change-discussion-time'; amount: number }
  | { type: 'set-phase'; phase: QuemEstaMentindoPhase }
  | { type: 'start-round'; round: CreateQuemEstaMentindoRoundResult; roundNumber: number }
  | { type: 'start-next-round'; players: QuemEstaMentindoGameState['players']; revealOrder: string[]; question: CreateQuemEstaMentindoRoundResult['question']; roundNumber: number }
  | { type: 'next-reveal' }
  | { type: 'start-discussion' }
  | { type: 'tick-discussion' }
  | { type: 'add-discussion-time'; amount: number }
  | { type: 'start-voting'; votingOrder: string[] }
  | { type: 'select-vote'; playerId: string | null }
  | { type: 'submit-vote'; voterId: string; result?: QuemEstaMentindoResult }
  | { type: 'set-feedback'; message: string }
  | { type: 'restart-game' }

export const quemEstaMentindoReducer = (state: QuemEstaMentindoGameState, action: Action): QuemEstaMentindoGameState => {
  switch (action.type) {
    case 'add-player-slot':
      return state.playerNames.length >= QUEM_MENTE_MAX_PLAYERS ? state : { ...state, playerNames: [...state.playerNames, ''], feedback: '' }
    case 'remove-player-slot':
      return state.playerNames.length > QUEM_MENTE_DEFAULT_PLAYER_NAMES.length
        ? { ...state, playerNames: state.playerNames.filter((_, index) => index !== action.index), feedback: '' }
        : { ...state, playerNames: state.playerNames.map((name, index) => index === action.index ? '' : name), feedback: '' }
    case 'update-player-name':
      return { ...state, playerNames: state.playerNames.map((name, index) => index === action.index ? action.value : name), feedback: '' }
    case 'update-settings':
      return { ...state, settings: { ...state.settings, ...action.settings }, feedback: '' }
    case 'change-rounds':
      return { ...state, settings: { ...state.settings, rounds: Math.min(QUEM_MENTE_MAX_ROUNDS, Math.max(QUEM_MENTE_MIN_ROUNDS, state.settings.rounds + action.amount)) } }
    case 'change-response-time':
      return { ...state, settings: { ...state.settings, responseTime: Math.min(QUEM_MENTE_RESPONSE_MAX, Math.max(QUEM_MENTE_RESPONSE_MIN, state.settings.responseTime + action.amount)) } }
    case 'change-discussion-time':
      return { ...state, settings: { ...state.settings, discussionTime: Math.min(QUEM_MENTE_DISCUSSION_MAX, Math.max(QUEM_MENTE_DISCUSSION_MIN, state.settings.discussionTime + action.amount)) } }
    case 'set-phase': return { ...state, phase: action.phase }
    case 'start-round':
      return { ...state, players: action.round.players, question: action.round.question, revealOrder: action.round.revealOrder, currentRevealStep: 0, votingOrder: [], currentVotingStep: 0, selectedVote: null, votes: {}, result: null, round: action.roundNumber, feedback: '', phase: 'role-distribution-start' }
    case 'start-next-round':
      return { ...state, players: action.players, question: action.question, revealOrder: action.revealOrder, currentRevealStep: 0, votingOrder: [], currentVotingStep: 0, selectedVote: null, votes: {}, result: null, round: action.roundNumber, phase: 'role-distribution-start' }
    case 'next-reveal':
      return { ...state, currentRevealStep: state.currentRevealStep + 1, phase: 'role-distribution-start' }
    case 'start-discussion': return { ...state, timeLeft: state.settings.discussionTime, phase: 'discussion' }
    case 'tick-discussion': return { ...state, timeLeft: Math.max(0, state.timeLeft - 1) }
    case 'add-discussion-time': return { ...state, timeLeft: Math.min(QUEM_MENTE_DISCUSSION_MAX, state.timeLeft + action.amount) }
    case 'start-voting': return { ...state, votingOrder: action.votingOrder, currentVotingStep: 0, selectedVote: null, votes: {}, phase: 'voting-distribution-start' }
    case 'select-vote': return { ...state, selectedVote: action.playerId }
    case 'submit-vote': {
      const votes = { ...state.votes, [action.voterId]: state.selectedVote ?? '' }
      if (!action.result) return { ...state, votes, selectedVote: null, currentVotingStep: state.currentVotingStep + 1, phase: 'voting-distribution-start' }
      return { ...state, votes, result: action.result, players: scoreQuemEstaMentindoRound(state.players, action.result, state.settings.scoringEnabled), selectedVote: null, phase: 'results' }
    }
    case 'set-feedback': return { ...state, feedback: action.message }
    case 'restart-game': {
      const initial = createInitialQuemEstaMentindoState()
      return { ...initial, playerNames: state.playerNames.map((name) => name.trim()), settings: { ...state.settings, categories: [...state.settings.categories] } }
    }
    default: return state
  }
}
