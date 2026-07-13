import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react'

type ToastVariant = 'info' | 'success' | 'error'

interface ToastProps {
  message: string
  visible?: boolean
  variant?: ToastVariant
  className?: string
}

const variantClasses: Record<ToastVariant, string> = {
  info: 'border-playzenha-blue/30 bg-playzenha-surface text-white',
  success: 'border-success-green/30 bg-success-green text-dark-bg',
  error: 'border-danger-red/30 bg-danger-red text-white'
}

const icons: Record<ToastVariant, React.ReactNode> = {
  info: <Info className="h-5 w-5" />,
  success: <CheckCircle2 className="h-5 w-5" />,
  error: <XCircle className="h-5 w-5" />
}

const Toast: React.FC<ToastProps> = ({
  message,
  visible = Boolean(message),
  variant = 'info',
  className = ''
}) => (
  <AnimatePresence>
    {visible && message && (
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        className={`fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold shadow-2xl ${variantClasses[variant]} ${className}`}
        role={variant === 'error' ? 'alert' : 'status'}
        aria-live={variant === 'error' ? 'assertive' : 'polite'}
      >
        {icons[variant] ?? <AlertCircle className="h-5 w-5" />}
        <span className="min-w-0 flex-1">{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
)

export default Toast
