import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Input: React.FC<InputProps> = ({ label, className = '', id, ...props }) => {
  const inputId = id ?? props.name

  return (
    <label className="block space-y-2" htmlFor={inputId}>
      {label && <span className="ml-1 text-xs font-bold uppercase tracking-wide text-playzenha-muted">{label}</span>}
      <input
        id={inputId}
        className={[
          'h-12 w-full rounded-2xl border border-white/10 bg-dark-bg/70 px-4 text-white outline-none transition-colors placeholder:text-playzenha-muted/60 focus:border-playzenha-yellow/70 focus:ring-2 focus:ring-playzenha-yellow/20',
          className
        ].join(' ')}
        {...props}
      />
    </label>
  )
}

export default Input
