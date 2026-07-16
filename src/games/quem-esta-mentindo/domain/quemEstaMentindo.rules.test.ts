import { describe, expect, it } from 'vitest'
import {
  createQuemEstaMentindoRound,
  resolveQuemEstaMentindoResult,
  scoreQuemEstaMentindoRound,
  validateQuemEstaMentindoNames
} from './quemEstaMentindo.rules'

const question = { category: 'Cotidiano' as const, text: 'Pergunta teste?', personal: false, difficulty: 'Médio' as const }

describe('quem está mentindo rules', () => {
  it('validates player limits and duplicate names', () => {
    expect(validateQuemEstaMentindoNames(['Ana', 'Bia'])).toContain('Mínimo de 3')
    expect(validateQuemEstaMentindoNames(Array.from({ length: 13 }, (_, index) => `Jogador ${index}`))).toContain('Máximo de 12')
    expect(validateQuemEstaMentindoNames(['Ana', ' ana ', 'Bia'])).toContain('já está em uso')
    expect(validateQuemEstaMentindoNames(['Ana', 'Bia', 'Caio'])).toBeNull()
  })

  it('creates unique players, liars and a complete reveal order', () => {
    const round = createQuemEstaMentindoRound({ playerNames: ['Ana', 'Bia', 'Caio', 'Duda'], liarIndexes: [1, 3], question })
    expect(round.players).toHaveLength(4)
    expect(new Set(round.players.map((player) => player.id)).size).toBe(4)
    expect(round.players.filter((player) => player.role === 'Mentiroso')).toHaveLength(2)
    expect(new Set(round.revealOrder)).toEqual(new Set(round.players.map((player) => player.id)))
  })

  it('awards the group when only liars tie for the most votes', () => {
    const round = createQuemEstaMentindoRound({ playerNames: ['Ana', 'Bia', 'Caio'], liarIndexes: [1], question })
    const liar = round.players[1]
    const result = resolveQuemEstaMentindoResult(round.players, { [round.players[0].id]: liar.id, [round.players[2].id]: liar.id })
    expect(result.winner).toBe('Grupo')
    expect(result.correctVoterIds).toEqual(expect.arrayContaining([round.players[0].id, round.players[2].id]))
  })

  it('scores correct voters and liars who escape', () => {
    const round = createQuemEstaMentindoRound({ playerNames: ['Ana', 'Bia', 'Caio'], liarIndexes: [1], question })
    const result = resolveQuemEstaMentindoResult(round.players, { [round.players[0].id]: round.players[2].id, [round.players[2].id]: round.players[0].id })
    const scored = scoreQuemEstaMentindoRound(round.players, result, true)
    expect(result.winner).toBe('Mentirosos')
    expect(scored.find((player) => player.role === 'Mentiroso')?.score).toBeGreaterThanOrEqual(2)
  })
})
