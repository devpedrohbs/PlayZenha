import { appEnv } from '../../app/env'
import { ApiError } from './api-error'
import type {
  ApiCallOptions,
  ApiClientConfig,
  ApiRequestOptions
} from './api.types'

const NO_CONTENT_STATUS_CODES = new Set([204, 205])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function getErrorCode(payload: unknown): string | undefined {
  if (!isRecord(payload)) return undefined
  return typeof payload.code === 'string' ? payload.code : undefined
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (!isRecord(payload)) return fallback
  return typeof payload.message === 'string' ? payload.message : fallback
}

function isAbortError(error: unknown, signal?: AbortSignal): boolean {
  if (signal?.aborted) return true
  return error instanceof DOMException && error.name === 'AbortError'
}

function joinUrl(baseUrl: string, path: string): string {
  const normalizedBaseUrl = baseUrl.trim().replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBaseUrl}${normalizedPath}`
}

async function parseResponse<TResponse>(response: Response): Promise<TResponse> {
  if (NO_CONTENT_STATUS_CODES.has(response.status)) {
    return undefined as TResponse
  }

  const responseText = await response.text()
  if (!responseText) {
    if (response.ok) return undefined as TResponse

    throw new ApiError(`Request failed with status ${response.status}`, {
      status: response.status,
      kind: 'http'
    })
  }

  let payload: unknown

  try {
    payload = JSON.parse(responseText) as unknown
  } catch (error) {
    if (!response.ok) {
      throw new ApiError(`Request failed with status ${response.status}`, {
        status: response.status,
        kind: 'http',
        details: responseText,
        cause: error
      })
    }

    throw new ApiError('The API returned an invalid JSON response', {
      status: response.status,
      kind: 'invalid-response',
      details: responseText,
      cause: error
    })
  }

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(payload, `Request failed with status ${response.status}`),
      {
        status: response.status,
        kind: 'http',
        code: getErrorCode(payload),
        details: payload
      }
    )
  }

  return payload as TResponse
}

export class ApiClient {
  private readonly baseUrl: string
  private readonly fetch: typeof globalThis.fetch
  private readonly getAccessToken?: ApiClientConfig['getAccessToken']

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl
    this.fetch =
      config.fetch ??
      ((input, init) => globalThis.fetch(input, init))
    this.getAccessToken = config.getAccessToken
  }

  get<TResponse>(path: string, options?: ApiCallOptions): Promise<TResponse> {
    return this.request<TResponse>(path, { ...options, method: 'GET' })
  }

  post<TResponse, TBody>(
    path: string,
    body: TBody,
    options?: ApiCallOptions
  ): Promise<TResponse> {
    return this.request<TResponse>(path, { ...options, method: 'POST', body })
  }

  put<TResponse, TBody>(
    path: string,
    body: TBody,
    options?: ApiCallOptions
  ): Promise<TResponse> {
    return this.request<TResponse>(path, { ...options, method: 'PUT', body })
  }

  patch<TResponse, TBody>(
    path: string,
    body: TBody,
    options?: ApiCallOptions
  ): Promise<TResponse> {
    return this.request<TResponse>(path, { ...options, method: 'PATCH', body })
  }

  delete<TResponse>(path: string, options?: ApiCallOptions): Promise<TResponse> {
    return this.request<TResponse>(path, { ...options, method: 'DELETE' })
  }

  private async request<TResponse>(
    path: string,
    options: ApiRequestOptions
  ): Promise<TResponse> {
    const headers = new Headers(options.headers)

    if (options.body !== undefined && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    const accessToken = await this.getAccessToken?.()
    if (accessToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }

    let response: Response

    try {
      response = await this.fetch(joinUrl(this.baseUrl, path), {
        method: options.method ?? 'GET',
        headers,
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: options.signal
      })
    } catch (error) {
      if (isAbortError(error, options.signal)) {
        throw new ApiError('The request was cancelled', {
          status: 0,
          kind: 'aborted',
          cause: error
        })
      }

      throw new ApiError('Unable to connect to the API', {
        status: 0,
        kind: 'network',
        cause: error
      })
    }

    return parseResponse<TResponse>(response)
  }
}

export const apiClient = new ApiClient({
  baseUrl: appEnv.apiBaseUrl
})
