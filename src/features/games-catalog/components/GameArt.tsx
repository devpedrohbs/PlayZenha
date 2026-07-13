import {
  Brain,
  Crown,
  Dice5,
  EyeOff,
  Heart,
  Home,
  Sparkles,
  Star,
  Target,
  Users,
  Zap
} from 'lucide-react'
import type { CSSProperties } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { GameCatalogItem, GameIconName } from '../games.types'

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

export const GameArt = ({ game }: { game: GameCatalogItem }) => {
  const Icon = iconMap[game.icon ?? 'cards']

  return (
    <span
      className="game-library-art"
      style={{ '--art-a': game.colors?.[0] ?? '#0441f2', '--art-b': game.colors?.[1] ?? '#ffc603' } as CSSProperties}
      aria-hidden="true"
    >
      <Icon size={34} />
    </span>
  )
}
