import { Injectable } from '@nestjs/common'
import type { LogLevel } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import {
  NodeEnvironment,
  type ApplicationLogLevel,
  type EnvironmentVariables
} from './env.validation.js'

const LOG_LEVELS: Record<ApplicationLogLevel, readonly LogLevel[]> = {
  error: ['error'],
  warn: ['error', 'warn'],
  log: ['error', 'warn', 'log'],
  debug: ['error', 'warn', 'log', 'debug'],
  verbose: ['error', 'warn', 'log', 'debug', 'verbose']
}

@Injectable()
export class AppConfigService {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>
  ) {}

  get nodeEnvironment(): NodeEnvironment {
    return this.configService.get('NODE_ENV', { infer: true })
  }

  get port(): number {
    return this.configService.get('PORT', { infer: true })
  }

  get databaseUrl(): string {
    return this.configService.get('DATABASE_URL', { infer: true })
  }

  get corsOrigins(): readonly string[] {
    return this.configService
      .get('CORS_ORIGINS', { infer: true })
      .split(',')
      .map((origin) => origin.trim())
  }

  get swaggerEnabled(): boolean {
    return this.configService.get('SWAGGER_ENABLED', { infer: true })
  }

  get loggerLevels(): readonly LogLevel[] {
    const configuredLevel = this.configService.get('LOG_LEVEL', { infer: true })
    return LOG_LEVELS[configuredLevel]
  }

  get authJwtSecret(): string {
    return this.configService.get('AUTH_JWT_SECRET', { infer: true })
  }

  get authJwtIssuer(): string {
    return this.configService.get('AUTH_JWT_ISSUER', { infer: true })
  }

  get authJwtAudience(): string {
    return this.configService.get('AUTH_JWT_AUDIENCE', { infer: true })
  }

  get authRefreshCookieName(): string {
    return this.configService.get('AUTH_REFRESH_COOKIE_NAME', { infer: true })
  }

  get authCookieSecure(): boolean {
    return this.nodeEnvironment === NodeEnvironment.Production
  }

  get authAccessTokenTtlSeconds(): number {
    return this.configService.get('AUTH_ACCESS_TOKEN_TTL_SECONDS', {
      infer: true
    })
  }

  get authRefreshTokenTtlSeconds(): number {
    return this.configService.get('AUTH_REFRESH_TOKEN_TTL_SECONDS', {
      infer: true
    })
  }

  get authPasswordResetTtlSeconds(): number {
    return this.configService.get('AUTH_PASSWORD_RESET_TTL_SECONDS', {
      infer: true
    })
  }

  get authGoogleClientId(): string | undefined {
    return this.configService.get('AUTH_GOOGLE_CLIENT_ID', { infer: true })
  }
}
