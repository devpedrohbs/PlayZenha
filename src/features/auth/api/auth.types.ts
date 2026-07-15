export interface AuthUser {
  id: string
  nickname: string
  email: string
  role: 'player' | 'admin'
  status: 'active' | 'suspended' | 'disabled'
  planCode: 'free' | 'premium' | 'ultimate' | null
  createdAt: string
}

export interface UpdateProfileInput {
  nickname: string
}

export interface AuthTokens {
  accessToken: string
  tokenType: 'Bearer'
  expiresIn: number
}

export interface AuthResponse {
  user: AuthUser
  tokens: AuthTokens
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput extends LoginInput {
  nickname: string
}

export interface PasswordResetRequestResponse {
  message: string
  resetToken?: string
}
