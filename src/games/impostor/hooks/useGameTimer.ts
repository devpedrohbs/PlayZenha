import { useEffect } from 'react'

interface UseGameTimerInput {
  isRunning: boolean
  timeLeft: number
  onTick: () => void
  onComplete: () => void
}

export const useGameTimer = ({
  isRunning,
  timeLeft,
  onTick,
  onComplete
}: UseGameTimerInput) => {
  useEffect(() => {
    if (!isRunning) return undefined

    if (timeLeft <= 0) {
      onComplete()
      return undefined
    }

    const interval = window.setInterval(onTick, 1000)
    return () => window.clearInterval(interval)
  }, [isRunning, onComplete, onTick, timeLeft])
}
