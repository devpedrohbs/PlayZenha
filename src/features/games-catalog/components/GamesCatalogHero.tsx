import { formatPlayersRange } from '../games.selectors'
import type { GameCatalogItem } from '../games.types'
import { GameArt } from './GameArt'

interface GamesCatalogHeroProps {
  playableGames: GameCatalogItem[]
  onPlay: (game: GameCatalogItem) => void
}

export const GamesCatalogHero = ({ playableGames, onPlay }: GamesCatalogHeroProps) => (
  <section className="game-library-hero">
    <div>
      <p className="game-library-eyebrow">Playzenha jogos</p>
      <h1>Biblioteca de Jogos</h1>
      <p>
        Encontre rapido o jogo certo para o clima da galera. Os jogos disponiveis ja abrem direto; os outros ficam marcados como em breve.
      </p>
    </div>
    <div className="game-library-feature-stack" aria-label="Jogos disponiveis em destaque">
      {playableGames.slice(0, 3).map((game) => (
        <button className="game-library-feature-tile" key={game.id} type="button" onClick={() => onPlay(game)}>
          <GameArt game={game} />
          <span>
            <strong>{game.name}</strong>
            <small>{game.category} - {formatPlayersRange(game)} jogadores</small>
          </span>
        </button>
      ))}
    </div>
  </section>
)
