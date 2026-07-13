import { useEffect, useMemo, useRef, useState } from 'react'
import {
  QUEM_SOU_EU_INITIAL_COUNTDOWN,
  QUEM_SOU_EU_MAX_PLAYERS,
  SILENT_WAV
} from '../domain/quemSouEu.constants'
import {
  createQuemSouEuAssignments,
  createQuemSouEuPlayers,
  createQuemSouEuRoundResult,
  normalizeQuemSouEuCharacter,
  shuffleArray,
  validateQuemSouEuPlayerNames
} from '../domain/quemSouEu.rules'
import {
  selectBestPlayers,
  selectBestTime,
  selectCanStartWritingPhase,
  selectCurrentAssignment,
  selectCurrentGuesser,
  selectCurrentTarget,
  selectCurrentWriter,
  selectOrderedResults
} from '../domain/quemSouEu.selectors'
import type {
  QuemSouEuAssignment,
  QuemSouEuPhase,
  QuemSouEuPlayer,
  QuemSouEuRoundResult,
  QuemSouEuRoundStatus
} from '../domain/quemSouEu.types'

interface WakeLockSentinelLike {
  release: () => Promise<void>
}

type WakeLockNavigator = {
  wakeLock?: {
    request: (type: 'screen') => Promise<WakeLockSentinelLike>
  }
}

export const useQuemSouEuGame = () => {
  const [phase, setPhase] = useState<QuemSouEuPhase>('setup')
  const [playerNames, setPlayerNames] = useState<string[]>(['', ''])
  const [players, setPlayers] = useState<QuemSouEuPlayer[]>([])
  const [assignments, setAssignments] = useState<QuemSouEuAssignment[]>([])
  const [writingOrder, setWritingOrder] = useState<number[]>([])
  const [writingStep, setWritingStep] = useState(0)
  const [currentCharacterInput, setCurrentCharacterInput] = useState('')
  const [guessOrder, setGuessOrder] = useState<number[]>([])
  const [guessStep, setGuessStep] = useState(0)
  const [countdown, setCountdown] = useState(QUEM_SOU_EU_INITIAL_COUNTDOWN)
  const [resumeCountdown, setResumeCountdown] = useState<number | null>(null)
  const [isScreenMasked, setIsScreenMasked] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [pendingAction, setPendingAction] = useState<QuemSouEuRoundStatus | null>(null)
  const [results, setResults] = useState<QuemSouEuRoundResult[]>([])
  const [lastRoundResult, setLastRoundResult] = useState<QuemSouEuRoundResult | null>(null)

  const wakeLockRef = useRef<WakeLockSentinelLike | null>(null)
  const fallbackAudioRef = useRef<HTMLAudioElement | null>(null)
  const fallbackTickRef = useRef<number | null>(null)

  const currentWriter = useMemo(
    () => selectCurrentWriter(players, writingOrder, writingStep),
    [players, writingOrder, writingStep]
  )

  const currentGuesser = useMemo(
    () => selectCurrentGuesser(players, guessOrder, guessStep),
    [players, guessOrder, guessStep]
  )

  const currentAssignment = useMemo(
    () => selectCurrentAssignment(assignments, currentGuesser),
    [assignments, currentGuesser]
  )

  const currentTarget = useMemo(
    () => selectCurrentTarget(assignments, currentWriter, players),
    [assignments, currentWriter, players]
  )

  const bestTime = useMemo(() => selectBestTime(results), [results])
  const bestPlayers = useMemo(() => selectBestPlayers(results, bestTime), [results, bestTime])
  const orderedResults = useMemo(() => selectOrderedResults(results), [results])
  const canStartWritingPhase = selectCanStartWritingPhase(playerNames)

  const addPlayerSlot = () => {
    if (playerNames.length < QUEM_SOU_EU_MAX_PLAYERS) setPlayerNames([...playerNames, ''])
  }

  const removePlayerSlot = (index: number) => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.filter((_, itemIndex) => itemIndex !== index))
      return
    }

    setPlayerNames(playerNames.map((name, itemIndex) => (itemIndex === index ? '' : name)))
  }

  const updatePlayerName = (index: number, value: string) => {
    setPlayerNames(playerNames.map((name, itemIndex) => (itemIndex === index ? value : name)))
  }

  const startWritingPhase = () => {
    const validationError = validateQuemSouEuPlayerNames(playerNames)
    if (validationError) {
      alert(validationError)
      return
    }

    const nextPlayers = createQuemSouEuPlayers(playerNames)
    const generatedAssignments = createQuemSouEuAssignments(nextPlayers)
    const playerIds = nextPlayers.map((player) => player.id)

    setPlayers(nextPlayers)
    setAssignments(generatedAssignments)
    setWritingOrder(shuffleArray(playerIds))
    setWritingStep(0)
    setCurrentCharacterInput('')
    setGuessOrder([])
    setGuessStep(0)
    setResults([])
    setLastRoundResult(null)
    setIsScreenMasked(false)
    setPhase('writing-pass')
  }

  const confirmCharacter = () => {
    const value = normalizeQuemSouEuCharacter(currentCharacterInput)
    if (!value || !currentWriter) {
      alert('Digite um personagem para continuar.')
      return
    }

    setAssignments((previousAssignments) =>
      previousAssignments.map((item) =>
        item.writerId === currentWriter.id
          ? { ...item, character: value }
          : item
      )
    )

    if (writingStep < writingOrder.length - 1) {
      setWritingStep((previousStep) => previousStep + 1)
      setCurrentCharacterInput('')
      setPhase('writing-pass')
      return
    }

    setGuessOrder(shuffleArray(players.map((player) => player.id)))
    setGuessStep(0)
    setCurrentCharacterInput('')
    setPhase('round-intro')
  }

  const startRoundCountdown = () => {
    setCountdown(QUEM_SOU_EU_INITIAL_COUNTDOWN)
    setIsScreenMasked(false)
    setPhase('countdown')
  }

  const finishRound = (status: QuemSouEuRoundStatus) => {
    if (!currentGuesser || !currentAssignment) return

    const roundResult = createQuemSouEuRoundResult(
      currentGuesser.id,
      status,
      timeLeft,
      currentAssignment.character
    )

    setResults((previousResults) => [...previousResults, roundResult])
    setLastRoundResult(roundResult)
    setPendingAction(null)
    setResumeCountdown(null)
    setIsScreenMasked(false)
    setPhase('round-result')
  }

  const nextRoundOrFinal = () => {
    const isLast = guessStep >= guessOrder.length - 1
    if (isLast) {
      setPhase('final-results')
      return
    }

    setGuessStep((previousStep) => previousStep + 1)
    setTimeLeft(0)
    setPendingAction(null)
    setResumeCountdown(null)
    setIsScreenMasked(false)
    setPhase('round-intro')
  }

  const resetGame = () => {
    setPhase('setup')
    setPlayers([])
    setAssignments([])
    setWritingOrder([])
    setWritingStep(0)
    setCurrentCharacterInput('')
    setGuessOrder([])
    setGuessStep(0)
    setCountdown(QUEM_SOU_EU_INITIAL_COUNTDOWN)
    setResumeCountdown(null)
    setTimeLeft(0)
    setPendingAction(null)
    setIsScreenMasked(false)
    setResults([])
    setLastRoundResult(null)
  }

  const requestWakeLock = async () => {
    try {
      const wakeLockNavigator = navigator as unknown as WakeLockNavigator
      if (wakeLockNavigator.wakeLock?.request) {
        wakeLockRef.current = await wakeLockNavigator.wakeLock.request('screen')
      }
    } catch {
      wakeLockRef.current = null
    }

    if (!wakeLockRef.current) {
      if (!fallbackAudioRef.current) {
        fallbackAudioRef.current = new Audio(SILENT_WAV)
        fallbackAudioRef.current.loop = true
        fallbackAudioRef.current.volume = 0.01
      }

      const keepPlaying = () => {
        fallbackAudioRef.current?.play().catch(() => undefined)
      }

      keepPlaying()
      fallbackTickRef.current = window.setInterval(keepPlaying, 15000)
    }
  }

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release()
      } catch {
        // noop
      }
      wakeLockRef.current = null
    }

    if (fallbackTickRef.current) {
      window.clearInterval(fallbackTickRef.current)
      fallbackTickRef.current = null
    }

    if (fallbackAudioRef.current) {
      fallbackAudioRef.current.pause()
      fallbackAudioRef.current.currentTime = 0
    }
  }

  useEffect(() => {
    if (phase !== 'countdown') return undefined

    const interval = window.setInterval(() => {
      setCountdown((previousCountdown) => {
        if (previousCountdown <= 1) {
          window.clearInterval(interval)
          setTimeLeft(0)
          setPhase('guessing')
          return 0
        }
        return previousCountdown - 1
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [phase])

  useEffect(() => {
    if (phase !== 'guessing') return undefined
    if (pendingAction) return undefined
    if (resumeCountdown !== null) return undefined

    const interval = window.setInterval(() => {
      setTimeLeft((previousTime) => previousTime + 1)
    }, 1000)

    return () => window.clearInterval(interval)
  }, [phase, pendingAction, resumeCountdown])

  useEffect(() => {
    if (phase !== 'guessing') return undefined

    requestWakeLock()

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && !wakeLockRef.current) {
        requestWakeLock()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      releaseWakeLock()
    }
  }, [phase])

  useEffect(() => {
    if (resumeCountdown === null) return undefined

    const interval = window.setInterval(() => {
      setResumeCountdown((previousCountdown) => {
        if (previousCountdown === null) return null
        if (previousCountdown <= 1) {
          window.clearInterval(interval)
          return null
        }
        return previousCountdown - 1
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [resumeCountdown])

  useEffect(() => {
    if (phase === 'guessing' && pendingAction === null && resumeCountdown === null) {
      setIsScreenMasked(false)
    }
  }, [phase, pendingAction, resumeCountdown])

  return {
    addPlayerSlot,
    bestPlayers,
    bestTime,
    canStartWritingPhase,
    confirmCharacter,
    countdown,
    currentAssignment,
    currentCharacterInput,
    currentGuesser,
    currentTarget,
    currentWriter,
    finishRound,
    guessOrder,
    guessStep,
    isScreenMasked,
    lastRoundResult,
    nextRoundOrFinal,
    orderedResults,
    pendingAction,
    phase,
    playerNames,
    players,
    removePlayerSlot,
    resetGame,
    results,
    resumeCountdown,
    setCurrentCharacterInput,
    setIsScreenMasked,
    setPendingAction,
    setResumeCountdown,
    showWritingTarget: () => setPhase('writing-reveal'),
    startRoundCountdown,
    startWritingPhase,
    timeLeft,
    updatePlayerName,
    writingOrder,
    writingStep
  }
}
