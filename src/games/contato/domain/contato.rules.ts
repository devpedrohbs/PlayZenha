import { CONTATO_PLAYER_COUNT, CONTATO_WORD_BANK } from './contato.constants'
import type { ContatoPlayer, ContatoRoundSetup } from './contato.types'
import { createId } from '../../../shared/utils/id'

export const normalizeContatoPlayerName = (name: string) => name.trim().toUpperCase()

export const createContatoPlayers = (playerNames: string[]): ContatoPlayer[] =>
  playerNames.map((name) => name.trim()).map((name) => ({
    id: createId(),
    name
  }))

export const validateContatoPlayerNames = (playerNames: string[]): string | null => {
  const normalizedNames = playerNames.map((name) => name.trim())

  if (normalizedNames.some((name) => !name)) {
    return 'Preencha os 3 nomes para começar.'
  }

  if (normalizedNames.length !== CONTATO_PLAYER_COUNT) {
    return 'Contato precisa de exatamente 3 jogadores.'
  }

  const unique = new Set(normalizedNames.map(normalizeContatoPlayerName))
  if (unique.size !== CONTATO_PLAYER_COUNT) {
    return 'Os 3 nomes precisam ser diferentes.'
  }

  return null
}

export const pickContatoWord = (lastWord = ''): string => {
  const options = CONTATO_WORD_BANK.filter((word) => word !== lastWord)
  return options[Math.floor(Math.random() * options.length)]
}

export const pickContatoJudge = (players: ContatoPlayer[]) =>
  players[Math.floor(Math.random() * players.length)]?.id ?? null

export const getNextContatoJudgeId = (players: ContatoPlayer[], currentJudgeId: string) => {
  const currentIndex = players.findIndex((player) => player.id === currentJudgeId)
  if (currentIndex === -1) return pickContatoJudge(players)
  return players[(currentIndex + 1) % players.length].id
}

export const createContatoRound = (
  players: ContatoPlayer[],
  round: number,
  lastWord: string,
  forcedJudgeId?: string
): ContatoRoundSetup => ({
  judgeId: typeof forcedJudgeId === 'string' ? forcedJudgeId : pickContatoJudge(players) ?? '',
  word: pickContatoWord(lastWord),
  round
})

export const maskContatoWord = (word: string, revealedLetters: number) =>
  word
    .split('')
    .map((char, index) => (index < revealedLetters ? char : '_'))
    .join(' ')
