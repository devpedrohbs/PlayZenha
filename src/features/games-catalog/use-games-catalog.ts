import { useApiQuery } from '../../shared/api'
import { listGames } from './games.api'

const EMPTY_GAMES: Awaited<ReturnType<typeof listGames>> = []

export const useGamesCatalog = () => useApiQuery(listGames, EMPTY_GAMES)
