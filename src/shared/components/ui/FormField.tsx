import React from 'react'

interface FormFieldProps {
  label?: string
  htmlFor?: string
  error?: string
  hint?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  hint,
  required = false,
  children,
  className = ''
}) => (
  <div className={`space-y-2 ${className}`}>
    {label && (
      <label htmlFor={htmlFor} className="ml-1 block text-xs font-bold uppercase tracking-wide text-playzenha-muted">
        {label}
        {required && <span className="ml-1 text-playzenha-yellow" aria-hidden="true">*</span>}
      </label>
    )}
    {children}
    {(error || hint) && (
      <p className={`ml-1 text-xs font-medium ${error ? 'text-red-300' : 'text-playzenha-muted'}`}>
        {error || hint}
      </p>
    )}
  </div>
)

export default FormField
