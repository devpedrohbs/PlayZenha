import { useEffect, useRef, useState } from 'react'
import { ULTIMA_NOITE_DEFAULT_PLAYER_NAMES, ULTIMA_NOITE_MAX_PLAYERS, ULTIMA_NOITE_MIN_PLAYERS } from '../domain/ultimaNoite.constants'
import {
  applyUltimaNoiteDeath,
  findFirstLivingPlayerIndex,
  findNextLivingPlayerIndex,
  resetUltimaNoiteVotes,
  resolveUltimaNoiteNightVictim,
  resolveUltimaNoiteVoting,
  resolveUltimaNoiteWinner
} from '../domain/ultimaNoite.rules'
import type {
  UltimaNoitePhase,
  UltimaNoitePlayer,
  UltimaNoiteRole,
  UltimaNoiteSettings,
  UltimaNoiteVoteSelection,
  UltimaNoiteWinner
} from '../domain/ultimaNoite.types'
import { shuffle } from '../../../shared/utils/shuffle'
import { createId } from '../../../shared/utils/id'

const DEFAULT_DISCUSSION_TIME = 120

export const useUltimaNoiteGame = () => {
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([])
  const [phase, setPhase] = useState<UltimaNoitePhase>('setup')
  const [players, setPlayers] = useState<UltimaNoitePlayer[]>([])
  const [playerNames, setPlayerNames] = useState<string[]>(ULTIMA_NOITE_DEFAULT_PLAYER_NAMES)
  const [mediatorIndex, setMediatorIndex] = useState<number | null>(null)
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0)
  const [wolfKill, setWolfKill] = useState<string | null>(null)
  const [angelSave, setAngelSave] = useState<string | null>(null)
  const [investigatedRole, setInvestigatedRole] = useState<UltimaNoiteRole | null>(null)
  const [discussionTime, setDiscussionTime] = useState(DEFAULT_DISCUSSION_TIME)
  const [timeLeft, setTimeLeft] = useState(0)
  const [winner, setWinner] = useState<UltimaNoiteWinner | null>(null)
  const [selectedVote, setSelectedVote] = useState<UltimaNoiteVoteSelection>(null)
  const [showErrorModal, setShowErrorModal] = useState<string | null>(null)
  const [showMediatorInfo, setShowMediatorInfo] = useState(false)
  const [settings, setSettings] = useState<UltimaNoiteSettings>({
    wolvesCount: 1,
    hasAngel: true,
    hasDetective: true,
    hasMediator: false
  })

  const clearScheduledTimeouts = () => {
    timeoutRefs.current.forEach((timeoutId) => clearTimeout(timeoutId))
    timeoutRefs.current = []
  }

  const scheduleTimeout = (callback: () => void, delay: number) => {
    const timeoutId = setTimeout(() => {
      timeoutRefs.current = timeoutRefs.current.filter((id) => id !== timeoutId)
      callback()
    }, delay)

    timeoutRefs.current.push(timeoutId)
  }

  useEffect(() => () => clearScheduledTimeouts(), [])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (phase === 'discussion' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((previousTime) => previousTime - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [phase, timeLeft])

  useEffect(() => {
    if (phase === 'setup') {
      const timer = setTimeout(() => setShowMediatorInfo(true), 500)
      return () => clearTimeout(timer)
    }

    return undefined
  }, [phase])

  const updatePlayerName = (index: number, value: string) => {
    setPlayerNames(playerNames.map((name, itemIndex) => (itemIndex === index ? value : name)))
  }

  const addPlayerSlot = () => {
    if (playerNames.length < ULTIMA_NOITE_MAX_PLAYERS) setPlayerNames([...playerNames, ''])
  }

  const removePlayerSlot = (index: number) => {
    if (playerNames.length > ULTIMA_NOITE_MIN_PLAYERS) {
      setPlayerNames(playerNames.filter((_, itemIndex) => itemIndex !== index))
      if (mediatorIndex === index) setMediatorIndex(null)
      if (mediatorIndex !== null && mediatorIndex > index) setMediatorIndex(mediatorIndex - 1)
      return
    }

    updatePlayerName(index, '')
    if (mediatorIndex === index) setMediatorIndex(null)
  }

  const startGameSetup = () => {
    clearScheduledTimeouts()

    const activePlayers: UltimaNoitePlayer[] = []
    let assignedMediator: UltimaNoitePlayer | undefined
    let validCount = 0
    const usedNames = new Set<string>()

    for (let index = 0; index < playerNames.length; index++) {
      const rawName = playerNames[index].trim()
      if (!rawName) continue

      const upperName = rawName.toUpperCase()
      if (usedNames.has(upperName)) {
        setShowErrorModal(`O nome "${rawName}" já está em uso!`)
        return
      }

      usedNames.add(upperName)
      validCount++

      const newPlayer: UltimaNoitePlayer = {
        id: createId(),
        name: rawName,
        role: 'Cidadão',
        isAlive: true,
        votes: 0
      }

      if (index === mediatorIndex) {
        newPlayer.role = 'Mediador'
        assignedMediator = newPlayer
      } else {
        activePlayers.push(newPlayer)
      }
    }

    if (!assignedMediator) {
      setShowErrorModal('É obrigatório escolher um MEDIADOR antes de iniciar!')
      scheduleTimeout(() => setShowMediatorInfo(true), 1500)
      return
    }

    if (validCount < ULTIMA_NOITE_MIN_PLAYERS) {
      setShowErrorModal('É necessário no mínimo 6 participantes (incluindo o mediador).')
      return
    }

    setSettings((currentSettings) => ({ ...currentSettings, hasMediator: Boolean(assignedMediator) }))
    let availableRoles: UltimaNoiteRole[] = Array(settings.wolvesCount).fill('Lobo')
    if (settings.hasAngel) availableRoles.push('Anjo')
    if (settings.hasDetective) availableRoles.push('Detetive')

    const remainingSlots = activePlayers.length - availableRoles.length
    if (remainingSlots < 0) {
      setShowErrorModal('Muitas funções especiais para poucos jogadores! Reduza os papéis.')
      return
    }

    availableRoles = [...availableRoles, ...Array(remainingSlots).fill('Cidadão')]
    availableRoles = shuffle(availableRoles)
    activePlayers.forEach((player, index) => {
      player.role = availableRoles[index]
    })

    const shuffledActivePlayers = shuffle(activePlayers)
    setPlayers(shuffledActivePlayers)
    setPhase('role-distribution-start')
    setCurrentPlayerIdx(0)
  }

  const startNightPhase = () => {
    setWolfKill(null)
    setAngelSave(null)
    setInvestigatedRole(null)

    if (settings.hasAngel) setPhase('night-angel')
    else setPhase('night-wolf')
  }

  const handleNextRoleReveal = () => {
    if (currentPlayerIdx < players.length - 1) {
      setCurrentPlayerIdx((previousIndex) => previousIndex + 1)
      setPhase('role-distribution-start')
      return
    }

    setPhase('night-intro')
    scheduleTimeout(() => startNightPhase(), 4000)
  }

  const finishNight = (overrideWolfKill?: string | null) => {
    const effectiveKill = overrideWolfKill !== undefined ? overrideWolfKill : wolfKill
    const victimId = resolveUltimaNoiteNightVictim(effectiveKill, angelSave)
    setPlayers((currentPlayers) => applyUltimaNoiteDeath(currentPlayers, victimId))
    setPhase('morning')
  }

  const handleNightAction = (targetId: string | null) => {
    if (phase === 'night-angel') {
      setAngelSave(targetId)
      setPhase('night-wolf')
      return
    }

    if (phase === 'night-wolf') {
      setWolfKill(targetId)
      if (settings.hasDetective) {
        setPhase('night-detective')
      } else {
        finishNight(targetId)
      }
      return
    }

    if (phase === 'night-detective') {
      if (targetId !== null) {
        const target = players.find((player) => player.id === targetId)
        setInvestigatedRole(target?.role || 'Cidadão')
        scheduleTimeout(() => {
          setInvestigatedRole(null)
          finishNight()
        }, 3000)
      } else {
        finishNight()
      }
    }
  }

  const startDiscussion = () => {
    setTimeLeft(discussionTime)
    setPhase('discussion')
  }

  const startVoting = () => {
    setPlayers((currentPlayers) => resetUltimaNoiteVotes(currentPlayers))
    setSelectedVote(null)

    const firstAliveIndex = findFirstLivingPlayerIndex(players)
    if (firstAliveIndex !== -1) {
      setCurrentPlayerIdx(firstAliveIndex)
      setPhase('voting')
      return
    }

    handleNextRoundOrEnd()
  }

  const handleVoteSelection = (targetId: string | 'skip') => {
    if (targetId !== 'skip') {
      const target = players.find((player) => player.id === targetId)
      if (!target?.isAlive) return
    }
    setSelectedVote(targetId)
  }

  const finishVoting = (finalPlayers: UltimaNoitePlayer[]) => {
    const resolution = resolveUltimaNoiteVoting(finalPlayers)
    setPlayers(resolution.players)
    if (resolution.winner) setWinner(resolution.winner)
    setPhase('voting-results')
  }

  const submitVote = () => {
    if (selectedVote === null) return

    const updatedPlayers = players.map((player) =>
      player.id === selectedVote ? { ...player, votes: player.votes + 1 } : player
    )
    setPlayers(updatedPlayers)
    setSelectedVote(null)

    const nextIndex = findNextLivingPlayerIndex(players, currentPlayerIdx)
    if (nextIndex !== -1) {
      setCurrentPlayerIdx(nextIndex)
      return
    }

    setPhase('voting-suspense')
    scheduleTimeout(() => {
      finishVoting(updatedPlayers)
    }, 1500)
  }

  const getWinner = (currentPlayers: UltimaNoitePlayer[] = players) =>
    resolveUltimaNoiteWinner(currentPlayers)

  function handleNextRoundOrEnd() {
    const possibleWinner = getWinner()
    if (possibleWinner) {
      setWinner(possibleWinner)
      setPhase('game-over')
      return
    }

    setPhase('night-intro')
    scheduleTimeout(() => startNightPhase(), 3000)
  }

  return {
    addPlayerSlot,
    angelSave,
    currentPlayerIdx,
    discussionTime,
    getWinner,
    handleNextRoleReveal,
    handleNextRoundOrEnd,
    handleNightAction,
    handleVoteSelection,
    investigatedRole,
    mediatorIndex,
    phase,
    playerNames,
    players,
    removePlayerSlot,
    selectedVote,
    setDiscussionTime,
    setMediatorIndex,
    setPhase,
    setSettings,
    setShowErrorModal,
    setShowMediatorInfo,
    settings,
    showErrorModal,
    showMediatorInfo,
    startDiscussion,
    startGameSetup,
    startVoting,
    submitVote,
    timeLeft,
    updatePlayerName,
    winner,
    wolfKill
  }
}
