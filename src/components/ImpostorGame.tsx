import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { ArrowLeft, Users, EyeOff, X } from 'lucide-react'
import GameButton from './GameButton'
import GameIcon from './GameIcon'

interface ImpostorGameProps {
  onBackToHome: () => void
}

type GameState = 'setup' | 'reveal' | 'voting' | 'results'

interface Player {
  id: number
  name: string
  isImpostor: boolean
  hasRevealed: boolean
  votes: number
  isAlive: boolean
}

const THEMES = [
  'Sushi', 'Lua', 'Copa do Mundo', 'Praia', 'Netflix', 'Pizza', 'Academia', 
  'Carnaval', 'Black Friday', 'Festa Junina', 'Aniversário', 'Trabalho',
  'Escola', 'Hospital', 'Aeroporto', 'Shopping', 'Igreja', 'Parque',
  'Cinema', 'Restaurante', 'Uber', 'Instagram', 'TikTok', 'WhatsApp'
]

const ImpostorGame: React.FC<ImpostorGameProps> = ({ onBackToHome }) => {
  const [gameState, setGameState] = useState<GameState>('setup')
  const [players, setPlayers] = useState<Player[]>([])
  const [currentTheme, setCurrentTheme] = useState('')
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [isCardRevealed, setIsCardRevealed] = useState(false)
  const [playerNames, setPlayerNames] = useState<string[]>([''])
  const [votingResults, setVotingResults] = useState<{player: Player, votes: number}[]>([])
  const [gameResult, setGameResult] = useState<'players-win' | 'impostor-wins' | null>(null)
  const [cardY, setCardY] = useState(0)
  const [totalVotes, setTotalVotes] = useState(0)
  const [showMinPlayersModal, setShowMinPlayersModal] = useState(false)

  // Prevenir scroll quando o card está aberto
  useEffect(() => {
    if (isCardRevealed) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isCardRevealed])

  const setupGame = () => {
    if (playerNames.filter(name => name.trim()).length < 3) {
      setShowMinPlayersModal(true)
      return
    }

    const validNames = playerNames.filter(name => name.trim())
    const impostorIndex = Math.floor(Math.random() * validNames.length)
    const theme = THEMES[Math.floor(Math.random() * THEMES.length)]
    
    const gamePlayers: Player[] = validNames.map((name, index) => ({
      id: index,
      name: name.trim(),
      isImpostor: index === impostorIndex,
      hasRevealed: false,
      votes: 0,
      isAlive: true
    }))

    setPlayers(gamePlayers)
    setCurrentTheme(theme)
    setGameState('reveal')
    setCurrentPlayerIndex(0)
    setIsCardRevealed(false)
    setCardY(0)
  }

  const handleCardDrag = (_event: any, info: PanInfo) => {
    if (info.offset.y < -100 && !isCardRevealed) {
      setIsCardRevealed(true)
      setCardY(-window.innerHeight * 0.8)
    }
  }

  const closeCard = () => {
    setIsCardRevealed(false)
    setCardY(0)
  }

  const nextPlayer = () => {
    const updatedPlayers = [...players]
    updatedPlayers[currentPlayerIndex].hasRevealed = true
    setPlayers(updatedPlayers)

    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1)
      setIsCardRevealed(false)
      setCardY(0)
    } else {
      setGameState('voting')
      setTotalVotes(0)
    }
  }

  const castVote = (playerId: number) => {
    if (totalVotes < players.length) {
      setPlayers(prev => prev.map(player => 
        player.id === playerId 
          ? { ...player, votes: player.votes + 1 }
          : player
      ))
      setTotalVotes(totalVotes + 1)
    }
  }

  const finishVoting = () => {
    const sortedByVotes = [...players].sort((a, b) => b.votes - a.votes)
    const mostVoted = sortedByVotes[0]
    const impostor = players.find(p => p.isImpostor)!
    
    setVotingResults(sortedByVotes.map(player => ({
      player,
      votes: player.votes
    })))

    // Nova lógica de vitória
    if (mostVoted.isImpostor) {
      setGameResult('players-win')
    } else {
      // Remove o jogador mais votado
      const alivePlayers = players.filter(p => p.id !== mostVoted.id && p.isAlive)
      if (alivePlayers.length <= 2 && impostor.isAlive) {
        setGameResult('impostor-wins')
      } else {
        // Continue o jogo (implementar rounds futuros)
        setGameResult('impostor-wins') // Por agora, impostor ganha
      }
    }
    
    setGameState('results')
  }

  const addPlayer = () => {
    if (playerNames.length < 10) {
      setPlayerNames([...playerNames, ''])
    }
  }

  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames]
    newNames[index] = name
    setPlayerNames(newNames)
  }

  const removePlayer = (index: number) => {
    if (playerNames.length > 1) {
      setPlayerNames(playerNames.filter((_, i) => i !== index))
    }
  }

  const resetGame = () => {
    setGameState('setup')
    setPlayers([])
    setCurrentTheme('')
    setCurrentPlayerIndex(0)
    setIsCardRevealed(false)
    setPlayerNames([''])
    setVotingResults([])
    setGameResult(null)
    setCardY(0)
    setTotalVotes(0)
    setShowMinPlayersModal(false)
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed top-8 left-8 opacity-10 z-0">
        <img src="/Assets/PNG/Blue/Default/star_outline.png" alt="" className="w-12 h-12" />
      </div>
      <div className="fixed top-16 right-12 opacity-5 z-0">
        <img src="/Assets/PNG/Yellow/Default/arrow_decorative_n.png" alt="" className="w-16 h-16" />
      </div>
      <div className="fixed bottom-12 left-16 opacity-5 z-0">
        <img src="/Assets/PNG/Green/Default/star.png" alt="" className="w-10 h-10" />
      </div>
      <div className="fixed bottom-20 right-8 opacity-10 z-0">
        <img src="/Assets/PNG/Red/Default/arrow_decorative_s.png" alt="" className="w-14 h-14" />
      </div>
      {/* Modal de erro - Mínimo de jogadores */}
      {showMinPlayersModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowMinPlayersModal(false)}
        >
          <motion.div
            className="bg-dark-blue rounded-2xl p-8 max-w-sm w-full border-2 border-danger-red/30 relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-danger-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="font-fredoka text-2xl text-white mb-4">
                Ops! Faltam Jogadores
              </h3>
              <p className="font-comfortaa text-gray-300 mb-6 leading-relaxed">
                Você precisa de <span className="text-playzenha-yellow font-bold">pelo menos 3 jogadores</span> para começar uma partida do Impostor!
              </p>
              <GameButton
                onClick={() => setShowMinPlayersModal(false)}
                variant="primary"
                className="w-full py-3 px-6 text-lg font-bold"
              >
                <GameIcon type="checkmark" variant="dark" size="md" />
                Entendi!
              </GameButton>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        className="flex items-center justify-between p-6 bg-dark-blue border-b border-gray-700 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="font-comfortaa">Voltar</span>
        </button>
        <h1 className="font-fredoka text-2xl md:text-4xl text-white">🕵️‍♂️ IMPOSTOR</h1>
        <div></div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Setup Phase */}
        {gameState === 'setup' && (
          <motion.div
            key="setup"
            className="p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="max-w-md mx-auto bg-gradient-to-br from-dark-blue/80 to-gray-900/80 backdrop-blur-lg rounded-3xl p-8 border-2 border-playzenha-blue/40 shadow-2xl relative overflow-hidden">
              {/* Decorative game elements */}
              <div className="absolute top-4 left-4 opacity-20">
                <img src="/Assets/PNG/Blue/Default/star.png" alt="" className="w-6 h-6" />
              </div>
              <div className="absolute top-6 right-6 opacity-15">
                <img src="/Assets/PNG/Yellow/Default/star_outline.png" alt="" className="w-5 h-5" />
              </div>
              <div className="absolute bottom-4 left-6 opacity-10">
                <img src="/Assets/PNG/Green/Default/star.png" alt="" className="w-4 h-4" />
              </div>
              <div className="absolute bottom-6 right-4 opacity-20">
                <img src="/Assets/PNG/Red/Default/star_outline.png" alt="" className="w-5 h-5" />
              </div>
              
              <div className="text-center mb-8 relative z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <img src="/Assets/PNG/Extra/Default/icon_play_light.png" alt="" className="w-8 h-8 opacity-60" />
                  <h2 className="font-fredoka text-2xl md:text-3xl text-white">
                    Quem vai jogar?
                  </h2>
                  <img src="/Assets/PNG/Extra/Default/icon_play_light.png" alt="" className="w-8 h-8 opacity-60 transform scale-x-[-1]" />
                </div>
                <p className="font-comfortaa text-gray-300">
                  Digite os nomes (mínimo 3 pessoas)
                </p>
                <div className="flex justify-center mt-3">
                  <img src="/Assets/PNG/Extra/Default/divider.png" alt="" className="w-32 h-2 opacity-30" />
                </div>
              </div>

              <div className="space-y-4 mb-8 relative z-10">
                {playerNames.map((name, index) => (
                  <motion.div
                    key={index}
                    className="flex gap-3 items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-6 h-6 flex-shrink-0 opacity-40">
                        <img src="/Assets/PNG/Blue/Default/icon_circle.png" alt="" className="w-full h-full" />
                      </div>
                      <div className="relative flex-1 bg-dark-bg/60 rounded-xl border border-playzenha-blue/30 p-3">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => updatePlayerName(index, e.target.value)}
                          placeholder={`Jogador ${index + 1}`}
                          className="w-full bg-transparent text-white font-comfortaa placeholder-gray-400 outline-none border-none"
                        />
                      </div>
                    </div>
                    {playerNames.length > 1 && (
                      <GameButton
                        onClick={() => removePlayer(index)}
                        variant="danger"
                        size="sm"
                        className="w-12 h-12 flex-shrink-0 flex items-center justify-center"
                      >
                        <GameIcon type="cross" variant="light" size="sm" />
                      </GameButton>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col gap-4 relative z-10">
                {playerNames.length < 10 && (
                  <GameButton
                    onClick={addPlayer}
                    variant="secondary"
                    className="flex items-center justify-center gap-3 relative overflow-hidden"
                  >
                    <div className="absolute left-4 opacity-30">
                      <img src="/Assets/PNG/Green/Default/icon_circle.png" alt="" className="w-4 h-4" />
                    </div>
                    <Users className="w-5 h-5" />
                    Adicionar Jogador
                    <div className="absolute right-4 opacity-30">
                      <img src="/Assets/PNG/Blue/Default/arrow_basic_e_small.png" alt="" className="w-4 h-4" />
                    </div>
                  </GameButton>
                )}
                
                <div className="relative">
                  <GameButton
                    onClick={setupGame}
                    variant="primary"
                    size="lg"
                    className="font-bold flex items-center justify-center gap-3 w-full"
                  >
                    <GameIcon type="play" variant="dark" size="lg" />
                    COMEÇAR JOGO
                    <img src="/Assets/PNG/Extra/Default/icon_arrow_up_dark.png" alt="" className="w-5 h-5 opacity-70" />
                  </GameButton>
                  {/* Decorative elements around main button */}
                  <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 opacity-20">
                    <img src="/Assets/PNG/Yellow/Default/arrow_decorative_e.png" alt="" className="w-8 h-8" />
                  </div>
                  <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 opacity-20">
                    <img src="/Assets/PNG/Blue/Default/arrow_decorative_w.png" alt="" className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Reveal Phase - Nova mecânica de arraste */}
        {gameState === 'reveal' && (
          <motion.div
            key="reveal"
            className="relative h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Informações do jogador atual */}
            <div className="p-6 text-center">
              <h2 className="font-fredoka text-xl md:text-2xl text-white mb-2">
                Vez de: <span className="text-playzenha-yellow">{players[currentPlayerIndex]?.name}</span>
              </h2>
              <p className="font-comfortaa text-gray-300 text-sm md:text-base">
                Arraste o card para cima para revelar seu papel
              </p>
            </div>

            {/* Card draggable */}
            <motion.div
              className="absolute bottom-0 left-0 right-0"
              drag="y"
              dragConstraints={{ top: -window.innerHeight * 0.8, bottom: 0 }}
              onDragEnd={handleCardDrag}
              animate={{ y: cardY }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Handle para arrastar */}
              <div className="px-6 pb-2">
                <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4"></div>
              </div>

              {/* Card content */}
              <div className={`min-h-screen rounded-t-3xl p-6 border-t-4 ${
                !isCardRevealed 
                  ? 'bg-gray-800 border-gray-600'
                  : players[currentPlayerIndex]?.isImpostor
                    ? 'bg-gradient-to-br from-danger-red/20 to-red-900/30 border-danger-red animate-pulse'
                    : 'bg-gradient-to-br from-success-green/20 to-green-900/30 border-success-green'
              }`}>
                
                {!isCardRevealed ? (
                  <motion.div
                    className="text-center pt-20"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                  >
                    <EyeOff className="w-20 h-20 mx-auto mb-6 text-gray-400" />
                    <h3 className="font-fredoka text-2xl md:text-3xl text-gray-300 mb-4">
                      ARRASTE PARA REVELAR
                    </h3>
                    <p className="font-comfortaa text-gray-500">
                      Seu papel secreto aguarda...
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    className="text-center pt-20"
                    initial={{ scale: 0, rotateY: 180 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    {/* Botão fechar */}
                    <button
                      onClick={closeCard}
                      className="absolute top-6 right-6 w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>

                    {players[currentPlayerIndex]?.isImpostor ? (
                      <div>
                        <div className="text-8xl mb-6">🔥</div>
                        <h3 className="font-fredoka text-3xl md:text-4xl text-danger-red mb-4">
                          VOCÊ É O IMPOSTOR!
                        </h3>
                        <div className="bg-danger-red/20 rounded-2xl p-6 mb-6 border border-danger-red/30">
                          <p className="font-comfortaa text-white/90 text-lg leading-relaxed">
                            Escute as dicas dos outros e tente descobrir o tema. 
                            <br />
                            <strong className="text-danger-red">Finja que sabe do que estão falando!</strong>
                          </p>
                        </div>
                        <div className="bg-red-900/20 rounded-xl p-4 border border-red-500/30">
                          <p className="font-comfortaa text-sm text-red-300">
                            💡 Dica: Seja genérico e observe as reações
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-8xl mb-6">✅</div>
                        <h3 className="font-fredoka text-2xl md:text-3xl text-white mb-6">SEU TEMA É:</h3>
                        <div className="bg-playzenha-yellow rounded-2xl p-6 mb-6 transform -rotate-1 border-4 border-yellow-500">
                          <h4 className="font-fredoka text-3xl md:text-4xl text-dark-bg">
                            {currentTheme}
                          </h4>
                        </div>
                        <div className="bg-success-green/20 rounded-2xl p-6 mb-6 border border-success-green/30">
                          <p className="font-comfortaa text-white/90 text-lg leading-relaxed">
                            Dê dicas que provem que você sabe o tema, 
                            <br />
                            <strong className="text-success-green">mas sem ser óbvio demais!</strong>
                          </p>
                        </div>
                        <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/30">
                          <p className="font-comfortaa text-sm text-green-300">
                            💡 Dica: Seja criativo mas não entregue o tema
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <GameButton
                      onClick={nextPlayer}
                      variant="primary"
                      size="lg"
                      className="mt-8 w-full max-w-sm mx-auto flex items-center justify-center gap-3"
                    >
                      <GameIcon 
                        type={currentPlayerIndex < players.length - 1 ? "arrow_down" : "checkmark"} 
                        variant="dark" 
                        size="md" 
                      />
                      {currentPlayerIndex < players.length - 1 ? 'PRÓXIMO JOGADOR' : 'CONTINUAR'}
                    </GameButton>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Voting Phase */}
        {gameState === 'voting' && (
          <motion.div
            key="voting"
            className="p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🗳️</div>
                <h2 className="font-fredoka text-2xl md:text-3xl text-white mb-4">VOTAÇÃO</h2>
                <p className="font-comfortaa text-gray-300 mb-4">
                  Quem vocês acham que é o impostor?
                </p>
                <div className="bg-playzenha-yellow/20 rounded-xl p-4 border border-playzenha-yellow/30">
                  <p className="font-comfortaa text-playzenha-yellow">
                    Votos: {totalVotes} / {players.length}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {players.filter(p => p.isAlive).map((player, index) => (
                  <motion.button
                    key={player.id}
                    onClick={() => castVote(player.id)}
                    disabled={totalVotes >= players.length}
                    className={`bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 hover:border-playzenha-yellow rounded-2xl p-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      totalVotes >= players.length ? 'hover:bg-gray-800 hover:border-gray-600' : ''
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={totalVotes < players.length ? { scale: 1.02 } : {}}
                    whileTap={totalVotes < players.length ? { scale: 0.98 } : {}}
                  >
                    <div className="text-4xl mb-2">👤</div>
                    <h3 className="font-fredoka text-xl text-white mb-2">{player.name}</h3>
                    <div className="bg-playzenha-yellow/20 rounded-lg px-3 py-1 inline-block">
                      <span className="font-comfortaa text-sm text-playzenha-yellow">
                        {player.votes} votos
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {totalVotes >= players.length && (
                <div className="text-center">
                  <motion.button
                    onClick={finishVoting}
                    className="bg-gradient-to-r from-danger-red to-red-600 text-white font-fredoka text-lg font-bold py-4 px-8 rounded-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🎊 REVELAR RESULTADO
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Results Phase */}
        {gameState === 'results' && (
          <motion.div
            key="results"
            className="p-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                className="mb-8"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
              >
                <div className="text-8xl mb-4">
                  {gameResult === 'players-win' ? '🎉' : '😈'}
                </div>
                <h2 className={`font-fredoka text-3xl md:text-4xl mb-4 ${
                  gameResult === 'players-win' 
                    ? 'text-success-green' 
                    : 'text-danger-red'
                }`}>
                  {gameResult === 'players-win' ? 'JOGADORES VENCERAM!' : 'IMPOSTOR VENCEU!'}
                </h2>
                <p className="font-comfortaa text-gray-300 text-lg">
                  {gameResult === 'players-win' 
                    ? 'Parabéns! Vocês descobriram o impostor!' 
                    : 'O impostor conseguiu enganar todo mundo!'}
                </p>
              </motion.div>

              {/* Reveal Impostor */}
              <motion.div
                className="bg-gradient-to-br from-danger-red/20 to-red-900/30 rounded-3xl p-6 border border-danger-red/50 mb-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="font-fredoka text-xl md:text-2xl text-white mb-4">O IMPOSTOR ERA:</h3>
                <div className="bg-danger-red/30 rounded-2xl p-4 transform -rotate-1 border border-danger-red/50">
                  <h4 className="font-fredoka text-2xl md:text-3xl text-white">
                    🔥 {players.find(p => p.isImpostor)?.name}
                  </h4>
                </div>
              </motion.div>

              {/* Theme Reveal */}
              <motion.div
                className="bg-gradient-to-br from-playzenha-yellow/20 to-yellow-900/30 rounded-3xl p-6 border border-playzenha-yellow/50 mb-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="font-fredoka text-xl md:text-2xl text-white mb-4">O TEMA SECRETO ERA:</h3>
                <div className="bg-playzenha-yellow rounded-2xl p-4 transform rotate-1 border-4 border-yellow-500">
                  <h4 className="font-fredoka text-2xl md:text-3xl text-dark-bg">
                    🎯 {currentTheme}
                  </h4>
                </div>
              </motion.div>

              {/* Voting Results */}
              <motion.div
                className="bg-gray-800/50 rounded-3xl p-6 border border-gray-600 mb-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <h3 className="font-fredoka text-lg md:text-xl text-white mb-4">RESULTADOS DA VOTAÇÃO:</h3>
                <div className="space-y-3">
                  {votingResults.map((result, index) => (
                    <motion.div
                      key={result.player.id}
                      className={`flex justify-between items-center p-3 rounded-xl ${
                        result.player.isImpostor 
                          ? 'bg-danger-red/20 border border-danger-red/30' 
                          : 'bg-gray-700/50 border border-gray-600'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                    >
                      <span className="font-comfortaa text-white">
                        {result.player.isImpostor ? '🔥' : '✅'} {result.player.name}
                      </span>
                      <span className="font-fredoka text-playzenha-yellow">
                        {result.votes} votos
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <GameButton
                  onClick={resetGame}
                  variant="secondary"
                  size="lg"
                  className="flex items-center justify-center gap-3"
                >
                  <GameIcon type="repeat" variant="light" size="md" />
                  JOGAR NOVAMENTE
                </GameButton>
                
                <GameButton
                  onClick={onBackToHome}
                  variant="primary"
                  size="lg"
                  className="flex items-center justify-center gap-3"
                >
                  <GameIcon type="arrow_up" variant="dark" size="md" />
                  VOLTAR AO MENU
                </GameButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ImpostorGame