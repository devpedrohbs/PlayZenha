import React from 'react'
import Button from '../../../shared/components/ui/Button'

interface GameIconButtonProps {
  label: string
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

const GameIconButton: React.FC<GameIconButtonProps> = ({
  label,
  children,
  onClick,
  className = '',
  disabled = false
}) => (
  <Button
    aria-label={label}
    className={`h-10 w-10 rounded-full p-0 ${className}`}
    disabled={disabled}
    onClick={onClick}
    size="sm"
    type="button"
    variant="ghost"
  >
    {children}
  </Button>
)

export default GameIconButton
