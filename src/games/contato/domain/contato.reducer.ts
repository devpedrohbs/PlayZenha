import { INITIAL_CONTATO_STATE } from './contato.constants'
import type {
  ContatoGameState,
  ContatoPhase,
  ContatoPlayer,
  ContatoRoundSetup
} from './contato.types'

type ContatoAction =
  | { type: 'update-player-name'; index: number; value: string }
  | { type: 'toggle-rotate-judge' }
  | { type: 'start-game'; players: ContatoPlayer[]; round: ContatoRoundSetup }
  | { type: 'start-round'; round: ContatoRoundSetup }
  | { type: 'set-phase'; phase: ContatoPhase }
  | { type: 'start-round-play'; startedAtMs: number }
  | { type: 'reveal-next-letter'; revealedAtMs: number }
  | { type: 'reveal-whole-word'; revealedAtMs: number }
  | { type: 'finish-round' }
  | { type: 'set-feedback'; message: string }
  | { type: 'reset-match' }

export const contatoReducer = (
  state: ContatoGameState,
  action: ContatoAction
): ContatoGameState => {
  switch (action.type) {
    case 'update-player-name':
      return {
        ...state,
        playerNames: state.playerNames.map((name, index) => (index === action.index ? action.value : name)),
        feedback: ''
      }

    case 'toggle-rotate-judge':
      return { ...state, rotateJudge: !state.rotateJudge }

    case 'start-game':
      return {
        ...state,
        players: action.players,
        judgeId: action.round.judgeId,
        currentWord: action.round.word,
        lastWord: action.round.word,
        revealedLetters: 1,
        roundStartedAtMs: null,
        wordRevealedAtMs: null,
        feedback: '',
        round: action.round.round,
        phase: 'judge-draw'
      }

    case 'start-round':
      return {
        ...state,
        judgeId: action.round.judgeId,
        currentWord: action.round.word,
        lastWord: action.round.word,
        revealedLetters: 1,
        roundStartedAtMs: null,
        wordRevealedAtMs: null,
        feedback: '',
        round: action.round.round,
        phase: 'judge-draw'
      }

    case 'set-phase':
      return { ...state, phase: action.phase }

    case 'start-round-play':
      return {
        ...state,
        phase: 'round-play',
        roundStartedAtMs: action.startedAtMs,
        wordRevealedAtMs: null,
        feedback: ''
      }

    case 'reveal-next-letter': {
      if (state.revealedLetters >= state.currentWord.length) {
        return { ...state, feedback: 'A palavra inteira já foi revelada.' }
      }

      const revealedLetters = Math.min(state.revealedLetters + 1, state.currentWord.length)
      const wordRevealedAtMs = revealedLetters === state.currentWord.length
        ? state.wordRevealedAtMs ?? action.revealedAtMs
        : state.wordRevealedAtMs

      return {
        ...state,
        revealedLetters,
        wordRevealedAtMs,
        feedback: revealedLetters === state.currentWord.length
          ? 'Todas as letras foram liberadas!'
          : 'Próxima letra liberada!'
      }
    }

    case 'reveal-whole-word':
      return {
        ...state,
        revealedLetters: state.currentWord.length,
        wordRevealedAtMs: state.wordRevealedAtMs ?? action.revealedAtMs,
        feedback: 'Palavra inteira revelada!'
      }

    case 'finish-round':
      if (state.revealedLetters < state.currentWord.length) {
        return { ...state, feedback: 'Revele a palavra inteira para ver o resultado.' }
      }

      return {
        ...state,
        phase: 'round-result'
      }

    case 'set-feedback':
      return { ...state, feedback: action.message }

    case 'reset-match':
      return {
        ...INITIAL_CONTATO_STATE,
        playerNames: state.playerNames
      }

    default:
      return state
  }
}
