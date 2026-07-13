import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiClient } from './api-client'
import { ApiError } from './api-error'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ApiClient', () => {
  it('joins the base URL and parses JSON responses', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ status: 'ok' }), { status: 200 })
    )
    const client = new ApiClient({
      baseUrl: 'https://api.playzenha.test/',
      fetch: fetchMock
    })

    const response = await client.get<{ status: string }>('/health')

    expect(response).toEqual({ status: 'ok' })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.playzenha.test/health',
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('serializes request bodies and supports a future access token provider', async () => {
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        void input
        void init
        return new Response(JSON.stringify({ id: 'game-1' }), { status: 201 })
      }
    )
    const client = new ApiClient({
      baseUrl: '',
      fetch: fetchMock,
      getAccessToken: () => 'future-token'
    })

    await client.post<{ id: string }, { name: string }>(
      '/v1/games',
      { name: 'Contato' },
      { headers: { 'X-Request-Source': 'test' } }
    )

    const requestInit = fetchMock.mock.calls[0]?.[1]
    const headers = new Headers(requestInit?.headers)

    expect(requestInit?.body).toBe(JSON.stringify({ name: 'Contato' }))
    expect(headers.get('Content-Type')).toBe('application/json')
    expect(headers.get('Authorization')).toBe('Bearer future-token')
    expect(headers.get('X-Request-Source')).toBe('test')
  })

  it('returns undefined for responses without content', async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 204 }))
    const client = new ApiClient({ baseUrl: '', fetch: fetchMock })

    await expect(client.delete<void>('/v1/games/game-1')).resolves.toBeUndefined()
  })

  it('throws an HTTP ApiError with server details', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          message: 'Game not found',
          code: 'GAME_NOT_FOUND',
          resourceId: 'game-1'
        }),
        { status: 404 }
      )
    )
    const client = new ApiClient({ baseUrl: '', fetch: fetchMock })

    await expect(client.get('/v1/games/game-1')).rejects.toMatchObject({
      name: 'ApiError',
      kind: 'http',
      status: 404,
      code: 'GAME_NOT_FOUND',
      message: 'Game not found',
      details: {
        resourceId: 'game-1'
      }
    } satisfies Partial<ApiError>)
  })

  it('distinguishes invalid JSON responses', async () => {
    const fetchMock = vi.fn(async () =>
      new Response('not-json', { status: 200 })
    )
    const client = new ApiClient({ baseUrl: '', fetch: fetchMock })

    await expect(client.get('/health')).rejects.toMatchObject({
      kind: 'invalid-response',
      status: 200
    } satisfies Partial<ApiError>)
  })

  it('distinguishes network failures', async () => {
    const fetchMock = vi.fn(async () => {
      throw new TypeError('Failed to fetch')
    })
    const client = new ApiClient({ baseUrl: '', fetch: fetchMock })

    await expect(client.get('/health')).rejects.toMatchObject({
      kind: 'network',
      status: 0
    } satisfies Partial<ApiError>)
  })

  it('distinguishes cancelled requests', async () => {
    const controller = new AbortController()
    const fetchMock = vi.fn(async () => {
      throw new Error('Request interrupted')
    })
    const client = new ApiClient({ baseUrl: '', fetch: fetchMock })

    controller.abort()

    await expect(
      client.get('/health', { signal: controller.signal })
    ).rejects.toMatchObject({
      kind: 'aborted',
      status: 0
    } satisfies Partial<ApiError>)
  })
})
