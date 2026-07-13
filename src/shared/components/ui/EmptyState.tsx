import React from 'react'
import { SearchX } from 'lucide-react'
import Button from './Button'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
  className?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className = ''
}) => (
  <div className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center ${className}`}>
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-playzenha-blue/15 text-playzenha-yellow">
      {icon ?? <SearchX className="h-7 w-7" />}
    </div>
    <h3 className="font-fredoka text-2xl font-black text-white">{title}</h3>
    {description && <p className="mt-2 max-w-md text-sm text-playzenha-muted">{description}</p>}
    {actionLabel && onAction && (
      <Button className="mt-5" size="sm" variant="secondary" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
)

export default EmptyState
