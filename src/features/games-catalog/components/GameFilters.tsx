import { Dice5 } from 'lucide-react'
import { Button } from '../../../shared/components/ui'
import type { GamesCatalogFilter } from '../games.types'
import { CategoryChips } from './CategoryChips'
import { GameSearch } from './GameSearch'

interface GameFiltersProps {
  activeCategory: GamesCatalogFilter
  query: string
  onCategoryChange: (category: GamesCatalogFilter) => void
  onQueryChange: (query: string) => void
  onRandomPlay: () => void
}

export const GameFilters = ({
  activeCategory,
  query,
  onCategoryChange,
  onQueryChange,
  onRandomPlay
}: GameFiltersProps) => (
  <section className="game-library-controls" aria-label="Busca e filtros">
    <GameSearch query={query} onQueryChange={onQueryChange} />
    <Button className="game-library-random" type="button" variant="secondary" onClick={onRandomPlay}>
      <Dice5 size={19} />
      Jogo aleatorio
    </Button>
    <CategoryChips activeCategory={activeCategory} onCategoryChange={onCategoryChange} />
  </section>
)
