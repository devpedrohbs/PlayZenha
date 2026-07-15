import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import type { ReactNode } from 'react'
import { authTokenStore } from '../../../shared/api/auth-token-store'
import { authApi } from '../api/auth.api'
import type {
  AuthResponse,
  AuthUser,
  LoginInput,
  PasswordResetRequestResponse,
  RegisterInput,
  UpdateProfileInput
} from '../api/auth.types'

type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

interface AuthContextValue {
  status: AuthStatus
  user: AuthUser | null
  login: (input: LoginInput) => Promise<AuthUser>
  register: (input: RegisterInput) => Promise<AuthUser>
  logout: () => Promise<void>
  requestPasswordReset: (
    email: string
  ) => Promise<PasswordResetRequestResponse>
  resetPassword: (input: { token: string; password: string }) => Promise<void>
  updateProfile: (input: UpdateProfileInput) => Promise<AuthUser>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [sessionExpiresIn, setSessionExpiresIn] = useState<number | null>(null)

  const applySession = useCallback((response: AuthResponse): AuthUser => {
    authTokenStore.setTokens(response.tokens)
    setUser(response.user)
    setStatus('authenticated')
    setSessionExpiresIn(response.tokens.expiresIn)
    return response.user
  }, [])

  const clearSession = useCallback(() => {
    authTokenStore.clear()
    setUser(null)
    setStatus('anonymous')
    setSessionExpiresIn(null)
  }, [])

  useEffect(() => {
    let active = true

    const restoreSession = async () => {
      try {
        const currentUser = await authApi.me()
        if (!active) return
        setUser(currentUser)
        setStatus('authenticated')
      } catch {
        try {
          const response = await authApi.refresh()
          if (!active) return
          applySession(response)
        } catch {
          if (!active) return
          clearSession()
        }
      }
    }

    void restoreSession()

    return () => {
      active = false
    }
  }, [applySession, clearSession])

  useEffect(() => {
    if (status !== 'authenticated' || !sessionExpiresIn) return undefined

    const refreshInMs = Math.max(5, sessionExpiresIn - 30) * 1000
    const timer = window.setTimeout(() => {
      void authApi.refresh().then(applySession).catch(clearSession)
    }, refreshInMs)

    return () => window.clearTimeout(timer)
  }, [applySession, clearSession, sessionExpiresIn, status])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      login: async (input) => applySession(await authApi.login(input)),
      register: async (input) => applySession(await authApi.register(input)),
      logout: async () => {
        clearSession()
        await authApi.logout().catch(() => undefined)
      },
      requestPasswordReset: (email) => authApi.requestPasswordReset(email),
      resetPassword: (input) => authApi.resetPassword(input),
      updateProfile: async (input) => {
        const updatedUser = await authApi.updateProfile(input)
        setUser(updatedUser)
        return updatedUser
      }
    }),
    [applySession, clearSession, status, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
