import { RefreshCw } from 'lucide-react'
import Button from './Button'
import Spinner from './Spinner'

interface AsyncContentStateProps {
  title: string
  description: string
  isLoading?: boolean
  onRetry?: () => void
  className?: string
}

const AsyncContentState = ({
  title,
  description,
  isLoading = false,
  onRetry,
  className = ''
}: AsyncContentStateProps) => (
  <div className={`async-content-state ${className}`} role={isLoading ? 'status' : 'alert'}>
    {isLoading ? <Spinner size="lg" tone="dark" label={title} /> : <RefreshCw aria-hidden="true" size={30} />}
    <strong>{title}</strong>
    <p>{description}</p>
    {!isLoading && onRetry && (
      <Button type="button" size="sm" variant="secondary" onClick={onRetry}>
        Tentar novamente
      </Button>
    )}
  </div>
)

export default AsyncContentState
