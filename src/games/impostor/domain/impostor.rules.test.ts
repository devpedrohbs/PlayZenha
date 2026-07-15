import { describe, expect, it } from 'vitest'
import {
  createImpostorRound,
  resolveImpostorVoteWinner,
  validateImpostorPlayerNames
} from './impostor.rules'

const TEST_THEMES = ['Tema de teste']

describe('impostor rules', () => {
  it('rejects fewer than three players', () => {
    expect(validateImpostorPlayerNames(['Ana', 'Bia'])).toContain('Minimo de 3')
  })

  it('rejects more than sixteen players', () => {
    const playerNames = Array.from({ length: 17 }, (_, index) => `Jogador ${index}`)

    expect(validateImpostorPlayerNames(playerNames)).toContain('Maximo de 16')
  })

  it('rejects duplicate names regardless of case', () => {
    expect(validateImpostorPlayerNames(['Ana', 'ana', 'Bia'])).toContain('ja esta em uso')
  })

  it('accepts valid player names', () => {
    expect(validateImpostorPlayerNames(['Ana', 'Bia', 'Caio'])).toBeNull()
  })

  it('creates one impostor, retains all players and generates unique IDs', () => {
    const playerNames = ['Ana', 'Bia', 'Caio', 'Duda']
    const round = createImpostorRound({
      playerNames,
      themeIndex: 0,
      impostorIndex: 2,
      themes: TEST_THEMES,
      revealOrder: []
    })

    expect(round.players).toHaveLength(playerNames.length)
    expect(round.players.map((player) => player.name)).toEqual(playerNames)
    expect(round.players.filter((player) => player.role === 'Impostor')).toHaveLength(1)
    expect(new Set(round.players.map((player) => player.id)).size).toBe(playerNames.length)
  })

  it('creates a valid reveal order for every player', () => {
    const round = createImpostorRound({
      playerNames: ['Ana', 'Bia', 'Caio'],
      themeIndex: 0,
      impostorIndex: 1,
      themes: TEST_THEMES,
      revealOrder: []
    })

    expect(round.revealOrder).toHaveLength(round.players.length)
    expect(new Set(round.revealOrder)).toEqual(new Set(round.players.map((player) => player.id)))
  })

  it('declares citizens the winner after voting for the impostor', () => {
    const round = createImpostorRound({
      playerNames: ['Ana', 'Bia', 'Caio'],
      themeIndex: 0,
      impostorIndex: 1,
      themes: TEST_THEMES,
      revealOrder: []
    })
    const impostor = round.players.find((player) => player.role === 'Impostor')

    expect(resolveImpostorVoteWinner(round.players, impostor?.id ?? null)).toBe('Cidadaos')
  })

  it('declares the impostor the winner after voting for a citizen', () => {
    const round = createImpostorRound({
      playerNames: ['Ana', 'Bia', 'Caio'],
      themeIndex: 0,
      impostorIndex: 1,
      themes: TEST_THEMES,
      revealOrder: []
    })
    const citizen = round.players.find((player) => player.role === 'Cidadao')

    expect(resolveImpostorVoteWinner(round.players, citizen?.id ?? null)).toBe('Impostor')
  })
})
