import type { CSSProperties, KeyboardEvent } from 'react'
import type { GameCatalogItem } from '../../games-catalog'
import { formatDuration, formatPlayersRange, getGamePath } from '../../games-catalog'
import { GAME_FILTERS } from '../../../pages/HomePage/model/constants'
import type { GameCategory } from '../../../pages/HomePage/model/models'
import { isActivationKey } from '../../../shared/utils/keyboard'
import { SectionHead } from './SectionHead'

interface FeaturedGamesSectionProps {
  activeFilter: GameCategory
  filteredGames: GameCatalogItem[]
  selectedGame: GameCatalogItem
  onFilterChange: (filter: GameCategory) => void
  onGameSelect: (game: GameCatalogItem) => void
  onGameNavigate: (path: string) => void
}

export const FeaturedGamesSection = ({
  activeFilter,
  filteredGames,
  selectedGame,
  onFilterChange,
  onGameSelect,
  onGameNavigate
}: FeaturedGamesSectionProps) => {
  const handleGameOpen = (game: GameCatalogItem) => {
    const path = getGamePath(game)
    if (path) onGameNavigate(path)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>, game: GameCatalogItem) => {
    if (isActivationKey(event.key)) {
      event.preventDefault()
      handleGameOpen(game)
    }
  }

  return (
    <section className="landing-section reveal" id="jogos">
      <SectionHead eyebrow="Jogos disponiveis" title="Escolha o jogo que salva o role">
        Cards tocaveis, com microinteracao e feedback no mockup. No celular, o usuario entende a variedade sem precisar ler demais.
      </SectionHead>
      <div className="landing-games-shell">
        <div className="landing-filter-row" aria-label="Filtros de jogos">
          {GAME_FILTERS.map(({ value, label }) => (
            <button
              className={`landing-filter-chip ${activeFilter === value ? 'is-active' : ''}`}
              key={value}
              type="button"
              onClick={() => onFilterChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="landing-game-grid">
          {filteredGames.map((game) => (
            <article
              className={`landing-game-card ${selectedGame.id === game.id ? 'is-selected' : ''}`}
              key={game.id}
              style={{ '--card-color': game.colors?.[1] ?? 'var(--brand-blue)' } as CSSProperties}
              role="button"
              tabIndex={0}
              aria-label={`Jogar ${game.name}`}
              onMouseEnter={() => onGameSelect(game)}
              onFocus={() => onGameSelect(game)}
              onClick={() => handleGameOpen(game)}
              onKeyDown={(event) => handleKeyDown(event, game)}
            >
              <span className="landing-card-tag">{game.category} - {formatPlayersRange(game)} jogadores</span>
              <h3>{game.name}</h3>
              <p>{game.shortDescription}</p>
              <span className="landing-card-play">Jogar - {formatDuration(game)}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
