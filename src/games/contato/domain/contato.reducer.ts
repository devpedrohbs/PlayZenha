import { INITIAL_CONTATO_STATE } from './contato.constants'
import type {
  ContatoGameState,
  ContatoPhase,
  ContatoPlayer,
  ContatoRoundSetup,
  ContatoRoundWinner
} from './contato.types'

type ContatoAction =
  | { type: 'update-player-name'; index: number; value: string }
  | { type: 'toggle-rotate-judge' }
  | { type: 'start-game'; players: ContatoPlayer[]; round: ContatoRoundSetup }
  | { type: 'start-round'; round: ContatoRoundSetup }
  | { type: 'set-phase'; phase: ContatoPhase }
  | { type: 'reveal-next-letter' }
  | { type: 'reveal-whole-word' }
  | { type: 'finish-round'; winner: ContatoRoundWinner }
  | { type: 'reset-match' }

export const contatoReducer = (
  state: ContatoGameState,
  action: ContatoAction
): ContatoGameState => {
  switch (action.type) {
    case 'update-player-name':
      return {
        ...state,
        playerNames: state.playerNames.map((name, index) => (index === action.index ? action.value : name))
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
        roundWinner: null,
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
        roundWinner: null,
        feedback: '',
        round: action.round.round,
        phase: 'judge-draw'
      }

    case 'set-phase':
      return { ...state, phase: action.phase }

    case 'reveal-next-letter': {
      if (state.revealedLetters >= state.currentWord.length) {
        return { ...state, feedback: 'A palavra inteira ja foi revelada.' }
      }

      const revealedLetters = Math.min(state.revealedLetters + 1, state.currentWord.length)
      return {
        ...state,
        revealedLetters,
        feedback: revealedLetters === state.currentWord.length
          ? 'Todas as letras foram liberadas!'
          : 'Proxima letra liberada!'
      }
    }

    case 'reveal-whole-word':
      return {
        ...state,
        revealedLetters: state.currentWord.length,
        feedback: 'Palavra inteira revelada!'
      }

    case 'finish-round':
      return {
        ...state,
        roundWinner: action.winner,
        phase: 'round-result'
      }

    case 'reset-match':
      return {
        ...INITIAL_CONTATO_STATE,
        playerNames: state.playerNames
      }

    default:
      return state
  }
}
