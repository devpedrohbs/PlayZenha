import { apiClient } from '../../../shared/api/api-client'
import { API_ENDPOINTS } from '../../../shared/api/endpoints'
import type {
  AuthResponse,
  AuthUser,
  GoogleLoginInput,
  LoginInput,
  PasswordResetRequestResponse,
  RegisterInput,
  UpdateProfileInput
} from './auth.types'

export const authApi = {
  register(input: RegisterInput): Promise<AuthResponse> {
    return apiClient.post<AuthResponse, RegisterInput>(
      API_ENDPOINTS.auth.register,
      input
    )
  },

  login(input: LoginInput): Promise<AuthResponse> {
    return apiClient.post<AuthResponse, LoginInput>(
      API_ENDPOINTS.auth.login,
      input
    )
  },

  loginWithGoogle(input: GoogleLoginInput): Promise<AuthResponse> {
    return apiClient.post<AuthResponse, GoogleLoginInput>(
      API_ENDPOINTS.auth.google,
      input
    )
  },

  refresh(): Promise<AuthResponse> {
    return apiClient.post<AuthResponse, Record<string, never>>(
      API_ENDPOINTS.auth.refresh,
      {}
    )
  },

  logout(): Promise<void> {
    return apiClient.post<void, Record<string, never>>(
      API_ENDPOINTS.auth.logout,
      {}
    )
  },

  me(): Promise<AuthUser> {
    return apiClient.get<AuthUser>(API_ENDPOINTS.me.profile)
  },

  updateProfile(input: UpdateProfileInput): Promise<AuthUser> {
    return apiClient.patch<AuthUser, UpdateProfileInput>(
      API_ENDPOINTS.me.updateProfile,
      input
    )
  },

  requestPasswordReset(
    email: string
  ): Promise<PasswordResetRequestResponse> {
    return apiClient.post<PasswordResetRequestResponse, { email: string }>(
      API_ENDPOINTS.auth.forgotPassword,
      { email }
    )
  },

  resetPassword(input: { token: string; password: string }): Promise<void> {
    return apiClient.post<void, { token: string; password: string }>(
      API_ENDPOINTS.auth.resetPassword,
      input
    )
  }
}
