import type { GameCatalogItem } from '../games.types'
import { EmptyGamesState } from './EmptyGamesState'
import { GameCard } from './GameCard'

interface GameGridProps {
  games: GameCatalogItem[]
  onPlay: (game: GameCatalogItem) => void
}

export const GameGrid = ({ games, onPlay }: GameGridProps) => (
  <section className="game-library-results" aria-label="Todos os jogos">
    <div className="game-library-section-title">
      <h2>Todos os jogos</h2>
      <p>{games.length} jogos encontrados</p>
    </div>

    {games.length > 0 ? (
      <div className="game-library-grid">
        {games.map((game) => (
          <GameCard game={game} key={game.id} onPlay={onPlay} />
        ))}
      </div>
    ) : (
      <EmptyGamesState />
    )}
  </section>
)
