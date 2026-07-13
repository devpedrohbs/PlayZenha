import type {
  QuemSouEuAssignment,
  QuemSouEuPlayer,
  QuemSouEuRoundResult
} from './quemSouEu.types'
import { getFilledQuemSouEuPlayerNames } from './quemSouEu.rules'
import { QUEM_SOU_EU_MIN_PLAYERS } from './quemSouEu.constants'

export const selectCanStartWritingPhase = (playerNames: string[]) =>
  getFilledQuemSouEuPlayerNames(playerNames).length >= QUEM_SOU_EU_MIN_PLAYERS

export const selectCurrentWriter = (
  players: QuemSouEuPlayer[],
  writingOrder: string[],
  writingStep: number
) => {
  const writerId = writingOrder[writingStep]
  return players.find((player) => player.id === writerId) ?? null
}

export const selectCurrentGuesser = (
  players: QuemSouEuPlayer[],
  guessOrder: string[],
  guessStep: number
) => {
  const guesserId = guessOrder[guessStep]
  return players.find((player) => player.id === guesserId) ?? null
}

export const selectCurrentAssignment = (
  assignments: QuemSouEuAssignment[],
  currentGuesser: QuemSouEuPlayer | null
) => {
  if (!currentGuesser) return null
  return assignments.find((item) => item.targetId === currentGuesser.id) ?? null
}

export const selectCurrentTarget = (
  assignments: QuemSouEuAssignment[],
  currentWriter: QuemSouEuPlayer | null,
  players: QuemSouEuPlayer[]
) => {
  if (!currentWriter) return null
  const assignment = assignments.find((item) => item.writerId === currentWriter.id)
  if (!assignment) return null
  return players.find((player) => player.id === assignment.targetId) ?? null
}

export const selectBestTime = (results: QuemSouEuRoundResult[]) => {
  const winners = results.filter((result) => result.status === 'acertou')
  if (winners.length === 0) return null
  return Math.min(...winners.map((result) => result.timeUsed))
}

export const selectBestPlayers = (
  results: QuemSouEuRoundResult[],
  bestTime: number | null
) => {
  if (bestTime === null) return []
  return results.filter((result) => result.status === 'acertou' && result.timeUsed === bestTime)
}

export const selectOrderedResults = (results: QuemSouEuRoundResult[]) =>
  [...results].sort((left, right) => {
    if (left.status !== right.status) {
      return left.status === 'acertou' ? -1 : 1
    }

    if (left.status === 'acertou' && right.status === 'acertou') {
      return left.timeUsed - right.timeUsed
    }

    return right.timeUsed - left.timeUsed
  })
