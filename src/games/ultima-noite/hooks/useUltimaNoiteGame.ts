import { useEffect, useState } from 'react'
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
  UltimaNoiteWinner
} from '../domain/ultimaNoite.types'

const DEFAULT_DISCUSSION_TIME = 120

export const useUltimaNoiteGame = () => {
  const [phase, setPhase] = useState<UltimaNoitePhase>('setup')
  const [players, setPlayers] = useState<UltimaNoitePlayer[]>([])
  const [playerNames, setPlayerNames] = useState<string[]>(ULTIMA_NOITE_DEFAULT_PLAYER_NAMES)
  const [mediatorIndex, setMediatorIndex] = useState<number | null>(null)
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0)
  const [wolfKill, setWolfKill] = useState<number | null>(null)
  const [angelSave, setAngelSave] = useState<number | null>(null)
  const [investigatedRole, setInvestigatedRole] = useState<UltimaNoiteRole | null>(null)
  const [discussionTime, setDiscussionTime] = useState(DEFAULT_DISCUSSION_TIME)
  const [timeLeft, setTimeLeft] = useState(0)
  const [winner, setWinner] = useState<UltimaNoiteWinner | null>(null)
  const [selectedVote, setSelectedVote] = useState<number | null>(null)
  const [showErrorModal, setShowErrorModal] = useState<string | null>(null)
  const [showMediatorInfo, setShowMediatorInfo] = useState(false)
  const [settings, setSettings] = useState<UltimaNoiteSettings>({
    wolvesCount: 1,
    hasAngel: true,
    hasDetective: true,
    hasMediator: false
  })

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
  }, [])

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
      if (mediatorIndex && mediatorIndex > index) setMediatorIndex(mediatorIndex - 1)
      return
    }

    updatePlayerName(index, '')
    if (mediatorIndex === index) setMediatorIndex(null)
  }

  const startGameSetup = () => {
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
        id: 0,
        name: upperName,
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
      setTimeout(() => setShowMediatorInfo(true), 1500)
      return
    }

    if (validCount < ULTIMA_NOITE_MIN_PLAYERS) {
      setShowErrorModal('É necessário no mínimo 6 participantes (incluindo o mediador).')
      return
    }

    setSettings((currentSettings) => ({ ...currentSettings, hasMediator: Boolean(assignedMediator) }))
    activePlayers.forEach((player, index) => {
      player.id = index
    })

    let availableRoles: UltimaNoiteRole[] = Array(settings.wolvesCount).fill('Lobo')
    if (settings.hasAngel) availableRoles.push('Anjo')
    if (settings.hasDetective) availableRoles.push('Detetive')

    const remainingSlots = activePlayers.length - availableRoles.length
    if (remainingSlots < 0) {
      setShowErrorModal('Muitas funções especiais para poucos jogadores! Reduza os papéis.')
      return
    }

    availableRoles = [...availableRoles, ...Array(remainingSlots).fill('Cidadão')]
    availableRoles = availableRoles.sort(() => Math.random() - 0.5)
    activePlayers.forEach((player, index) => {
      player.role = availableRoles[index]
    })

    const shuffledActivePlayers = activePlayers.sort(() => Math.random() - 0.5)
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
    setTimeout(() => startNightPhase(), 4000)
  }

  const finishNight = (overrideWolfKill?: number | null) => {
    const effectiveKill = overrideWolfKill !== undefined ? overrideWolfKill : wolfKill
    const victimId = resolveUltimaNoiteNightVictim(effectiveKill, angelSave)
    setPlayers((currentPlayers) => applyUltimaNoiteDeath(currentPlayers, victimId))
    setPhase('morning')
  }

  const handleNightAction = (targetId: number | null) => {
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
        setTimeout(() => {
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

  const handleVoteSelection = (targetId: number) => {
    if (targetId !== -1) {
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
    setTimeout(() => {
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
    setTimeout(() => startNightPhase(), 3000)
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
