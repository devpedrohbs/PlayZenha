import type { CSSProperties } from 'react'
import type { GameCatalogItem } from '../../games-catalog'
import { formatDuration, formatPlayersRange, getGamePath } from '../../games-catalog'
import { GAME_FILTERS } from '../../../pages/HomePage/model/constants'
import type { GameCategory } from '../../../pages/HomePage/model/models'
import { AsyncContentState } from '../../../shared/components/ui'
import { SectionHead } from './SectionHead'
import GameRulesCard from '../../../games/shared/components/GameRulesCard'
import { getGameRules } from '../../../games/shared/game-rules'

interface FeaturedGamesSectionProps {
  activeFilter: GameCategory
  filteredGames: GameCatalogItem[]
  selectedGame?: GameCatalogItem
  error: string | null
  isLoading: boolean
  onFilterChange: (filter: GameCategory) => void
  onGameSelect: (game: GameCatalogItem) => void
  onGameNavigate: (path: string) => void
  onRetry: () => void
}

export const FeaturedGamesSection = ({
  activeFilter,
  error,
  filteredGames,
  isLoading,
  selectedGame,
  onFilterChange,
  onGameSelect,
  onGameNavigate,
  onRetry
}: FeaturedGamesSectionProps) => {
  const handleGameOpen = (game: GameCatalogItem) => {
    const path = getGamePath(game)
    if (path) onGameNavigate(path)
  }

  return (
    <section className="landing-section reveal" id="jogos">
      <SectionHead eyebrow="Jogos disponiveis" title="Escolha o jogo que salva o role">
        Veja quantas pessoas jogam, quanto dura e qual combina com o momento. O Impostor e gratis; os outros jogos disponiveis entram no Premium.
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
        {isLoading ? (
          <AsyncContentState
            className="landing-data-state"
            title="Carregando jogos"
            description="Buscando os jogos disponiveis na API."
            isLoading
          />
        ) : error ? (
          <AsyncContentState
            className="landing-data-state"
            title="Nao foi possivel carregar os jogos"
            description={error}
            onRetry={onRetry}
          />
        ) : filteredGames.length === 0 ? (
          <AsyncContentState
            className="landing-data-state"
            title="Nenhum jogo disponivel"
            description="Nao encontramos jogos para este filtro."
          />
        ) : (
          <div className="landing-game-grid">
            {filteredGames.map((game) => {
              const rules = getGameRules(game.slug)
              const gamePath = getGamePath(game)

              return (
                <article
                  className={`landing-game-card ${selectedGame?.id === game.id ? 'is-selected' : ''}`}
                  key={game.id}
                  style={{ '--card-color': game.colors?.[1] ?? 'var(--brand-blue)' } as CSSProperties}
                  onMouseEnter={() => onGameSelect(game)}
                  onFocus={() => onGameSelect(game)}
                >
                  <span className="landing-card-tag">{game.category} - {formatPlayersRange(game)} jogadores</span>
                  <h3>{game.name}</h3>
                  <p>{game.shortDescription}</p>
                  <div className={`landing-card-actions ${rules && gamePath ? '' : 'single'}`}>
                    {rules && gamePath && <GameRulesCard {...rules} triggerLabel="Regras" />}
                    <button
                      className="landing-card-play"
                      type="button"
                      disabled={!gamePath}
                      onClick={() => handleGameOpen(game)}
                    >
                      {gamePath ? `Jogar - ${formatDuration(game)}` : 'Em breve'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
