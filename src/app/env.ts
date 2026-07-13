export const appEnv = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD
} as const
