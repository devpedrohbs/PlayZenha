import { GAMES_PAGE_FILTERS } from '../games.constants'
import type { GamesCatalogFilter } from '../games.types'

interface CategoryChipsProps {
  activeCategory: GamesCatalogFilter
  onCategoryChange: (category: GamesCatalogFilter) => void
}

export const CategoryChips = ({ activeCategory, onCategoryChange }: CategoryChipsProps) => (
  <div className="game-library-categories" aria-label="Categorias">
    {GAMES_PAGE_FILTERS.map((category) => (
      <button
        className={`game-library-chip ${activeCategory === category ? 'active' : ''}`}
        key={category}
        type="button"
        onClick={() => onCategoryChange(category)}
      >
        {category}
      </button>
    ))}
  </div>
)
