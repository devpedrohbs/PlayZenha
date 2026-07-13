import { QUEM_SOU_EU_MIN_PLAYERS } from './quemSouEu.constants'
import { shuffle } from '../../../shared/utils/shuffle'
import { createId } from '../../../shared/utils/id'
import type {
  QuemSouEuAssignment,
  QuemSouEuPlayer,
  QuemSouEuRoundResult,
  QuemSouEuRoundStatus
} from './quemSouEu.types'

export const normalizeQuemSouEuPlayerName = (name: string) => name.trim().toUpperCase()

export const getFilledQuemSouEuPlayerNames = (playerNames: string[]) =>
  playerNames.map((name) => name.trim()).filter(Boolean)

export const validateQuemSouEuPlayerNames = (playerNames: string[]): string | null => {
  const names = getFilledQuemSouEuPlayerNames(playerNames)
  const unique = new Set(names.map(normalizeQuemSouEuPlayerName))

  if (names.length < QUEM_SOU_EU_MIN_PLAYERS) {
    return 'Minimo de 2 jogadores para iniciar.'
  }

  if (unique.size !== names.length) {
    return 'Os nomes precisam ser diferentes.'
  }

  return null
}

export const createQuemSouEuPlayers = (playerNames: string[]): QuemSouEuPlayer[] =>
  getFilledQuemSouEuPlayerNames(playerNames).map((name) => ({
    id: createId(),
    name
  }))

export const buildDerangement = (ids: string[]): string[] => {
  if (ids.length < 2) return [...ids]

  for (let attempt = 0; attempt < 300; attempt++) {
    const shuffled = shuffle(ids)
    const valid = shuffled.every((targetId, index) => targetId !== ids[index])
    if (valid) return shuffled
  }

  return [...ids.slice(1), ids[0]]
}

export const createQuemSouEuAssignments = (players: QuemSouEuPlayer[]): QuemSouEuAssignment[] => {
  const ids = players.map((player) => player.id)
  const targets = buildDerangement(ids)

  return ids.map((writerId, index) => ({
    writerId,
    targetId: targets[index],
    character: ''
  }))
}

export const createQuemSouEuRoundResult = (
  playerId: string,
  status: QuemSouEuRoundStatus,
  timeUsed: number,
  character: string
): QuemSouEuRoundResult => ({
  playerId,
  status,
  timeUsed,
  character
})

export const normalizeQuemSouEuCharacter = (character: string) => character.trim().toUpperCase()
