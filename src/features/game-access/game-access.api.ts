import { API_ENDPOINTS, apiClient } from '../../shared/api'
import type { AuthorizedGame } from './game-access.types'

export const startAuthorizedGame = <TContent>(slug: string) =>
  apiClient.post<AuthorizedGame<TContent>, Record<string, never>>(
    API_ENDPOINTS.startGame(slug),
    {}
  )
