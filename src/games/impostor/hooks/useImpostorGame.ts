import { useCallback, useMemo, useReducer } from 'react'
import {
  IMPOSTOR_DISCUSSION_STEP,
  IMPOSTOR_PHASE_LABEL,
  IMPOSTOR_THEMES,
  INITIAL_IMPOSTOR_STATE
} from '../domain/impostor.constants'
import { impostorReducer } from '../domain/impostor.reducer'
import {
  createImpostorRound,
  resolveImpostorVoteWinner,
  shuffleArray,
  validateImpostorPlayerNames
} from '../domain/impostor.rules'
import {
  selectCanStartImpostorGame,
  selectCurrentRevealPlayer,
  selectFilledPlayerCount
} from '../domain/impostor.selectors'
import { useGameTimer } from './useGameTimer'

const getRandomIndex = (length: number) => Math.floor(Math.random() * length)

export const useImpostorGame = () => {
  const [state, dispatch] = useReducer(impostorReducer, INITIAL_IMPOSTOR_STATE)

  const currentPlayerForReveal = useMemo(
    () => selectCurrentRevealPlayer(state),
    [state]
  )

  const filledPlayerCount = useMemo(
    () => selectFilledPlayerCount(state),
    [state]
  )

  const canStartGame = useMemo(
    () => selectCanStartImpostorGame(state),
    [state]
  )

  const completeDiscussion = useCallback(() => {
    dispatch({ type: 'set-phase', phase: 'voting-intro' })
  }, [])

  const tickDiscussion = useCallback(() => {
    dispatch({ type: 'tick-discussion' })
  }, [])

  useGameTimer({
    isRunning: state.phase === 'discussion',
    timeLeft: state.timeLeft,
    onTick: tickDiscussion,
    onComplete: completeDiscussion
  })

  const startGameSetup = () => {
    const validationError = validateImpostorPlayerNames(state.playerNames)
    if (validationError) {
      alert(validationError)
      return
    }

    const activeNames = state.playerNames.map((name) => name.trim()).filter(Boolean)
    const revealOrder = shuffleArray(activeNames.map((_, index) => index))

    const round = createImpostorRound({
      playerNames: state.playerNames,
      impostorIndex: getRandomIndex(activeNames.length),
      themeIndex: getRandomIndex(IMPOSTOR_THEMES.length),
      revealOrder
    })

    dispatch({ type: 'start-round', round })
  }

  const handleNextRoleReveal = () => {
    if (state.currentRevealStep < state.revealOrder.length - 1) {
      dispatch({ type: 'next-reveal-step' })
      return
    }

    dispatch({ type: 'set-phase', phase: 'game-start' })
  }

  const submitVote = () => {
    const winner = resolveImpostorVoteWinner(state.players, state.selectedVote)
    if (!winner) return

    dispatch({ type: 'finish-voting', winner })
  }

  return {
    ...state,
    canStartGame,
    currentPlayerForReveal,
    filledPlayerCount,
    phaseLabel: IMPOSTOR_PHASE_LABEL[state.phase],
    addDiscussionMinute: () => dispatch({ type: 'add-discussion-minute' }),
    addPlayerSlot: () => dispatch({ type: 'add-player-slot' }),
    decreaseDiscussionTime: () => dispatch({ type: 'change-discussion-time', amount: -IMPOSTOR_DISCUSSION_STEP }),
    increaseDiscussionTime: () => dispatch({ type: 'change-discussion-time', amount: IMPOSTOR_DISCUSSION_STEP }),
    removePlayerSlot: (index: number) => dispatch({ type: 'remove-player-slot', index }),
    restartGame: () => dispatch({ type: 'restart-game' }),
    selectVote: (playerId: number | null) => dispatch({ type: 'select-vote', playerId }),
    setPhase: (phase: typeof state.phase) => dispatch({ type: 'set-phase', phase }),
    startDiscussion: () => dispatch({ type: 'start-discussion' }),
    startGameSetup,
    startVoting: () => dispatch({ type: 'start-voting' }),
    submitVote,
    handleNextRoleReveal,
    updatePlayerName: (index: number, value: string) => dispatch({ type: 'update-player-name', index, value })
  }
}
