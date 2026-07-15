const API_URL_MISSING_MESSAGE =
  '[PlayZenha] VITE_API_URL is not configured. Set it in your .env file before enabling backend requests.'

function getApiUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL?.trim()

  if (!apiUrl && import.meta.env.DEV) {
    console.warn(API_URL_MISSING_MESSAGE)
  }

  return apiUrl ?? ''
}

function getGoogleClientId(): string {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? ''
}

export const appEnv = {
  apiUrl: getApiUrl(),
  googleClientId: getGoogleClientId(),
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD
} as const
