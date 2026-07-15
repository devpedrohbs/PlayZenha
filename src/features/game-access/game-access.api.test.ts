import { afterEach, describe, expect, it, vi } from 'vitest'
import { authTokenStore } from '../../shared/api/auth-token-store'
import { startAuthorizedGame } from './game-access.api'

afterEach(() => {
  authTokenStore.clear()
  vi.unstubAllGlobals()
})

describe('game access API', () => {
  it('sends the validated access token and receives protected content', async () => {
    authTokenStore.setTokens({ accessToken: 'validated-access-token' })
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        source: 'subscription',
        game: { id: '1', slug: 'impostor', name: 'Impostor', requiredPlan: 'free' },
        content: { themes: ['Tema autorizado'] },
        contentVersion: 1
      }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await startAuthorizedGame<{ themes: string[] }>('impostor')

    const request = fetchMock.mock.calls[0]
    const headers = new Headers(request?.[1]?.headers)
    expect(request?.[0]).toBe('http://localhost:3000/v1/games/impostor/start')
    expect(headers.get('Authorization')).toBe('Bearer validated-access-token')
    expect(request?.[1]).toEqual(expect.objectContaining({ credentials: 'include' }))
    expect(result.content.themes).toEqual(['Tema autorizado'])
  })
})
