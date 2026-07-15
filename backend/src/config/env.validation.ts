import { Transform, plainToInstance, Type } from 'class-transformer'
import type { TransformFnParams } from 'class-transformer'
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync
} from 'class-validator'

export enum NodeEnvironment {
  Development = 'development',
  Production = 'production',
  Test = 'test'
}

export const APPLICATION_LOG_LEVELS = [
  'error',
  'warn',
  'log',
  'debug',
  'verbose'
] as const

export type ApplicationLogLevel = (typeof APPLICATION_LOG_LEVELS)[number]

export class EnvironmentVariables {
  @IsEnum(NodeEnvironment)
  NODE_ENV: NodeEnvironment = NodeEnvironment.Development

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT = 3000

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  DIRECT_URL?: string

  @IsString()
  @IsNotEmpty()
  CORS_ORIGINS!: string

  @Transform(({ value }: TransformFnParams) => parseBoolean(value))
  @IsBoolean()
  SWAGGER_ENABLED = true

  @IsIn(APPLICATION_LOG_LEVELS)
  LOG_LEVEL: ApplicationLogLevel = 'log'

  @IsString()
  @IsNotEmpty()
  AUTH_JWT_SECRET = 'development-only-playzenha-auth-secret-change-me'

  @IsString()
  @IsNotEmpty()
  AUTH_JWT_ISSUER = 'playzenha-api'

  @IsString()
  @IsNotEmpty()
  AUTH_JWT_AUDIENCE = 'playzenha-web'

  @IsString()
  @IsNotEmpty()
  AUTH_REFRESH_COOKIE_NAME = 'playzenha.refresh'

  @Type(() => Number)
  @IsInt()
  @Min(60)
  @Max(86400)
  AUTH_ACCESS_TOKEN_TTL_SECONDS = 900

  @Type(() => Number)
  @IsInt()
  @Min(3600)
  @Max(60 * 60 * 24 * 90)
  AUTH_REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30

  @Type(() => Number)
  @IsInt()
  @Min(300)
  @Max(60 * 60 * 24)
  AUTH_PASSWORD_RESET_TTL_SECONDS = 60 * 60

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  AUTH_GOOGLE_CLIENT_ID?: string
}

export function validateEnvironment(
  config: Record<string, unknown>
): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: false
  })
  const validationErrors = validateSync(validated, {
    skipMissingProperties: false
  })
  const messages = validationErrors.flatMap((error) =>
    Object.values(error.constraints ?? {})
  )

  validatePostgresUrl('DATABASE_URL', validated.DATABASE_URL, messages)

  if (validated.DIRECT_URL) {
    validatePostgresUrl('DIRECT_URL', validated.DIRECT_URL, messages)
  }

  validateCorsOrigins(validated.CORS_ORIGINS, messages)
  validateAuthSecret(validated, messages)

  if (messages.length > 0) {
    throw new Error(`Invalid environment configuration:\n- ${messages.join('\n- ')}`)
  }

  return validated
}

function validateAuthSecret(
  config: EnvironmentVariables,
  messages: string[]
): void {
  if (config.AUTH_JWT_SECRET.length < 32) {
    messages.push('AUTH_JWT_SECRET must contain at least 32 characters')
  }

  if (
    config.NODE_ENV === NodeEnvironment.Production &&
    config.AUTH_JWT_SECRET === 'development-only-playzenha-auth-secret-change-me'
  ) {
    messages.push('AUTH_JWT_SECRET must be changed in production')
  }
}

function parseBoolean(value: unknown): unknown {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()

    if (normalized === 'true') {
      return true
    }

    if (normalized === 'false') {
      return false
    }
  }

  return value
}

function validatePostgresUrl(
  variableName: string,
  value: string | undefined,
  messages: string[]
): void {
  if (!value) {
    return
  }

  try {
    const url = new URL(value)

    if (!['postgres:', 'postgresql:'].includes(url.protocol)) {
      messages.push(
        `${variableName} must use the postgres:// or postgresql:// protocol`
      )
    }
  } catch {
    messages.push(`${variableName} must be a valid PostgreSQL URL`)
  }
}

function validateCorsOrigins(value: string | undefined, messages: string[]): void {
  if (!value) {
    return
  }

  const origins = value.split(',').map((origin) => origin.trim())

  if (origins.some((origin) => origin.length === 0)) {
    messages.push('CORS_ORIGINS must not contain empty origins')
    return
  }

  for (const origin of origins) {
    try {
      const url = new URL(origin)

      if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin) {
        messages.push(
          `CORS_ORIGINS contains an invalid HTTP origin: ${origin}`
        )
      }
    } catch {
      messages.push(`CORS_ORIGINS contains an invalid URL: ${origin}`)
    }
  }
}
