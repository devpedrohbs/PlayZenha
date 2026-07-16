import { getFilledQuemEstaMentindoNames } from './quemEstaMentindo.rules'
import { QUEM_MENTE_MIN_PLAYERS } from './quemEstaMentindo.constants'
import type { QuemEstaMentindoGameState } from './quemEstaMentindo.types'

export const selectQuemEstaMentindoFilledPlayerCount = (state: QuemEstaMentindoGameState) =>
  getFilledQuemEstaMentindoNames(state.playerNames).length

export const selectCanStartQuemEstaMentindo = (state: QuemEstaMentindoGameState) =>
  selectQuemEstaMentindoFilledPlayerCount(state) >= QUEM_MENTE_MIN_PLAYERS

export const selectCurrentRevealPlayer = (state: QuemEstaMentindoGameState) =>
  state.players.find((player) => player.id === state.revealOrder[state.currentRevealStep]) ?? null

export const selectCurrentVoter = (state: QuemEstaMentindoGameState) =>
  state.players.find((player) => player.id === state.votingOrder[state.currentVotingStep]) ?? null

export const selectLiars = (state: QuemEstaMentindoGameState) =>
  state.players.filter((player) => player.role === 'Mentiroso')
