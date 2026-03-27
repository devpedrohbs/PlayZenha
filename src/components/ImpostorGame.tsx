import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Users, AlertTriangle, 
  CheckCircle, HelpCircle, Clock, Skull, Crown
} from 'lucide-react'
import GameButton from './GameButton'

interface ImpostorGameProps {
  onBackToHome: () => void
}

type Phase = 
  | 'setup' 
  | 'role-distribution-start'
  | 'role-reveal'
  | 'game-start'
  | 'discussion' // Timer running
  | 'voting-intro' 
  | 'voting'
  | 'voting-results' // Who died/Was ejected
  | 'game-over'

type Role = 'Impostor' | 'Cidadão'

interface Player {
  id: number
  name: string
  role: Role
  isAlive: boolean
  votes: number
}

const THEMES = [
  'Sushi', 'Lua', 'Copa do Mundo', 'Praia', 'Netflix', 'Pizza', 'Academia', 
  'Carnaval', 'Black Friday', 'Festa Junina', 'Aniversário', 'Trabalho',
  'Escola', 'Hospital', 'Aeroporto', 'Shopping', 'Igreja', 'Parque',
    'Cinema', 'Restaurante', 'Uber', 'Instagram', 'TikTok', 'WhatsApp',
    'Padaria', 'Churrasco', 'Barbearia', 'Salão de Beleza', 'Farmácia', 'Banco',
    'Rodoviária', 'Metrô', 'Elevador', 'Condomínio', 'Casamento', 'Formatura',
    'Natal', 'Ano Novo', 'Páscoa', 'Halloween', 'Videogame', 'YouTube',
    'Spotify', 'Bicicleta', 'Academia', 'Feira', 'Pet Shop', 'Supermercado'
]

const ImpostorGame: React.FC<ImpostorGameProps> = ({ onBackToHome }) => {
  // State
  const [phase, setPhase] = useState<Phase>('setup')
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '']) // Min 3
  const [players, setPlayers] = useState<Player[]>([])
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0)
  
  // Game Data
  const [theme, setTheme] = useState('')
  const [discussionTime, setDiscussionTime] = useState(180) // 3 mins default
  const [timeLeft, setTimeLeft] = useState(0)
  
  // Voting
  const [selectedVote, setSelectedVote] = useState<number | null>(null)
  
  // Results
  const [winner, setWinner] = useState<'Impostor' | 'Cidadãos' | null>(null)
  const [eliminatedPlayer, setEliminatedPlayer] = useState<Player | null>(null)

  // Timer Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (phase === 'discussion' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (phase === 'discussion' && timeLeft === 0) {
        setPhase('voting-intro')
    }
    return () => clearInterval(interval)
  }, [phase, timeLeft])


  // --- Helper Functions ---

  const addPlayerSlot = () => {
    if (playerNames.length < 16) setPlayerNames([...playerNames, ''])
  }

  const removePlayerSlot = (idx: number) => {
    if (playerNames.length > 3) {
        setPlayerNames(playerNames.filter((_, i) => i !== idx))
    } else {
        const newNames = [...playerNames]
        newNames[idx] = ''
        setPlayerNames(newNames)
    }
  }

  const updatePlayerName = (idx: number, val: string) => {
    const newNames = [...playerNames]
    newNames[idx] = val
    setPlayerNames(newNames)
  }

  const startGameSetup = () => {
    // Validate names
    const activeNames: string[] = []
    const usedNames = new Set<string>()

    for (const name of playerNames) {
        const trimmed = name.trim()
        if (!trimmed) continue
        
        if (usedNames.has(trimmed.toUpperCase())) {
            alert(`O nome "${trimmed}" já está em uso!`)
            return
        }
        usedNames.add(trimmed.toUpperCase())
        activeNames.push(trimmed.toUpperCase()) // Uppercase convention
    }

    if (activeNames.length < 3) {
        alert("Mínimo de 3 jogadores para o Impostor.")
        return
    }

    // Role Assignment
    const impostorIdx = Math.floor(Math.random() * activeNames.length)
    const selectedTheme = THEMES[Math.floor(Math.random() * THEMES.length)]

    const newPlayers: Player[] = activeNames.map((name, i) => ({
        id: i,
        name,
        role: i === impostorIdx ? 'Impostor' : 'Cidadão',
        isAlive: true,
        votes: 0
    }))

    setPlayers(newPlayers)
    setTheme(selectedTheme)
    setCurrentPlayerIdx(0)
    setPhase('role-distribution-start')
  }

  // --- Game Flow ---

  const handleNextRoleReveal = () => {
      if (currentPlayerIdx < players.length - 1) {
          setCurrentPlayerIdx(prev => prev + 1)
          setPhase('role-distribution-start')
      } else {
          setPhase('game-start')
          setTimeout(() => {
              setTimeLeft(discussionTime)
              setPhase('discussion')
          }, 3000)
      }
  }

  const startVoting = () => {
      // Reset votes
      setPlayers(prev => prev.map(p => ({...p, votes: 0})))
      setSelectedVote(null)
      setPhase('voting')
  }

  const submitVote = () => {
      if (selectedVote === null) return
      
      const votedPlayer = players.find(p => p.id === selectedVote)
      if (!votedPlayer) return

      handleElimination(votedPlayer)
  }

  const handleElimination = (player: Player) => {
      setEliminatedPlayer(player)
      
      // Check Win Condition
      if (player.role === 'Impostor') {
          setWinner('Cidadãos')
      } else {
          // Wrong Vote = Impostor Wins
          setWinner('Impostor')
      }
      setPhase('voting-results')
  }

  const restartGame = () => {
      setPhase('setup')
      setWinner(null)
      setEliminatedPlayer(null)
      setPlayers([])
      // Keep playerNames from previous game to ease restart
  }

  // --- Renders ---

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans overflow-hidden relative selection:bg-purple-500 selection:text-white">
        
        {/* Header */}
        <nav className="absolute top-0 w-full p-4 flex justify-between items-center z-50">
            <button onClick={onBackToHome} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
                <span className="text-2xl">🕵️‍♂️</span>
                <span className="text-xl font-bold tracking-wider">IMPOSTOR</span>
            </div>
            <div className="w-10" />
        </nav>

        <AnimatePresence mode="wait">

            {/* SETUP PHASE */}
            {phase === 'setup' && (
                <motion.div key="setup" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="pt-24 px-6 h-screen flex flex-col">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl md:text-4xl mb-2 font-bold text-white flex items-center justify-center gap-2">
                           Quem vai jogar?
                        </h1>
                        <p className="text-gray-400 text-sm">Mínimo de 3 jogadores</p>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 mb-4 custom-scrollbar">
                        {playerNames.map((name, i) => (
                             <div key={i} className="flex gap-2">
                                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center font-bold text-gray-400 border border-white/10 shrink-0">{i+1}</div>
                                <input 
                                    className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-4 text-base focus:border-purple-500 outline-none transition-colors text-white"
                                    placeholder="Nome do jogador"
                                    value={name}
                                    onChange={(e) => updatePlayerName(i, e.target.value)}
                                />
                                <button onClick={() => removePlayerSlot(i)} className="p-3 text-red-500/50 hover:text-red-500 shrink-0 transition-colors">
                                    <AlertTriangle size={20}/>
                                </button>
                             </div>
                        ))}
                        {playerNames.length < 16 && (
                            <button onClick={addPlayerSlot} className="w-full py-3 border-2 border-dashed border-white/10 rounded-lg text-gray-500 hover:text-white hover:border-white/30 font-bold transition-all">
                                + Adicionar Jogador
                            </button>
                        )}
                    </div>

                     {/* Time Settings */}
                     <div className="bg-white/5 p-4 rounded-xl mb-4 border border-white/10">
                        <div className="flex justify-between items-center text-sm text-gray-300">
                             <div className="flex items-center gap-2">
                                <Clock size={16} />
                                <span>Tempo de Discussão</span>
                             </div>
                             <div className="flex gap-3 items-center">
                                <button onClick={() => setDiscussionTime(Math.max(60, discussionTime - 60))} className="w-8 h-8 rounded bg-white/10 hover:bg-white/20">-</button>
                                <span className="font-mono w-12 text-center">{discussionTime / 60}min</span>
                                <button onClick={() => setDiscussionTime(Math.min(600, discussionTime + 60))} className="w-8 h-8 rounded bg-white/10 hover:bg-white/20">+</button>
                             </div>
                        </div>
                     </div>

                    <GameButton 
                        onClick={startGameSetup} 
                        disabled={playerNames.filter(n => n.trim()).length < 3}
                        className="w-full py-4 text-xl shadow-lg shadow-purple-900/40 mb-6 font-bold"
                    >
                        COMEÇAR
                    </GameButton>
                </motion.div>
            )}

            {/* ROLE DISTRIBUTION START */}
            {phase === 'role-distribution-start' && (
                <motion.div key="role-start" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-screen flex flex-col justify-center items-center px-6 text-center bg-black">
                     <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 animate-pulse border border-white/20">
                        <Users className="w-10 h-10 text-white" />
                     </div>
                     <h2 className="text-xl text-gray-400 mb-2 font-light">
                        Passe o celular para
                     </h2>
                     <h1 className="text-5xl text-white mb-12 font-bold tracking-tight px-2 break-words max-w-full">{players[currentPlayerIdx].name}</h1>
                     <GameButton onClick={() => setPhase('role-reveal')} className="w-full max-w-xs shadow-purple-500/20 shadow-lg">
                        REVELAR PAPEL
                     </GameButton>
                </motion.div>
            )}

            {/* ROLE REVEAL */}
            {phase === 'role-reveal' && (
                <motion.div key="role-reveal" initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="h-screen flex flex-col justify-center items-center px-6 text-center bg-gray-900 border-[10px] border-gray-800">
                     
                     {players[currentPlayerIdx].role === 'Impostor' ? (
                         <>
                            <div className="text-8xl mb-6">🤫</div>
                            <h2 className="text-2xl text-red-400 font-bold mb-2 uppercase tracking-widest">
                                Você é o
                            </h2>
                            <h1 className="text-5xl md:text-6xl font-black text-red-500 mb-8 drop-shadow-red">
                                IMPOSTOR
                            </h1>
                            <p className="text-gray-400 mb-12 max-w-xs mx-auto text-sm leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
                                Seu objetivo: <br/> 
                                <span className="text-white font-bold">Descubra o tema</span> ouvindo a conversa ou <span className="text-white font-bold">engane a todos</span> para não ser votado.
                            </p>
                         </>
                     ) : (
                         <>
                            <div className="text-8xl mb-6">🎯</div>
                            <h2 className="text-2xl text-green-400 font-bold mb-2 uppercase tracking-widest">
                                Tema da Rodada
                            </h2>
                            <h1 className="text-5xl md:text-6xl font-black text-white mb-8 border-b-4 border-green-500 pb-2">
                                {theme}
                            </h1>
                            <p className="text-gray-400 mb-12 max-w-xs mx-auto text-sm leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
                                Você é um Cidadão. <br/>
                                <span className="text-white font-bold">Encontre o impostor</span> que não sabe qual é este tema!
                            </p>
                         </>
                     )}
                     
                     <button 
                        onClick={handleNextRoleReveal} 
                        className="w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center animate-pulse hover:bg-white/10 transition-colors active:scale-95"
                     >
                        <CheckCircle className="w-10 h-10 text-white" />
                     </button>
                     <span className="text-xs text-gray-500 mt-4 uppercase tracking-widest font-bold">
                        Toque para esconder
                     </span>
                </motion.div>
            )}

            {/* GAME START INTRO */}
            {phase === 'game-start' && (
                <motion.div key="game-start" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-screen bg-black flex flex-col items-center justify-center text-center">
                    <HelpCircle className="w-32 h-32 text-purple-600 animate-bounce mb-8" />
                    <h1 className="text-4xl text-white font-bold tracking-wider uppercase mb-4">Investiguem!</h1>
                    <p className="text-gray-500 text-lg">Façam perguntas sobre o tema...</p>
                </motion.div>
            )}

            {/* DISCUSSION */}
            {phase === 'discussion' && (
                <motion.div key="discussion" className="h-screen flex flex-col items-center justify-center bg-gray-900 px-6">
                    <h2 className="text-2xl text-gray-400 mb-8 uppercase tracking-widest font-bold">Tempo Restante</h2>
                    
                    <div className="relative w-72 h-72 flex items-center justify-center mb-12">
                         <svg className="absolute w-full h-full transform -rotate-90">
                             <circle cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-800" />
                             <circle cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="12" fill="transparent" className={`transition-all duration-1000 ${timeLeft < 30 ? 'text-red-500' : 'text-purple-500'}`}
                                strokeDasharray={2 * Math.PI * 130}
                                strokeDashoffset={2 * Math.PI * 130 * (1 - timeLeft / discussionTime)}
                             />
                         </svg>
                         <div className="text-7xl font-bold font-mono text-white">
                             {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                         </div>
                    </div>
                    
                    <div className="flex flex-col gap-4 w-full max-w-sm">
                        <GameButton onClick={() => setPhase('voting-intro')} variant="primary" className="w-full">
                            VOTAR AGORA
                        </GameButton>
                        <button onClick={() => setTimeLeft(prev => prev + 60)} className="text-sm text-gray-500 hover:text-white transition-colors">
                            + 1 Minuto
                        </button>
                    </div>
                </motion.div>
            )}

            {/* VOTING INTRO */}
            {phase === 'voting-intro' && (
                <motion.div key="voting-intro" onClick={startVoting} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-screen bg-red-900/20 flex flex-col items-center justify-center text-center px-6 cursor-pointer">
                    <AlertTriangle className="w-24 h-24 text-red-500 mb-6 animate-pulse" />
                    <h1 className="text-4xl font-black text-white uppercase mb-4">Hora de Votar</h1>
                    <p className="text-red-300 text-lg max-w-md">Quem vocês acham que é o <strong>Impostor</strong>?</p>
                    <p className="mt-12 text-sm text-gray-500 animate-bounce">Toque para continuar</p>
                </motion.div>
            )}

            {/* VOTING LIST */}
            {phase === 'voting' && (
                <motion.div key="voting" className="pt-24 px-6 h-screen flex flex-col bg-gray-900">
                    <h2 className="text-center text-2xl font-bold text-white mb-2">Quem foi o escolhido?</h2>
                    <p className="text-center text-gray-500 text-sm mb-6">Selecione quem a maioria votou.</p>

                    <div className="flex-1 overflow-y-auto custom-scrollbar mb-4 space-y-3">
                        {players.map((player) => (
                            <button
                                key={player.id}
                                onClick={() => setSelectedVote(player.id)}
                                className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                                    selectedVote === player.id 
                                    ? 'bg-red-500/20 border-red-500 scale-[1.02]' 
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${selectedVote === player.id ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                                         {player.name.charAt(0)}
                                     </div>
                                     <span className="text-lg font-medium text-white">{player.name}</span>
                                </div>
                                {selectedVote === player.id && <Skull className="text-red-500" />}
                            </button>
                        ))}
                    </div>

                    <div className="pb-8">
                        <GameButton 
                            onClick={submitVote} 
                            disabled={selectedVote === null}
                            variant="danger"
                            className="w-full shadow-lg shadow-red-900/20"
                        >
                            CONFIRMAR VOTO
                        </GameButton>
                    </div>
                </motion.div>
            )}

            {/* RESULTS */}
            {phase === 'voting-results' && winner && (
                <motion.div key="results" initial={{opacity:0}} animate={{opacity:1}} className="h-screen flex flex-col items-center justify-center p-6 text-center bg-black">
                     
                     <div className="mb-8 relative">
                         <div className={`absolute inset-0 blur-3xl rounded-full opacity-20 ${winner === 'Cidadãos' ? 'bg-green-500' : 'bg-red-500'}`} />
                         {winner === 'Cidadãos' ? (
                             <Crown className="w-32 h-32 text-green-400 relative z-10" />
                         ) : (
                             <Skull className="w-32 h-32 text-red-500 relative z-10" />
                         )}
                     </div>

                     <h2 className="text-gray-400 text-xl uppercase tracking-widest mb-2 font-bold">Vencedores</h2>
                     <h1 className={`text-5xl md:text-6xl font-black mb-8 ${winner === 'Cidadãos' ? 'text-green-500' : 'text-red-500'}`}>
                         {winner.toUpperCase()}
                     </h1>

                     <div className="bg-white/10 p-6 rounded-2xl border border-white/10 max-w-sm w-full mb-8 backdrop-blur-md">
                         <p className="text-gray-400 text-sm mb-2">O impostor era:</p>
                         <p className="text-3xl font-bold text-white mb-4">
                             {players.find(p => p.role === 'Impostor')?.name}
                         </p>
                         <div className="h-px bg-white/10 w-full my-4" />
                         <p className="text-gray-400 text-sm mb-1">O tema era:</p>
                         <p className="text-xl text-playzenha-blue font-bold">
                             {theme}
                         </p>
                     </div>

                     <GameButton onClick={restartGame} className="w-full max-w-xs">
                         JOGAR DE NOVO
                     </GameButton>

                </motion.div>
            )}

        </AnimatePresence>
    </div>
  )
}

export default ImpostorGame
