import { createId } from '../../../shared/utils/id'
import { shuffle } from '../../../shared/utils/shuffle'
import {
  QUEM_MENTE_MAX_PLAYERS,
  QUEM_MENTE_MIN_PLAYERS
} from './quemEstaMentindo.constants'
import type {
  CreateQuemEstaMentindoRoundInput,
  CreateQuemEstaMentindoRoundResult,
  QuemEstaMentindoPlayer,
  QuemEstaMentindoQuestion,
  QuemEstaMentindoResult
} from './quemEstaMentindo.types'

export const normalizeQuemEstaMentindoName = (name: string) => name.trim().toLocaleUpperCase()

export const getFilledQuemEstaMentindoNames = (names: string[]) =>
  names.map((name) => name.trim()).filter(Boolean)

export const validateQuemEstaMentindoNames = (names: string[]): string | null => {
  const activeNames = getFilledQuemEstaMentindoNames(names)
  const usedNames = new Set<string>()

  for (const name of activeNames) {
    const normalized = normalizeQuemEstaMentindoName(name)
    if (usedNames.has(normalized)) return `O nome "${name}" já está em uso.`
    usedNames.add(normalized)
  }

  if (activeNames.length < QUEM_MENTE_MIN_PLAYERS) return 'Mínimo de 3 jogadores para começar.'
  if (activeNames.length > QUEM_MENTE_MAX_PLAYERS) return 'Máximo de 12 jogadores para esta partida.'
  return null
}

export const createQuemEstaMentindoPlayers = (names: string[], liarIndexes: number[]): QuemEstaMentindoPlayer[] => {
  const liarIndexSet = new Set(liarIndexes)
  return names.map((name, index) => ({
    id: createId(),
    name,
    role: liarIndexSet.has(index) ? 'Mentiroso' : 'Verdadeiro',
    score: 0
  }))
}

export const assignQuemEstaMentindoRoles = (players: QuemEstaMentindoPlayer[], liarIds: string[]) => {
  const liarIdSet = new Set(liarIds)
  return players.map((player): QuemEstaMentindoPlayer => ({
    ...player,
    role: liarIdSet.has(player.id) ? 'Mentiroso' : 'Verdadeiro'
  }))
}

export const createQuemEstaMentindoOrder = (players: QuemEstaMentindoPlayer[], forcedOrder?: string[]) =>
  forcedOrder && forcedOrder.length > 0 ? forcedOrder : shuffle(players.map((player) => player.id))

export const createQuemEstaMentindoRound = ({
  playerNames,
  liarIndexes,
  revealOrder,
  question
}: CreateQuemEstaMentindoRoundInput): CreateQuemEstaMentindoRoundResult => {
  const players = createQuemEstaMentindoPlayers(getFilledQuemEstaMentindoNames(playerNames), liarIndexes)
  return { players, revealOrder: createQuemEstaMentindoOrder(players, revealOrder), question }
}

export const chooseQuemEstaMentindoQuestion = (
  questions: QuemEstaMentindoQuestion[],
  questionIndex: number
) => questions[questionIndex] ?? null

export const resolveQuemEstaMentindoResult = (
  players: QuemEstaMentindoPlayer[],
  votes: Record<string, string>
): QuemEstaMentindoResult => {
  const voteCounts = Object.values(votes).reduce<Record<string, number>>(
    (counts, targetId) => ({ ...counts, [targetId]: (counts[targetId] ?? 0) + 1 }),
    {}
  )
  const maxVotes = Math.max(0, ...Object.values(voteCounts))
  const topVotedIds = maxVotes === 0
    ? []
    : Object.entries(voteCounts).filter(([, votesReceived]) => votesReceived === maxVotes).map(([playerId]) => playerId)
  const liarIds = players.filter((player) => player.role === 'Mentiroso').map((player) => player.id)
  const liarIdSet = new Set(liarIds)
  const winner = topVotedIds.length > 0 && topVotedIds.every((playerId) => liarIdSet.has(playerId)) ? 'Grupo' : 'Mentirosos'
  const correctVoterIds = Object.entries(votes)
    .filter(([, targetId]) => liarIdSet.has(targetId))
    .map(([voterId]) => voterId)

  return { winner, liarIds, voteCounts, correctVoterIds, topVotedIds }
}

export const scoreQuemEstaMentindoRound = (
  players: QuemEstaMentindoPlayer[],
  result: QuemEstaMentindoResult,
  enabled: boolean
) => {
  if (!enabled) return players
  const liarIdSet = new Set(result.liarIds)
  const correctVoterIdSet = new Set(result.correctVoterIds)
  const liarVotes = result.liarIds.reduce((total, liarId) => total + (result.voteCounts[liarId] ?? 0), 0)
  const fooledAtLeastHalf = liarVotes <= Math.floor(players.length / 2)

  return players.map((player) => {
    let earned = correctVoterIdSet.has(player.id) ? 1 : 0
    if (liarIdSet.has(player.id) && result.winner === 'Mentirosos') earned += 2
    if (liarIdSet.has(player.id) && fooledAtLeastHalf) earned += 1
    return { ...player, score: player.score + earned }
  })
}
