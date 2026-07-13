import type { GameCatalogItem } from '../../../features/games-catalog'
import type { GameCategory } from './models'

const homeCategoryMap: Record<Exclude<GameCategory, 'all'>, string[]> = {
  'quebra-gelo': ['Quebra-Gelo'],
  desafio: ['Blefe'],
  festa: ['Festa']
}

export const filterHomeGames = (games: GameCatalogItem[], category: GameCategory) =>
  games.filter((game) => category === 'all' || homeCategoryMap[category].includes(game.category))

export const getScrollTop = (element: Element, offset: number) =>
  element.getBoundingClientRect().top + window.pageYOffset - offset
