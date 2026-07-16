import { Clock, Lock, Play, Users } from 'lucide-react'
import { Badge, Button } from '../../../shared/components/ui'
import type { GameCatalogItem } from '../games.types'
import {
  formatDuration,
  formatPlayersRange,
  mapDifficultyLabel
} from '../games.selectors'
import { GameArt } from './GameArt'
import GameRulesCard from '../../../games/shared/components/GameRulesCard'
import { getGameRules } from '../../../games/shared/game-rules'

interface GameCardProps {
  game: GameCatalogItem
  onPlay: (game: GameCatalogItem) => void
}

export const GameCard = ({ game, onPlay }: GameCardProps) => {
  const rules = getGameRules(game.slug)

  return <article className={`game-library-card ${game.status === 'available' ? 'available' : 'locked'}`}>
    <GameArt game={game} />
    <div className="game-library-card-top">
      <span>{game.category}</span>
      {game.status === 'available' ? (
        <Badge className="game-library-status ready" variant="success">Disponivel</Badge>
      ) : (
        <Badge className="game-library-status soon" variant="muted">Em breve</Badge>
      )}
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
    <div className="game-library-card-actions">
      {rules && game.status === 'available' && <GameRulesCard {...rules} triggerLabel="Regras" />}
      <Button
        className="game-library-play"
        type="button"
        fullWidth
        variant={game.status === 'available' ? 'secondary' : 'ghost'}
        disabled={game.status !== 'available'}
        onClick={() => onPlay(game)}
      >
        {game.status === 'available' ? <><Play size={17} /> Jogar</> : <><Lock size={17} /> Em breve</>}
      </Button>
    </div>
  </article>
}
