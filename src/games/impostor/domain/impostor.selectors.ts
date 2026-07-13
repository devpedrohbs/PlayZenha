import type { ImpostorGameState } from './impostor.types'
import { getFilledImpostorPlayerNames } from './impostor.rules'
import { IMPOSTOR_MIN_PLAYERS } from './impostor.constants'

export const selectCurrentRevealPlayer = (state: ImpostorGameState) =>
  state.players.find((player) => player.id === state.revealOrder[state.currentRevealStep]) ?? null

export const selectFilledPlayerCount = (state: ImpostorGameState) =>
  getFilledImpostorPlayerNames(state.playerNames).length

export const selectCanStartImpostorGame = (state: ImpostorGameState) =>
  selectFilledPlayerCount(state) >= IMPOSTOR_MIN_PLAYERS
