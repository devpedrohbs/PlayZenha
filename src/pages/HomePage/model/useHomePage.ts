import { useEffect, useMemo, useState } from 'react'
import {
  GAMES_CATALOG,
  type GameCatalogItem,
  getHomeFeaturedGames
} from '../../../features/games-catalog'
import {
  DEFAULT_TOAST_MESSAGE,
  NAVIGATION_OFFSET_PX,
  REVEAL_THRESHOLD,
  TOAST_DURATION_MS
} from './constants'
import type { GameCategory } from './models'
import { filterHomeGames, getScrollTop } from './rules'

const HOME_GAMES = getHomeFeaturedGames(GAMES_CATALOG)
const DEFAULT_GAME = HOME_GAMES[1] ?? HOME_GAMES[0]

export const useHomePage = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<GameCategory>('all')
  const [selectedGame, setSelectedGame] = useState<GameCatalogItem>(DEFAULT_GAME)
  const [toast, setToast] = useState('')

  const filteredGames = useMemo(
    () => filterHomeGames(HOME_GAMES, activeFilter),
    [activeFilter]
  )

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
    menuOpen,
    selectedGame,
    setActiveFilter,
    setMenuOpen,
    selectGame,
    showToast,
    scrollTo,
    toast
  }
}
