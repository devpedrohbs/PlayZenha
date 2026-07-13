import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Brain,
  Clock,
  Crown,
  Dice5,
  EyeOff,
  Heart,
  Home,
  Lock,
  Play,
  Search,
  Sparkles,
  Star,
  Target,
  Users,
  Zap
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { GAMES_PAGE_FILTERS } from '../games.constants'
import { GAMES_CATALOG } from '../games.data'
import type { GameCatalogItem, GameIconName, GamesCatalogFilter } from '../games.types'
import {
  filterGamesCatalog,
  formatDuration,
  formatPlayersRange,
  getAvailableGames,
  getGamePath,
  mapDifficultyLabel
} from '../games.selectors'

const iconMap: Record<GameIconName, LucideIcon> = {
  mask: EyeOff,
  cards: Crown,
  users: Users,
  spark: Sparkles,
  bolt: Zap,
  heart: Heart,
  home: Home,
  target: Target,
  party: Dice5,
  brain: Brain,
  star: Star
}

const GameLibraryPage: React.FC = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<GamesCatalogFilter>('Todos')
  const playableGames = getAvailableGames(GAMES_CATALOG)

  const filteredGames = useMemo(() => {
    return filterGamesCatalog(GAMES_CATALOG, activeCategory, query)
  }, [activeCategory, query])

  const playRandom = () => {
    const nextGame = playableGames[Math.floor(Math.random() * playableGames.length)]
    const path = getGamePath(nextGame)
    if (path) navigate(path)
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
              <button className="game-library-feature-tile" key={game.id} type="button" onClick={() => {
                const path = getGamePath(game)
                if (path) navigate(path)
              }}>
                <GameArt game={game} />
                <span>
                  <strong>{game.name}</strong>
                  <small>{game.category} - {formatPlayersRange(game)} jogadores</small>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="game-library-controls" aria-label="Busca e filtros">
          <label className="game-library-search">
            <Search size={22} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="Buscar por Impostor, festa, IA, casal..."
              autoComplete="off"
            />
          </label>
          <button className="game-library-random" type="button" onClick={playRandom}>
            <Dice5 size={19} />
            Jogo aleatorio
          </button>
          <div className="game-library-categories" aria-label="Categorias">
            {GAMES_PAGE_FILTERS.map((category) => (
              <button
                className={`game-library-chip ${activeCategory === category ? 'active' : ''}`}
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="game-library-results" aria-label="Todos os jogos">
          <div className="game-library-section-title">
            <h2>Todos os jogos</h2>
            <p>{filteredGames.length} jogos encontrados</p>
          </div>

          {filteredGames.length > 0 ? (
            <div className="game-library-grid">
              {filteredGames.map((game) => (
                <article className={`game-library-card ${game.status === 'available' ? 'available' : 'locked'}`} key={game.id}>
                  <GameArt game={game} />
                  <div className="game-library-card-top">
                    <span>{game.category}</span>
                    {game.status === 'available' ? <span className="game-library-status ready">Disponivel</span> : <span className="game-library-status soon">Em breve</span>}
                  </div>
                  <h3>{game.name}</h3>
                  <p>{game.shortDescription}</p>
                  <div className="game-library-meta">
                    <span><Users size={14} /> {formatPlayersRange(game)}</span>
                    <span><Clock size={14} /> {formatDuration(game)}</span>
                    <span>{mapDifficultyLabel(game)}</span>
                  </div>
                  <div className="game-library-tags">
                    {game.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <button
                    className="game-library-play"
                    type="button"
                    disabled={game.status !== 'available'}
                    onClick={() => {
                      const path = getGamePath(game)
                      if (path) navigate(path)
                    }}
                  >
                    {game.status === 'available' ? <><Play size={17} /> Jogar</> : <><Lock size={17} /> Em breve</>}
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="game-library-empty">Nenhum jogo encontrado com essa busca. Tente uma palavra mais geral.</div>
          )}
        </section>
      </main>
    </div>
  )
}

const GameArt = ({ game }: { game: GameCatalogItem }) => {
  const Icon = iconMap[(game.icon ?? 'cards') as GameIconName]
  return (
    <span
      className="game-library-art"
      style={{ '--art-a': game.colors?.[0] ?? '#0441f2', '--art-b': game.colors?.[1] ?? '#ffc603' } as React.CSSProperties}
      aria-hidden="true"
    >
      <Icon size={34} />
    </span>
  )
}

export default GameLibraryPage
