import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  success?: boolean
  containerClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  className = '',
  containerClassName = '',
  id,
  error,
  hint,
  success = false,
  disabled,
  ...props
}, ref) => {
  const inputId = id ?? props.name
  const messageId = inputId ? `${inputId}-message` : undefined
  const stateClasses = error
    ? 'border-danger-red/70 focus:border-danger-red focus:ring-danger-red/20'
    : success
      ? 'border-success-green/60 focus:border-success-green focus:ring-success-green/20'
      : 'border-white/10 focus:border-playzenha-yellow/70 focus:ring-playzenha-yellow/20'

  return (
    <label className={`block space-y-2 ${containerClassName}`} htmlFor={inputId}>
      {label && <span className="ml-1 text-xs font-bold uppercase tracking-wide text-playzenha-muted">{label}</span>}
      <input
        ref={ref}
        id={inputId}
        disabled={disabled}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error || hint ? messageId : undefined}
        className={[
          'h-12 w-full rounded-2xl border bg-dark-bg/70 px-4 text-white outline-none transition-colors placeholder:text-playzenha-muted/60 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
          stateClasses,
          className
        ].join(' ')}
        {...props}
      />
      {(error || hint) && (
        <span id={messageId} className={`ml-1 block text-xs font-medium ${error ? 'text-red-300' : 'text-playzenha-muted'}`}>
          {error || hint}
        </span>
      )}
    </label>
  )
})

Input.displayName = 'Input'

export default Input
