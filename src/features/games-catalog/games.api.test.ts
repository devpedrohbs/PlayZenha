import { afterEach, describe, expect, it, vi } from 'vitest'
import { listGames, mapGameResponse } from './games.api'

const gameResponse = {
  id: '75cf2cbb-a7e2-4c26-9639-7f30d65f9620',
  slug: 'jogo-da-api',
  name: 'Jogo da API',
  shortDescription: 'Este jogo veio do PostgreSQL.',
  category: 'Festa',
  minPlayers: 3,
  maxPlayers: 8,
  averageDurationMinutes: 15,
  difficulty: 'easy' as const,
  status: 'available' as const,
  requiredPlan: 'free' as const,
  tags: ['API'],
  featured: true,
  isNew: false,
  icon: 'spark',
  colors: ['#112233', '#445566']
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('games API', () => {
  it('maps API-only fields to the catalog model safely', () => {
    expect(mapGameResponse({ ...gameResponse, icon: 'unknown-icon' })).toMatchObject({
      id: gameResponse.id,
      icon: undefined,
      colors: ['#112233', '#445566']
    })
  })

  it('loads games from the backend endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([gameResponse]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    )
    vi.stubGlobal('fetch', fetchMock)

    const games = await listGames(new AbortController().signal)

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/v1/games',
      expect.objectContaining({ method: 'GET' })
    )
    expect(games).toEqual([expect.objectContaining({ name: 'Jogo da API' })])
  })
})
