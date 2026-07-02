import React from 'react'
import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-playzenha-yellow text-dark-bg shadow-playzenha-yellow/20 hover:bg-yellow-300',
  secondary: 'bg-playzenha-blue text-white shadow-playzenha-blue/25 hover:bg-blue-600',
  ghost: 'bg-white/5 text-white border border-white/10 hover:bg-playzenha-hover',
  danger: 'bg-danger-red text-white shadow-danger-red/20 hover:bg-red-500'
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-4 text-sm',
  md: 'min-h-12 px-5 text-sm',
  lg: 'min-h-14 px-7 text-base'
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <motion.button
      type="button"
      whileHover={disabled ? undefined : { y: -2, scale: 1.02 }}
      whileTap={disabled ? undefined : { y: 1, scale: 0.98 }}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-2xl font-fredoka font-bold uppercase tracking-wide shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-playzenha-yellow/70 focus:ring-offset-2 focus:ring-offset-dark-bg',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className
      ].join(' ')}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button
