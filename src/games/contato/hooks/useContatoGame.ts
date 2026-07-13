import { useMemo, useReducer } from 'react'
import { INITIAL_CONTATO_STATE } from '../domain/contato.constants'
import { contatoReducer } from '../domain/contato.reducer'
import {
  createContatoPlayers,
  createContatoRound,
  getNextContatoJudgeId,
  validateContatoPlayerNames
} from '../domain/contato.rules'
import {
  selectCanStartContatoGame,
  selectContatoFilledPlayerCount,
  selectContatoGuessers,
  selectContatoJudge,
  selectMaskedContatoWord
} from '../domain/contato.selectors'
import type { ContatoRoundWinner } from '../domain/contato.types'

export const useContatoGame = () => {
  const [state, dispatch] = useReducer(contatoReducer, INITIAL_CONTATO_STATE)

  const judge = useMemo(() => selectContatoJudge(state), [state])
  const guessers = useMemo(() => selectContatoGuessers(state), [state])
  const maskedWord = useMemo(() => selectMaskedContatoWord(state), [state])
  const filledPlayerCount = useMemo(() => selectContatoFilledPlayerCount(state), [state])
  const canStartGame = useMemo(() => selectCanStartContatoGame(state), [state])

  const startGame = () => {
    const validationError = validateContatoPlayerNames(state.playerNames)
    if (validationError) {
      alert(validationError)
      return
    }

    const players = createContatoPlayers(state.playerNames)
    const round = createContatoRound(players, 1, state.lastWord)
    dispatch({ type: 'start-game', players, round })
  }

  const goToNextRound = () => {
    if (!judge) return

    const forcedJudgeId = state.rotateJudge
      ? getNextContatoJudgeId(state.players, judge.id) ?? undefined
      : undefined

    const round = createContatoRound(
      state.players,
      state.round + 1,
      state.lastWord,
      forcedJudgeId
    )

    dispatch({ type: 'start-round', round })
  }

  return {
    ...state,
    canStartGame,
    filledPlayerCount,
    guessers,
    judge,
    maskedWord,
    finishRound: (winner: ContatoRoundWinner) => dispatch({ type: 'finish-round', winner }),
    goToNextRound,
    resetMatch: () => dispatch({ type: 'reset-match' }),
    revealNextLetter: () => dispatch({ type: 'reveal-next-letter' }),
    revealWholeWord: () => dispatch({ type: 'reveal-whole-word' }),
    setPhase: (phase: typeof state.phase) => dispatch({ type: 'set-phase', phase }),
    startGame,
    toggleRotateJudge: () => dispatch({ type: 'toggle-rotate-judge' }),
    updatePlayerName: (index: number, value: string) => dispatch({ type: 'update-player-name', index, value })
  }
}
