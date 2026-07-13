import React from 'react'
import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'
import Spinner from './Spinner'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  loadingText?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-playzenha-yellow text-dark-bg shadow-playzenha-yellow/20 hover:bg-yellow-300',
  secondary: 'bg-playzenha-blue text-white shadow-playzenha-blue/25 hover:bg-blue-600',
  ghost: 'bg-white/5 text-white border border-white/10 hover:bg-playzenha-hover',
  danger: 'bg-danger-red text-white shadow-danger-red/20 hover:bg-red-500',
  success: 'bg-success-green text-dark-bg shadow-success-green/20 hover:bg-green-400'
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-4 text-sm',
  md: 'min-h-12 px-5 text-sm',
  lg: 'min-h-14 px-7 text-base'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  loadingText,
  className = '',
  disabled,
  ...props
}, ref) => {
  const isDisabled = disabled || loading

  return (
    <motion.button
      ref={ref}
      type="button"
      whileHover={isDisabled ? undefined : { y: -2, scale: 1.02 }}
      whileTap={isDisabled ? undefined : { y: 1, scale: 0.98 }}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={[
        'inline-flex min-w-0 items-center justify-center gap-2 rounded-2xl font-fredoka font-bold uppercase tracking-wide shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-playzenha-yellow/70 focus:ring-offset-2 focus:ring-offset-dark-bg',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className
      ].join(' ')}
      {...props}
    >
      {loading && <Spinner size="sm" tone={variant === 'primary' || variant === 'success' ? 'dark' : 'light'} />}
      {loading && loadingText ? <span className="truncate">{loadingText}</span> : children}
    </motion.button>
  )
})

Button.displayName = 'Button'

export default Button
