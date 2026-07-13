import {
  IMPOSTOR_DEFAULT_PLAYER_NAMES,
  IMPOSTOR_DISCUSSION_STEP,
  IMPOSTOR_MAX_DISCUSSION_TIME,
  IMPOSTOR_MAX_PLAYERS,
  IMPOSTOR_MIN_DISCUSSION_TIME
} from './impostor.constants'
import type {
  CreateImpostorRoundResult,
  ImpostorGameState,
  ImpostorPhase,
  ImpostorWinner
} from './impostor.types'
import { resetImpostorPlayersVotes } from './impostor.rules'

type ImpostorAction =
  | { type: 'add-player-slot' }
  | { type: 'remove-player-slot'; index: number }
  | { type: 'update-player-name'; index: number; value: string }
  | { type: 'set-discussion-time'; value: number }
  | { type: 'change-discussion-time'; amount: number }
  | { type: 'start-round'; round: CreateImpostorRoundResult }
  | { type: 'set-phase'; phase: ImpostorPhase }
  | { type: 'next-reveal-step' }
  | { type: 'start-discussion' }
  | { type: 'add-discussion-minute' }
  | { type: 'tick-discussion' }
  | { type: 'start-voting' }
  | { type: 'select-vote'; playerId: number | null }
  | { type: 'finish-voting'; winner: ImpostorWinner }
  | { type: 'restart-game' }

export const impostorReducer = (
  state: ImpostorGameState,
  action: ImpostorAction
): ImpostorGameState => {
  switch (action.type) {
    case 'add-player-slot':
      if (state.playerNames.length >= IMPOSTOR_MAX_PLAYERS) return state
      return { ...state, playerNames: [...state.playerNames, ''] }

    case 'remove-player-slot': {
      if (state.playerNames.length > IMPOSTOR_DEFAULT_PLAYER_NAMES.length) {
        return {
          ...state,
          playerNames: state.playerNames.filter((_, index) => index !== action.index)
        }
      }

      return {
        ...state,
        playerNames: state.playerNames.map((name, index) => (index === action.index ? '' : name))
      }
    }

    case 'update-player-name':
      return {
        ...state,
        playerNames: state.playerNames.map((name, index) => (index === action.index ? action.value : name))
      }

    case 'set-discussion-time':
      return { ...state, discussionTime: action.value }

    case 'change-discussion-time':
      return {
        ...state,
        discussionTime: Math.min(
          IMPOSTOR_MAX_DISCUSSION_TIME,
          Math.max(IMPOSTOR_MIN_DISCUSSION_TIME, state.discussionTime + action.amount)
        )
      }

    case 'start-round':
      return {
        ...state,
        players: action.round.players,
        theme: action.round.theme,
        revealOrder: action.round.revealOrder,
        currentRevealStep: 0,
        selectedVote: null,
        winner: null,
        phase: 'role-distribution-start'
      }

    case 'set-phase':
      return { ...state, phase: action.phase }

    case 'next-reveal-step':
      return {
        ...state,
        currentRevealStep: state.currentRevealStep + 1,
        phase: 'role-distribution-start'
      }

    case 'start-discussion':
      return { ...state, timeLeft: state.discussionTime, phase: 'discussion' }

    case 'add-discussion-minute':
      return {
        ...state,
        discussionTime: state.discussionTime + IMPOSTOR_DISCUSSION_STEP,
        timeLeft: state.timeLeft + IMPOSTOR_DISCUSSION_STEP
      }

    case 'tick-discussion':
      return { ...state, timeLeft: Math.max(0, state.timeLeft - 1) }

    case 'start-voting':
      return {
        ...state,
        players: resetImpostorPlayersVotes(state.players),
        selectedVote: null,
        phase: 'voting'
      }

    case 'select-vote':
      return { ...state, selectedVote: action.playerId }

    case 'finish-voting':
      return { ...state, winner: action.winner, phase: 'voting-results' }

    case 'restart-game':
      return {
        ...state,
        phase: 'setup',
        players: [],
        revealOrder: [],
        currentRevealStep: 0,
        selectedVote: null,
        winner: null
      }

    default:
      return state
  }
}

export { IMPOSTOR_DISCUSSION_STEP }
