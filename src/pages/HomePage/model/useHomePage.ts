import { useEffect, useMemo, useState } from 'react'
import {
  type GameCatalogItem,
  getHomeFeaturedGames,
  useGamesCatalog
} from '../../../features/games-catalog'
import {
  DEFAULT_TOAST_MESSAGE,
  NAVIGATION_OFFSET_PX,
  REVEAL_THRESHOLD,
  TOAST_DURATION_MS
} from './constants'
import type { GameCategory } from './models'
import { filterHomeGames, getScrollTop } from './rules'

export const useHomePage = () => {
  const { data: games, error: gamesError, isLoading: gamesLoading, reload: reloadGames } = useGamesCatalog()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<GameCategory>('all')
  const [selectedGame, setSelectedGame] = useState<GameCatalogItem>()
  const [toast, setToast] = useState('')

  const homeGames = useMemo(() => getHomeFeaturedGames(games), [games])

  const filteredGames = useMemo(
    () => filterHomeGames(homeGames, activeFilter),
    [activeFilter, homeGames]
  )

  useEffect(() => {
    setSelectedGame((currentGame) =>
      homeGames.find((game) => game.id === currentGame?.id) ??
      homeGames[1] ??
      homeGames[0]
    )
  }, [homeGames])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('.reveal'))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: REVEAL_THRESHOLD }
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), TOAST_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [toast])

  const showToast = (message = DEFAULT_TOAST_MESSAGE) => setToast(message)

  const scrollTo = (selector: string) => {
    const target = document.querySelector(selector)
    if (!target) return
    window.scrollTo({
      top: getScrollTop(target, NAVIGATION_OFFSET_PX),
      behavior: 'smooth'
    })
    setMenuOpen(false)
  }

  const selectGame = (game: GameCatalogItem) => {
    setSelectedGame(game)
    showToast(`${game.name} aberto no mockup.`)
  }

  return {
    activeFilter,
    filteredGames,
    gamesError,
    gamesLoading,
    menuOpen,
    reloadGames,
    selectedGame,
    setActiveFilter,
    setMenuOpen,
    selectGame,
    showToast,
    scrollTo,
    toast
  }
}
