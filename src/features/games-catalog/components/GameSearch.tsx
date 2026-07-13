import { Search } from 'lucide-react'

interface GameSearchProps {
  query: string
  onQueryChange: (query: string) => void
}

export const GameSearch = ({ query, onQueryChange }: GameSearchProps) => (
  <label className="game-library-search">
    <Search size={22} />
    <input
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
      type="search"
      placeholder="Buscar por Impostor, festa, IA, casal..."
      autoComplete="off"
    />
  </label>
)
