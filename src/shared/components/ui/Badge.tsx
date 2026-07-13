import React from 'react'

type BadgeVariant = 'primary' | 'accent' | 'muted' | 'success' | 'danger'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-playzenha-blue/20 text-white border-playzenha-blue/40',
  accent: 'bg-playzenha-yellow text-dark-bg border-playzenha-yellow',
  muted: 'bg-white/5 text-playzenha-muted border-white/10',
  success: 'bg-success-green/15 text-green-300 border-success-green/30',
  danger: 'bg-danger-red/15 text-red-300 border-danger-red/30'
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'muted', className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}

export default Badge
