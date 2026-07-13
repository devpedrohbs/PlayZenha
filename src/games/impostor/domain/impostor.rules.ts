import {
  IMPOSTOR_MAX_PLAYERS,
  IMPOSTOR_MIN_PLAYERS,
  IMPOSTOR_THEMES
} from './impostor.constants'
import { shuffle } from '../../../shared/utils/shuffle'
import { createId } from '../../../shared/utils/id'
import type {
  CreateImpostorRoundInput,
  CreateImpostorRoundResult,
  ImpostorPlayer,
  ImpostorWinner
} from './impostor.types'

export const normalizeImpostorPlayerName = (name: string) => name.trim().toUpperCase()

export const getFilledImpostorPlayerNames = (playerNames: string[]) =>
  playerNames.map((name) => name.trim()).filter(Boolean)

export const validateImpostorPlayerNames = (playerNames: string[]): string | null => {
  const activeNames = getFilledImpostorPlayerNames(playerNames)
  const usedNames = new Set<string>()

  for (const name of activeNames) {
    const comparableName = normalizeImpostorPlayerName(name)
    if (usedNames.has(comparableName)) {
      return `O nome "${name}" ja esta em uso!`
    }

    usedNames.add(comparableName)
  }

  if (activeNames.length < IMPOSTOR_MIN_PLAYERS) {
    return 'Minimo de 3 jogadores para o Impostor.'
  }

  if (activeNames.length > IMPOSTOR_MAX_PLAYERS) {
    return 'Maximo de 16 jogadores para o Impostor.'
  }

  return null
}

export const createImpostorPlayers = (names: string[], impostorIndex: number): ImpostorPlayer[] =>
  names.map((name, index) => ({
    id: createId(),
    name,
    role: index === impostorIndex ? 'Impostor' : 'Cidadao',
    isAlive: true,
    votes: 0
  }))

export const createRevealOrder = (players: ImpostorPlayer[], forcedOrder?: string[]) => {
  if (forcedOrder && forcedOrder.length > 0) return forcedOrder
  return shuffle(players.map((player) => player.id))
}

export const createImpostorRound = ({
  playerNames,
  themeIndex,
  impostorIndex,
  revealOrder
}: CreateImpostorRoundInput): CreateImpostorRoundResult => {
  const activeNames = getFilledImpostorPlayerNames(playerNames)
  const players = createImpostorPlayers(activeNames, impostorIndex)

  return {
    players,
    revealOrder: createRevealOrder(players, revealOrder),
    theme: IMPOSTOR_THEMES[themeIndex]
  }
}

export const resolveImpostorVoteWinner = (
  players: ImpostorPlayer[],
  selectedVote: string | null
): ImpostorWinner | null => {
  if (selectedVote === null) return null

  const votedPlayer = players.find((player) => player.id === selectedVote)
  if (!votedPlayer) return null

  return votedPlayer.role === 'Impostor' ? 'Cidadaos' : 'Impostor'
}

export const resetImpostorPlayersVotes = (players: ImpostorPlayer[]) =>
  players.map((player) => ({ ...player, votes: 0 }))
