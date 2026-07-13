import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  interactive?: boolean
  tone?: 'default' | 'accent' | 'success' | 'danger'
  as?: 'div' | 'section' | 'article'
}

const toneClasses: Record<NonNullable<CardProps['tone']>, string> = {
  default: '',
  accent: 'border-playzenha-yellow/40 bg-playzenha-yellow/10',
  success: 'border-success-green/30 bg-success-green/10',
  danger: 'border-danger-red/30 bg-danger-red/10'
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  children,
  className = '',
  interactive = false,
  tone = 'default',
  as: Component = 'div',
  ...props
}, ref) => {
  return (
    <Component
      ref={ref}
      className={[
        'premium-card relative overflow-hidden p-5 sm:p-6',
        toneClasses[tone],
        interactive ? 'transition-all duration-300 hover:-translate-y-1 hover:bg-playzenha-hover/80 hover:border-playzenha-yellow/40' : '',
        className
      ].join(' ')}
      {...props}
    >
      {children}
    </Component>
  )
})

Card.displayName = 'Card'

export default Card
