import { Search } from 'lucide-react'
import { Input } from '../../../shared/components/ui'

interface GameSearchProps {
  query: string
  onQueryChange: (query: string) => void
}

export const GameSearch = ({ query, onQueryChange }: GameSearchProps) => (
  <div className="game-library-search">
    <Search size={22} />
    <Input
      containerClassName="w-full"
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
      type="search"
      placeholder="Buscar por Impostor, festa, IA, casal..."
      autoComplete="off"
    />
  </div>
)
