import type { UltimaNoitePlayer } from './ultimaNoite.types'

export const selectLivingUltimaNoitePlayers = (players: UltimaNoitePlayer[]) =>
  players.filter((player) => player.isAlive)

export const selectUltimaNoiteRole = (
  players: UltimaNoitePlayer[],
  playerId: number
) => players.find((player) => player.id === playerId)?.role ?? 'Cidadão'
