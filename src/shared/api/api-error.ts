import type { ApiErrorKind } from './api.types'

interface ApiErrorOptions {
  status: number
  kind: ApiErrorKind
  code?: string
  details?: unknown
  cause?: unknown
}

export class ApiError extends Error {
  readonly status: number
  readonly kind: ApiErrorKind
  readonly code?: string
  readonly details?: unknown
  readonly cause?: unknown

  constructor(message: string, options: ApiErrorOptions) {
    super(message)
    this.name = 'ApiError'
    this.status = options.status
    this.kind = options.kind
    this.code = options.code
    this.details = options.details
    this.cause = options.cause
  }
}
