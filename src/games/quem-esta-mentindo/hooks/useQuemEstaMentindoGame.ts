import { useCallback, useMemo, useReducer } from 'react'
import {
  QUEM_MENTE_CATEGORIES,
  QUEM_MENTE_DISCUSSION_STEP,
  createInitialQuemEstaMentindoState,
  QUEM_MENTE_RESPONSE_STEP
} from '../domain/quemEstaMentindo.constants'
import { quemEstaMentindoReducer } from '../domain/quemEstaMentindo.reducer'
import {
  assignQuemEstaMentindoRoles,
  chooseQuemEstaMentindoQuestion,
  createQuemEstaMentindoOrder,
  createQuemEstaMentindoRound,
  resolveQuemEstaMentindoResult,
  validateQuemEstaMentindoNames
} from '../domain/quemEstaMentindo.rules'
import {
  selectCanStartQuemEstaMentindo,
  selectCurrentRevealPlayer,
  selectCurrentVoter,
  selectLiars,
  selectQuemEstaMentindoFilledPlayerCount
} from '../domain/quemEstaMentindo.selectors'
import type { QuemEstaMentindoCategory, QuemEstaMentindoQuestion } from '../domain/quemEstaMentindo.types'
import { useGameTimer } from './useGameTimer'

const randomIndex = (length: number) => Math.floor(Math.random() * length)

export const useQuemEstaMentindoGame = (questions: QuemEstaMentindoQuestion[]) => {
  const [state, dispatch] = useReducer(quemEstaMentindoReducer, undefined, createInitialQuemEstaMentindoState)
  const currentRevealPlayer = useMemo(() => selectCurrentRevealPlayer(state), [state])
  const currentVoter = useMemo(() => selectCurrentVoter(state), [state])
  const liars = useMemo(() => selectLiars(state), [state])
  const canStartGame = useMemo(() => selectCanStartQuemEstaMentindo(state), [state])
  const filledPlayerCount = useMemo(() => selectQuemEstaMentindoFilledPlayerCount(state), [state])

  const getAvailableQuestions = useCallback(() => {
    const isUnfiltered = state.settings.difficulty === 'Sem filtro'
    const categories = isUnfiltered ? QUEM_MENTE_CATEGORIES : (state.settings.categories.length ? state.settings.categories : QUEM_MENTE_CATEGORIES)
    const matches = questions.filter((question) =>
      categories.includes(question.category) &&
      (isUnfiltered || question.difficulty === state.settings.difficulty) &&
      (isUnfiltered || state.settings.allowPersonalQuestions || !question.personal)
    )
    return matches.length > 0 ? matches : questions.filter((question) => !question.personal)
  }, [questions, state.settings])

  const startGame = () => {
    const validationError = validateQuemEstaMentindoNames(state.playerNames)
    if (validationError) return dispatch({ type: 'set-feedback', message: validationError })

    const activeNames = state.playerNames.map((name) => name.trim()).filter(Boolean)
    const questionPool = getAvailableQuestions()
    const question = chooseQuemEstaMentindoQuestion(questionPool, randomIndex(questionPool.length))
    if (!question) return dispatch({ type: 'set-feedback', message: 'Não há perguntas disponíveis para esta configuração.' })

    const liarCount = state.settings.doubleLie && activeNames.length >= 4 ? 2 : 1
    const liarIndexes = createQuemEstaMentindoOrder(activeNames.map((name, index) => ({ id: String(index), name, role: 'Verdadeiro' as const, score: 0 }))).slice(0, liarCount).map(Number)
    const round = createQuemEstaMentindoRound({ playerNames: state.playerNames, liarIndexes, question })
    dispatch({ type: 'start-round', round, roundNumber: 1 })
  }

  const startNextRound = () => {
    const questionPool = getAvailableQuestions()
    const question = chooseQuemEstaMentindoQuestion(questionPool, randomIndex(questionPool.length))
    if (!question) return dispatch({ type: 'set-feedback', message: 'Não há perguntas disponíveis para esta configuração.' })

    const liarCount = state.settings.doubleLie && state.players.length >= 4 ? 2 : 1
    const liarIds = createQuemEstaMentindoOrder(state.players).slice(0, liarCount)
    const players = assignQuemEstaMentindoRoles(state.players, liarIds)
    dispatch({ type: 'start-next-round', players, revealOrder: createQuemEstaMentindoOrder(players), question, roundNumber: state.round + 1 })
  }

  const submitVote = () => {
    if (!currentVoter || !state.selectedVote) return
    const votes = { ...state.votes, [currentVoter.id]: state.selectedVote }
    const lastVoter = state.currentVotingStep === state.votingOrder.length - 1
    dispatch({ type: 'submit-vote', voterId: currentVoter.id, result: lastVoter ? resolveQuemEstaMentindoResult(state.players, votes) : undefined })
  }

  const completeDiscussion = useCallback(() => dispatch({ type: 'set-phase', phase: 'voting-intro' }), [])
  const tickDiscussion = useCallback(() => dispatch({ type: 'tick-discussion' }), [])

  useGameTimer({
    isRunning: state.phase === 'discussion',
    timeLeft: state.timeLeft,
    onTick: tickDiscussion,
    onComplete: completeDiscussion
  })

  return {
    ...state,
    canStartGame,
    currentRevealPlayer,
    currentVoter,
    filledPlayerCount,
    liars,
    addDiscussionTime: () => dispatch({ type: 'add-discussion-time', amount: QUEM_MENTE_DISCUSSION_STEP }),
    addPlayerSlot: () => dispatch({ type: 'add-player-slot' }),
    changeDiscussionTime: (amount: number) => dispatch({ type: 'change-discussion-time', amount }),
    changeResponseTime: (amount: number) => dispatch({ type: 'change-response-time', amount: amount * QUEM_MENTE_RESPONSE_STEP }),
    changeRounds: (amount: number) => dispatch({ type: 'change-rounds', amount }),
    nextReveal: () => dispatch({ type: 'next-reveal' }),
    removePlayerSlot: (index: number) => dispatch({ type: 'remove-player-slot', index }),
    restartGame: () => dispatch({ type: 'restart-game' }),
    selectVote: (playerId: string | null) => dispatch({ type: 'select-vote', playerId }),
    setPhase: (phase: typeof state.phase) => dispatch({ type: 'set-phase', phase }),
    startDiscussion: () => dispatch({ type: 'start-discussion' }),
    startGame,
    startNextRound,
    startVoting: () => dispatch({ type: 'start-voting', votingOrder: createQuemEstaMentindoOrder(state.players) }),
    submitVote,
    toggleCategory: (category: QuemEstaMentindoCategory) => dispatch({
      type: 'update-settings',
      settings: { categories: state.settings.categories.includes(category) ? state.settings.categories.filter((item) => item !== category) : [...state.settings.categories, category] }
    }),
    updatePlayerName: (index: number, value: string) => dispatch({ type: 'update-player-name', index, value }),
    updateSettings: (settings: Partial<typeof state.settings>) => dispatch({ type: 'update-settings', settings })
  }
}
