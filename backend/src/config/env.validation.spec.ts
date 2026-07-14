import { validateEnvironment } from './env.validation.js'

const validEnvironment = {
  NODE_ENV: 'development',
  PORT: '3000',
  DATABASE_URL: 'postgresql://playzenha:playzenha@localhost:5432/playzenha',
  CORS_ORIGINS: 'http://localhost:5173,https://playzenha.example.com',
  SWAGGER_ENABLED: 'true',
  LOG_LEVEL: 'debug'
}

describe('validateEnvironment', () => {
  it('normalizes numbers and boolean strings', () => {
    const environment = validateEnvironment(validEnvironment)

    expect(environment.PORT).toBe(3000)
    expect(environment.SWAGGER_ENABLED).toBe(true)
  })

  it('converts the false boolean string without treating it as truthy', () => {
    const environment = validateEnvironment({
      ...validEnvironment,
      SWAGGER_ENABLED: 'false'
    })

    expect(environment.SWAGGER_ENABLED).toBe(false)
  })

  it('fails clearly when DATABASE_URL is missing', () => {
    const { DATABASE_URL: omitted, ...environmentWithoutDatabase } =
      validEnvironment

    expect(omitted).toBeDefined()
    expect(() => validateEnvironment(environmentWithoutDatabase)).toThrow(
      'DATABASE_URL'
    )
  })

  it('rejects invalid PostgreSQL URLs', () => {
    expect(() =>
      validateEnvironment({
        ...validEnvironment,
        DATABASE_URL: 'https://database.example.com'
      })
    ).toThrow('DATABASE_URL must use the postgres:// or postgresql:// protocol')
  })

  it('rejects an invalid origin in a comma-separated list', () => {
    expect(() =>
      validateEnvironment({
        ...validEnvironment,
        CORS_ORIGINS: 'http://localhost:5173,not-a-url'
      })
    ).toThrow('CORS_ORIGINS contains an invalid URL')
  })
})
