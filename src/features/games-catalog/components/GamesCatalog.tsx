import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Dice5 } from 'lucide-react'
import { AsyncContentState, Button } from '../../../shared/components/ui'
import type { GameCatalogItem, GamesCatalogFilter } from '../games.types'
import { useGamesCatalog } from '../use-games-catalog'
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
  const { data: games, error, isLoading, reload } = useGamesCatalog()
  const playableGames = getAvailableGames(games)

  const filteredGames = useMemo(() => {
    return filterGamesCatalog(games, activeCategory, query)
  }, [activeCategory, games, query])

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
        <Button className="game-library-random compact" type="button" size="sm" variant="secondary" onClick={playRandom}>
          <Dice5 size={18} />
        </Button>
      </nav>

      <main className="game-library-shell">
        <GamesCatalogHero playableGames={playableGames} onPlay={openGame} />
        {!isLoading && !error && games.length > 0 && (
          <GameFilters
            activeCategory={activeCategory}
            query={query}
            onCategoryChange={setActiveCategory}
            onQueryChange={setQuery}
            onRandomPlay={playRandom}
          />
        )}
        {isLoading ? (
          <AsyncContentState
            className="game-library-data-state"
            title="Carregando jogos"
            description="Buscando o catalogo mais recente no PlayZenha."
            isLoading
          />
        ) : error ? (
          <AsyncContentState
            className="game-library-data-state"
            title="Nao foi possivel carregar os jogos"
            description={error}
            onRetry={reload}
          />
        ) : games.length === 0 ? (
          <AsyncContentState
            className="game-library-data-state"
            title="Catalogo vazio"
            description="Nenhum jogo foi cadastrado no banco de dados ainda."
            onRetry={reload}
          />
        ) : (
          <GameGrid games={filteredGames} onPlay={openGame} />
        )}
      </main>
    </div>
  )
}

export default GamesCatalog
