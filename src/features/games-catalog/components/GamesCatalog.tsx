import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Dice5 } from 'lucide-react'
import { GAMES_CATALOG } from '../games.data'
import type { GameCatalogItem, GamesCatalogFilter } from '../games.types'
import {
  filterGamesCatalog,
  getAvailableGames,
  getGamePath
} from '../games.selectors'
import { GameFilters } from './GameFilters'
import { GameGrid } from './GameGrid'
import { GamesCatalogHero } from './GamesCatalogHero'

const GamesCatalog: React.FC = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<GamesCatalogFilter>('Todos')
  const playableGames = getAvailableGames(GAMES_CATALOG)

  const filteredGames = useMemo(() => {
    return filterGamesCatalog(GAMES_CATALOG, activeCategory, query)
  }, [activeCategory, query])

  const openGame = (game: GameCatalogItem) => {
    const path = getGamePath(game)
    if (path) navigate(path)
  }

  const playRandom = () => {
    const nextGame = playableGames[Math.floor(Math.random() * playableGames.length)]
    if (nextGame) openGame(nextGame)
  }

  return (
    <div className="game-library-page">
      <nav className="game-library-nav" aria-label="Navegacao da biblioteca">
        <Link className="game-library-back" to="/">
          <ArrowLeft size={18} />
          Inicio
        </Link>
        <div className="game-library-brand">
          <span>Playzenha</span>
          <strong>Biblioteca</strong>
        </div>
        <button className="game-library-random compact" type="button" onClick={playRandom}>
          <Dice5 size={18} />
        </button>
      </nav>

      <main className="game-library-shell">
        <GamesCatalogHero playableGames={playableGames} onPlay={openGame} />
        <GameFilters
          activeCategory={activeCategory}
          query={query}
          onCategoryChange={setActiveCategory}
          onQueryChange={setQuery}
          onRandomPlay={playRandom}
        />
        <GameGrid games={filteredGames} onPlay={openGame} />
      </main>
    </div>
  )
}

export default GamesCatalog
