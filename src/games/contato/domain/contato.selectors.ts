import type { ContatoGameState } from './contato.types'
import { CONTATO_PLAYER_COUNT } from './contato.constants'
import { maskContatoWord } from './contato.rules'

export const selectContatoJudge = (state: ContatoGameState) =>
  state.players.find((player) => player.id === state.judgeId) ?? null

export const selectContatoGuessers = (state: ContatoGameState) =>
  state.players.filter((player) => player.id !== state.judgeId)

export const selectContatoFilledPlayerCount = (state: ContatoGameState) =>
  state.playerNames.filter((name) => name.trim()).length

export const selectCanStartContatoGame = (state: ContatoGameState) =>
  selectContatoFilledPlayerCount(state) === CONTATO_PLAYER_COUNT

export const selectMaskedContatoWord = (state: ContatoGameState) =>
  state.currentWord ? maskContatoWord(state.currentWord, state.revealedLetters) : ''

export const selectContatoRevealElapsedSeconds = (state: ContatoGameState) => {
  if (state.roundStartedAtMs === null || state.wordRevealedAtMs === null) {
    return null
  }

  return Math.max(0, Math.ceil((state.wordRevealedAtMs - state.roundStartedAtMs) / 1000))
}
