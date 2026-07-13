import React from 'react'
import { ArrowRight, Check, Gamepad2, Play, RotateCcw } from 'lucide-react'
import GameButton from './GameButton'

type GameAction = 'start' | 'backToGames' | 'restart' | 'next' | 'confirm'
type GameActionTheme = 'blue' | 'purple' | 'green' | 'yellow'

interface GameActionButtonProps {
  action: GameAction
  theme: GameActionTheme
  onClick?: () => void
  disabled?: boolean
  children?: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const actionConfig: Record<GameAction, { label: string; icon: React.ReactNode; variant?: 'primary' | 'secondary' }> = {
  start: { label: 'COMEÇAR', icon: <Play className="h-5 w-5" /> },
  backToGames: { label: 'VOLTAR AOS JOGOS', icon: <Gamepad2 className="h-5 w-5" />, variant: 'secondary' },
  restart: { label: 'JOGAR NOVAMENTE', icon: <RotateCcw className="h-5 w-5" />, variant: 'secondary' },
  next: { label: 'CONTINUAR', icon: <ArrowRight className="h-5 w-5" /> },
  confirm: { label: 'CONFIRMAR', icon: <Check className="h-5 w-5" /> }
}

const GameActionButton: React.FC<GameActionButtonProps> = ({
  action,
  theme,
  onClick,
  disabled = false,
  children,
  className = '',
  size = 'lg'
}) => {
  const config = actionConfig[action]

  return (
    <GameButton
      theme={theme}
      variant={config.variant ?? 'primary'}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 text-lg ${className}`}
    >
      {config.icon}
      {children ?? config.label}
    </GameButton>
  )
}

export default GameActionButton
