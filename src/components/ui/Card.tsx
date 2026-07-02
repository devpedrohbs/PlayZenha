import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  interactive?: boolean
}

const Card: React.FC<CardProps> = ({ children, className = '', interactive = false }) => {
  return (
    <div
      className={[
        'premium-card relative overflow-hidden p-5 sm:p-6',
        interactive ? 'transition-all duration-300 hover:-translate-y-1 hover:bg-playzenha-hover/80 hover:border-playzenha-yellow/40' : '',
        className
      ].join(' ')}
    >
      {children}
    </div>
  )
}

export default Card
