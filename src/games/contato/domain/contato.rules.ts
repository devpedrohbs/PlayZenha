import { CONTATO_PLAYER_COUNT, CONTATO_WORD_BANK } from './contato.constants'
import type { ContatoPlayer, ContatoRoundSetup } from './contato.types'

export const normalizeContatoPlayerName = (name: string) => name.trim().toUpperCase()

export const createContatoPlayers = (playerNames: string[]): ContatoPlayer[] =>
  playerNames.map(normalizeContatoPlayerName).map((name, index) => ({
    id: index,
    name
  }))

export const validateContatoPlayerNames = (playerNames: string[]): string | null => {
  const normalizedNames = playerNames.map(normalizeContatoPlayerName)

  if (normalizedNames.some((name) => !name)) {
    return 'Preencha os 3 nomes para começar.'
  }

  if (normalizedNames.length !== CONTATO_PLAYER_COUNT) {
    return 'Contato precisa de exatamente 3 jogadores.'
  }

  const unique = new Set(normalizedNames)
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

export const getNextContatoJudgeId = (players: ContatoPlayer[], currentJudgeId: number) => {
  const currentIndex = players.findIndex((player) => player.id === currentJudgeId)
  if (currentIndex === -1) return pickContatoJudge(players)
  return players[(currentIndex + 1) % players.length].id
}

export const createContatoRound = (
  players: ContatoPlayer[],
  round: number,
  lastWord: string,
  forcedJudgeId?: number
): ContatoRoundSetup => ({
  judgeId: typeof forcedJudgeId === 'number' ? forcedJudgeId : pickContatoJudge(players) ?? 0,
  word: pickContatoWord(lastWord),
  round
})

export const maskContatoWord = (word: string, revealedLetters: number) =>
  word
    .split('')
    .map((char, index) => (index < revealedLetters ? char : '_'))
    .join(' ')
