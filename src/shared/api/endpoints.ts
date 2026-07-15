export const API_ENDPOINTS = {
  health: '/health',
  auth: {
    forgotPassword: '/v1/auth/forgot-password',
    google: '/v1/auth/google',
    login: '/v1/auth/login',
    logout: '/v1/auth/logout',
    refresh: '/v1/auth/refresh',
    register: '/v1/auth/register',
    resetPassword: '/v1/auth/reset-password'
  },
  games: '/v1/games',
  startGame: (slug: string) => `/v1/games/${encodeURIComponent(slug)}/start`,
  me: {
    profile: '/v1/me',
    updateProfile: '/v1/me/profile'
  },
  subscriptions: '/v1/subscriptions'
} as const
