import React from 'react'

type SpinnerSize = 'sm' | 'md' | 'lg'
type SpinnerTone = 'light' | 'dark' | 'brand'

interface SpinnerProps {
  size?: SpinnerSize
  tone?: SpinnerTone
  label?: string
  className?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]'
}

const toneClasses: Record<SpinnerTone, string> = {
  light: 'border-white/30 border-t-white',
  dark: 'border-dark-bg/30 border-t-dark-bg',
  brand: 'border-playzenha-blue/20 border-t-playzenha-yellow'
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  tone = 'brand',
  label = 'Carregando',
  className = ''
}) => (
  <span
    className={`inline-block shrink-0 animate-spin rounded-full ${sizeClasses[size]} ${toneClasses[tone]} ${className}`}
    role="status"
    aria-label={label}
  />
)

export default Spinner
