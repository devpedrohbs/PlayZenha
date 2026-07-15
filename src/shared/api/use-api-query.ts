import { useCallback, useEffect, useState } from 'react'
import { ApiError } from './api-error'

export interface ApiQueryResult<TData> {
  data: TData
  error: string | null
  isLoading: boolean
  reload: () => void
}

type ApiQuery<TData> = (signal: AbortSignal) => Promise<TData>

const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError && error.kind === 'network') {
    return 'Nao foi possivel conectar com a API. Confira se o backend esta em execucao.'
  }

  if (error instanceof Error && error.message) return error.message

  return 'Nao foi possivel carregar os dados. Tente novamente.'
}

export const useApiQuery = <TData>(
  query: ApiQuery<TData>,
  initialData: TData
): ApiQueryResult<TData> => {
  const [data, setData] = useState(initialData)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [requestVersion, setRequestVersion] = useState(0)

  const reload = useCallback(() => {
    setRequestVersion((version) => version + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    setIsLoading(true)
    setError(null)

    query(controller.signal)
      .then((nextData) => {
        if (!controller.signal.aborted) setData(nextData)
      })
      .catch((queryError: unknown) => {
        if (!controller.signal.aborted) setError(getErrorMessage(queryError))
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [query, requestVersion])

  return { data, error, isLoading, reload }
}
