import React from 'react'
import { Gamepad2, LayoutDashboard } from 'lucide-react'
import Button from './Button'

interface NavbarProps {
  onLogin: () => void
  onExploreGames: () => void
  onDashboard: () => void
}

const Navbar: React.FC<NavbarProps> = ({ onLogin, onExploreGames, onDashboard }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-dark-bg/80 backdrop-blur-xl">
      <nav className="section-container flex min-h-20 items-center justify-between gap-4">
        <button type="button" className="flex items-center gap-3 text-left" onClick={onExploreGames}>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-playzenha-yellow text-dark-bg shadow-lg shadow-playzenha-yellow/20">
            <Gamepad2 className="h-6 w-6" />
          </span>
          <span>
            <span className="block font-fredoka text-2xl leading-none text-white">PlayZenha</span>
            <span className="hidden text-xs font-bold uppercase tracking-wide text-playzenha-muted sm:block">Party games premium</span>
          </span>
        </button>

        <div className="hidden items-center gap-6 md:flex">
          <button type="button" onClick={onExploreGames} className="text-sm font-bold text-playzenha-muted transition-colors hover:text-white">
            Jogos
          </button>
          <button type="button" onClick={onDashboard} className="inline-flex items-center gap-2 text-sm font-bold text-playzenha-muted transition-colors hover:text-white">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onLogin} className="hidden sm:inline-flex">
            Entrar
          </Button>
          <Button size="sm" onClick={onExploreGames}>
            Começar
          </Button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
