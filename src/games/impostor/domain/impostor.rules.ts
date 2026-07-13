import {
  IMPOSTOR_MAX_PLAYERS,
  IMPOSTOR_MIN_PLAYERS,
  IMPOSTOR_THEMES
} from './impostor.constants'
import type {
  CreateImpostorRoundInput,
  CreateImpostorRoundResult,
  ImpostorPlayer,
  ImpostorWinner
} from './impostor.types'

export const normalizeImpostorPlayerName = (name: string) => name.trim().toUpperCase()

export const getFilledImpostorPlayerNames = (playerNames: string[]) =>
  playerNames.map(normalizeImpostorPlayerName).filter(Boolean)

export const validateImpostorPlayerNames = (playerNames: string[]): string | null => {
  const usedNames = new Set<string>()
  const activeNames = getFilledImpostorPlayerNames(playerNames)

  for (const name of activeNames) {
    if (usedNames.has(name)) {
      return `O nome "${name}" ja esta em uso!`
    }

    usedNames.add(name)
  }

  if (activeNames.length < IMPOSTOR_MIN_PLAYERS) {
    return 'Minimo de 3 jogadores para o Impostor.'
  }

  if (activeNames.length > IMPOSTOR_MAX_PLAYERS) {
    return 'Maximo de 16 jogadores para o Impostor.'
  }

  return null
}

export const shuffleArray = <T,>(items: T[]): T[] => {
  const shuffled = [...items]

  for (let index = shuffled.length - 1; index > 0; index--) {
    const targetIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[targetIndex]] = [shuffled[targetIndex], shuffled[index]]
  }

  return shuffled
}

export const createImpostorPlayers = (names: string[], impostorIndex: number): ImpostorPlayer[] =>
  names.map((name, index) => ({
    id: index,
    name,
    role: index === impostorIndex ? 'Impostor' : 'Cidadao',
    isAlive: true,
    votes: 0
  }))

export const createRevealOrder = (players: ImpostorPlayer[], forcedOrder?: number[]) => {
  if (forcedOrder) return forcedOrder
  return shuffleArray(players.map((player) => player.id))
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
  selectedVote: number | null
): ImpostorWinner | null => {
  if (selectedVote === null) return null

  const votedPlayer = players.find((player) => player.id === selectedVote)
  if (!votedPlayer) return null

  return votedPlayer.role === 'Impostor' ? 'Cidadaos' : 'Impostor'
}

export const resetImpostorPlayersVotes = (players: ImpostorPlayer[]) =>
  players.map((player) => ({ ...player, votes: 0 }))
