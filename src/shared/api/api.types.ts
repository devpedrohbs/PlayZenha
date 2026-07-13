export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type ApiErrorKind =
  | 'network'
  | 'http'
  | 'invalid-response'
  | 'aborted'

export interface ApiRequestOptions {
  method?: HttpMethod
  body?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
}

export type ApiCallOptions = Omit<ApiRequestOptions, 'method' | 'body'>

export type AccessTokenProvider = () =>
  | string
  | null
  | Promise<string | null>

export interface ApiClientConfig {
  baseUrl: string
  getAccessToken?: AccessTokenProvider
  fetch?: typeof globalThis.fetch
}
