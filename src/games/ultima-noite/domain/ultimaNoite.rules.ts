import type {
  UltimaNoitePlayer,
  UltimaNoiteVotingResolution,
  UltimaNoiteWinner
} from './ultimaNoite.types'

export const normalizeUltimaNoitePlayerName = (name: string) => name.trim().toUpperCase()

export const resetUltimaNoiteVotes = <T extends UltimaNoitePlayer>(players: T[]): T[] =>
  players.map((player) => ({ ...player, votes: 0 }))

export const resolveUltimaNoiteWinner = (
  players: UltimaNoitePlayer[]
): UltimaNoiteWinner | null => {
  const liveWolves = players.filter((player) => player.isAlive && player.role === 'Lobo').length
  const liveGood = players.filter((player) => player.isAlive && player.role !== 'Lobo').length

  if (liveWolves === 0) return 'Cidadãos'
  if (liveWolves >= liveGood) return 'Lobos'
  return null
}

export const resolveUltimaNoiteNightVictim = (
  wolfKill: number | null,
  angelSave: number | null
) => {
  if (wolfKill === null) return null
  return angelSave === wolfKill ? null : wolfKill
}

export const applyUltimaNoiteDeath = <T extends UltimaNoitePlayer>(
  players: T[],
  victimId: number | null
): T[] => {
  if (victimId === null) return players
  return players.map((player) => player.id === victimId ? { ...player, isAlive: false } : player)
}

export const resolveUltimaNoiteVoting = (
  players: UltimaNoitePlayer[]
): UltimaNoiteVotingResolution => {
  const sorted = [...players]
    .filter((player) => player.isAlive)
    .sort((left, right) => right.votes - left.votes)

  const mostVoted = sorted[0] ?? null
  const isTie = sorted.length > 1 && sorted[0].votes === sorted[1].votes
  const eliminatedPlayerId = !isTie && mostVoted ? mostVoted.id : null
  const resolvedPlayers = applyUltimaNoiteDeath(players, eliminatedPlayerId)

  return {
    players: resolvedPlayers,
    eliminatedPlayerId,
    isTie,
    winner: resolveUltimaNoiteWinner(resolvedPlayers)
  }
}

export const findFirstLivingPlayerIndex = (players: UltimaNoitePlayer[]) =>
  players.findIndex((player) => player.isAlive)

export const findNextLivingPlayerIndex = (
  players: UltimaNoitePlayer[],
  currentIndex: number
) => {
  let nextIndex = currentIndex + 1

  while (nextIndex < players.length && !players[nextIndex].isAlive) {
    nextIndex++
  }

  return nextIndex < players.length ? nextIndex : -1
}
