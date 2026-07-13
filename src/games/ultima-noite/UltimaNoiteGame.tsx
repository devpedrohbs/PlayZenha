import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Users, Moon, Sun, Shield, Search, 
  AlertTriangle, Skull, MessageCircle, CheckCircle
} from 'lucide-react'
import GameButton from '../shared/components/GameButton'
import { useUltimaNoiteGame } from './hooks/useUltimaNoiteGame'

interface UltimaNoiteGameProps {
  onBackToHome: () => void
}

type Role = 'Lobo' | 'Anjo' | 'Detetive' | 'Cidadão' | 'Mediador'
interface Player {
  id: number
  name: string
  role: Role
  isAlive: boolean
  votes: number
}

const ROLES_CONFIG = {
  Lobo: { color: 'text-red-500', bg: 'bg-red-500/20', border: 'border-red-500', icon: '🐺' },
  Anjo: { color: 'text-purple-400', bg: 'bg-purple-400/20', border: 'border-purple-400', icon: '👼' },
  Detetive: { color: 'text-purple-400', bg: 'bg-purple-400/20', border: 'border-purple-400', icon: '🕵️' },
  Cidadão: { color: 'text-gray-300', bg: 'bg-gray-500/20', border: 'border-gray-500', icon: '👥' },
  Mediador: { color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-400', icon: '🗣️' },
}

const UltimaNoiteGame: React.FC<UltimaNoiteGameProps> = ({ onBackToHome }) => {
  const {
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
  } = useUltimaNoiteGame()

  // --- Renders ---

  return (
    <div className="playzenha-game playzenha-game-ultima-noite min-h-screen bg-dark-bg text-white font-fredoka overflow-hidden relative selection:bg-purple-500 selection:text-white">
        {/* Header - Minimalist */}
        {phase !== 'night-intro' && !phase.startsWith('night-') && (
            <nav className="absolute top-0 w-full p-4 flex justify-between items-center z-50">
                <button onClick={onBackToHome} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex items-center gap-2 rounded-2xl border border-purple-400/30 bg-purple-500/10 px-4 py-2 shadow-lg shadow-purple-500/10">
                    <Moon className="w-5 h-5 text-purple-400" />
                    <span className="text-xl tracking-wider">ÚLTIMA NOITE</span>
                </div>
                <div className="w-10" />
            </nav>
        )}

        <AnimatePresence mode="wait">
            
            {/* SETUP PHASE */}
            {phase === 'setup' && (
                <motion.div key="setup" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="playzenha-game-screen pt-20 px-6 min-h-screen flex flex-col">
                    <div className="text-center mb-6 relative rounded-3xl border border-purple-400/20 bg-purple-500/10 p-5 shadow-xl shadow-purple-500/10">
                        <h1 className="text-4xl mb-2 text-purple-400 drop-shadow-lg flex items-center justify-center gap-3">
                            Quem vai jogar?
                            <button 
                                onClick={() => setShowMediatorInfo(true)}
                                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-gray-400 border border-white/20 animate-pulse"
                            >
                                <MessageCircle size={16} />
                            </button>
                        </h1>
                        <p className="text-gray-400 text-sm">Mínimo de 6 jogadores</p>
                    </div>

                    <div className="playzenha-setup-grid">
                        <div className="playzenha-setup-panel">
                          <div className="playzenha-setup-player-list">
                        {playerNames.map((name, i) => (
                             <motion.div key={i} className="playzenha-setup-player-card ultima-noite-setup-player-card" layout>
                                <span className="playzenha-setup-avatar">{name.trim().slice(0, 1).toUpperCase() || i + 1}</span>
                                <input 
                                    className="playzenha-setup-name-input ultima-noite-name-input compact"
                                    placeholder={`Jogador ${i + 1}`}
                                    value={name}
                                    onChange={(e) => updatePlayerName(i, e.target.value)}
                                />
                                <button 
                                    onClick={() => setMediatorIndex(mediatorIndex === i ? null : i)}
                                    className={`playzenha-setup-role-button ${mediatorIndex === i ? 'active' : ''}`}
                                    title="Definir como Mediador"
                                    type="button"
                                >
                                    <MessageCircle className="w-5 h-5 fill-current" />
                                </button>
                                <button onClick={() => removePlayerSlot(i)} className="playzenha-setup-remove-button" type="button" aria-label={`Remover jogador ${i + 1}`}><AlertTriangle size={20}/></button>
                             </motion.div>
                        ))}
                        </div>
                        {playerNames.length < 16 && (
                            <button onClick={addPlayerSlot} className="playzenha-setup-add-button" type="button">
                                + Adicionar Jogador
                            </button>
                        )}
                        </div>

                       {/* Settings Mini-Panel */}
                       <div className="playzenha-setup-panel playzenha-setup-stack">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-400 font-sans">Lobos</span>
                            <div className="flex gap-3 items-center">
                                <button onClick={() => setSettings(s => ({...s, wolvesCount: Math.max(1, s.wolvesCount-1)}))} className="w-8 h-8 rounded bg-white/10">-</button>
                                <span className="font-bold">{settings.wolvesCount}</span>
                                <button onClick={() => setSettings(s => ({...s, wolvesCount: Math.min(3, s.wolvesCount+1)}))} className="w-8 h-8 rounded bg-white/10">+</button>
                            </div>
                        </div>
                        <div className="flex gap-2 mb-2">
                            <button onClick={() => setSettings(s => ({...s, hasAngel: !s.hasAngel}))} className={`flex-1 py-2 rounded text-xs font-bold transition-colors ${settings.hasAngel ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' : 'bg-white/5 text-gray-500'}`}>Anjo</button>
                            <button onClick={() => setSettings(s => ({...s, hasDetective: !s.hasDetective}))} className={`flex-1 py-2 rounded text-xs font-bold transition-colors ${settings.hasDetective ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' : 'bg-white/5 text-gray-500'}`}>Detetive</button>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-400">
                             <span>Discussão: {discussionTime / 60} min</span>
                             <div className="flex gap-2">
                                <button onClick={() => setDiscussionTime(Math.max(60, discussionTime - 60))} className="w-6 h-6 bg-white/10 rounded">-</button>
                                <button onClick={() => setDiscussionTime(Math.min(300, discussionTime + 60))} className="w-6 h-6 bg-white/10 rounded">+</button>
                             </div>
                        </div>
                       </div>
                    </div>

                    <div className="playzenha-game-spacer" />
                    <div className="playzenha-game-action">
                    <GameButton
                        theme="purple"
                        onClick={startGameSetup} 
                        disabled={playerNames.filter(n => n.trim()).length < 6}
                        className="w-full py-4 text-xl shadow-lg shadow-purple-500/20 mb-6"
                    >
                        CONTINUAR
                    </GameButton>
                    </div>
                </motion.div>
            )}

            {/* ROLE DISTRIBUTION START */}
            {phase === 'role-distribution-start' && (
                <motion.div key="role-start" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="playzenha-game-screen h-screen flex flex-col items-center px-6 text-center bg-dark-bg">
                     <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <Users className="w-10 h-10 text-white" />
                     </div>
                     <h2 className="text-2xl text-gray-400 mb-2 font-sans px-4">
                        {settings.hasMediator ? "Mediador, chame" : "Passe o celular para"}
                     </h2>
                     <h1 className="text-4xl xs:text-5xl text-white mb-12 font-bold text-shadow max-w-full break-words px-4 leading-tight">{players[currentPlayerIdx].name}</h1>
                     <GameButton theme="purple" onClick={() => setPhase('role-reveal')} className="w-full max-w-xs">
                        {settings.hasMediator ? "REVELAR FUNÇÃO" : "SOU EU, REVELAR"}
                     </GameButton>
                </motion.div>
            )}

            {/* ROLE REVEAL */}
            {phase === 'role-reveal' && (
                <motion.div key="role-reveal" initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="playzenha-game-screen h-screen flex flex-col items-center px-6 text-center bg-playzenha-surface border-8 border-purple-500/30">
                     <span className="text-6xl mb-6">{ROLES_CONFIG[players[currentPlayerIdx].role].icon}</span>
                     <h2 className="text-xl text-gray-400 font-sans mb-2">
                        {settings.hasMediator ? `Função de ${players[currentPlayerIdx].name}:` : "Seu papel é"}
                     </h2>
                     <h1 className={`text-6xl font-bold mb-8 ${ROLES_CONFIG[players[currentPlayerIdx].role].color} font-sans uppercase tracking-widest`}>
                        {players[currentPlayerIdx].role}
                     </h1>
                     <p className="text-gray-500 mb-12 max-w-xs mx-auto text-sm font-sans leading-relaxed">
                        {players[currentPlayerIdx].role === 'Lobo' && "Elimine os cidadãos à noite sem ser descoberto."}
                        {players[currentPlayerIdx].role === 'Anjo' && "Proteja um jogador a cada noite."}
                        {players[currentPlayerIdx].role === 'Detetive' && "Descubra quem são os lobos investigando jogadores."}
                        {players[currentPlayerIdx].role === 'Cidadão' && "Descubra e vote nos lobos durante o dia."}
                     </p>
                     
                     <div onClick={handleNextRoleReveal} className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center animate-pulse cursor-pointer tap-highlight-transparent active:scale-95 transition-transform">
                        <CheckCircle className="w-8 h-8 text-white" />
                     </div>
                     <span className="text-xs text-gray-600 mt-4 uppercase tracking-widest">
                        {settings.hasMediator ? "Próximo Jogador" : "Toque para esconder"}
                     </span>
                </motion.div>
            )}

            {/* NIGHT INTRO */}
            {phase === 'night-intro' && (
                <motion.div key="night-intro" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-screen bg-dark-bg flex flex-col items-center justify-center">
                    <Moon className="w-32 h-32 text-purple-500 animate-pulse mb-8" />
                    <h1 className="text-4xl text-purple-300 font-light tracking-[0.2em] uppercase">Cidade Dorme...</h1>
                    <p className="text-gray-700 mt-4 font-sans text-sm animate-bounce">Fechem os olhos</p>
                </motion.div>
            )}

            {/* ANGEL PHASE */}
            {phase === 'night-angel' && (
                <ActionPhase 
                    key="angel-phase"
                    role="Anjo" 
                    title="Anjo, acorde..." 
                    subtitle="Quem você quer proteger hoje?"
                    players={players}
                    onAction={handleNightAction}
                    color="cyan"
                />
            )}

            {/* WOLF PHASE */}
            {phase === 'night-wolf' && (
                <ActionPhase 
                    key="wolf-phase"
                    role="Lobo" 
                    title="Lobos, acordem..." 
                    subtitle="Escolham quem será eliminado."
                    players={players.filter(p => p.role !== 'Lobo')}
                    onAction={handleNightAction}
                    color="red"
                />
            )}

            {/* DETECTIVE PHASE */}
            {phase === 'night-detective' && (
                <div key="detective-phase-wrapper" className="h-screen bg-dark-bg flex flex-col px-6 py-12">
                   {!investigatedRole ? (
                       <ActionPhase 
                         key="detective-phase"
                         role="Detetive"
                         title="Detetive..."
                         subtitle="Investigue um suspeito."
                         players={players.filter(p => p.role !== 'Detetive')}
                         onAction={handleNightAction}
                         color="yellow"
                         embedded={true}
                       />
                   ) : (
                       <div className="flex-1 flex flex-col items-center justify-center text-center">
                           <Search className="w-16 h-16 text-yellow-500 mb-6" />
                           <h2 className="text-2xl text-white mb-4">Resultado:</h2>
                           <h1 className={`text-5xl font-bold ${
                               investigatedRole === 'Lobo' ? 'text-red-500' : 'text-green-500'
                           }`}>
                               {investigatedRole === 'Lobo' ? 'É UM LOBO!' : 'INOCENTE'}
                           </h1>
                       </div>
                   )}
                </div>
            )}

            {/* MORNING RESULTS */}
            {phase === 'morning' && (
                <motion.div key="morning" initial={{opacity:0, scale: 0.95}} animate={{opacity:1, scale: 1}} className="playzenha-game-screen h-screen bg-gradient-to-br from-purple-150 via-playzenha-surface to-dark-bg flex flex-col items-center px-6 text-center">
                    <Sun className="ultima-noite-morning-sun w-24 h-24 mb-8 animate-spin-slow" />
                    <h1 className="ultima-noite-morning-title text-4xl font-bold mb-6">O sol nasceu!</h1>
                    
                    <div className="bg-purple/30 w-full p-8 rounded-2xl backdrop-blur-md border border-white/10 mb-8">
                        {players.filter(p => !p.isAlive && p.id === wolfKill && wolfKill !== angelSave).length > 0 ? (
                            <>
                                <Skull className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <p className="text-xl text-gray-200">Infelizmente,</p>
                                <h2 className="text-3xl text-red-400 font-bold mt-2">
                                    {players.find(p => p.id === wolfKill)?.name} morreu.
                                </h2>
                            </>
                        ) : (
                            <>
                                <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
                                <h2 className="text-2xl text-green-300 font-bold">Ninguém morreu!</h2>
                                <p className="text-gray-400 text-sm mt-2">A noite foi tranquila.</p>
                            </>
                        )}
                    </div>

                    <GameButton theme="purple" onClick={startDiscussion} className="w-full max-w-xs shadow-lg shadow-purple-500/20">
                        INICIAR DISCUSSÃO
                    </GameButton>
                </motion.div>
            )}

            {/* DISCUSSION */}
            {phase === 'discussion' && (
                <motion.div key="discussion" className="ultima-noite-discussion-screen playzenha-game-screen h-screen flex flex-col items-center justify-center bg-playzenha-surface px-6 relative">
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                            <svg className="absolute w-full h-full transform -rotate-90">
                                <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                             <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-purple-500 transition-all duration-1000"
                                    strokeDasharray={2 * Math.PI * 120}
                                    strokeDashoffset={2 * Math.PI * 120 * (1 - timeLeft / discussionTime)}
                                />
                            </svg>
                            <div className="text-6xl font-bold font-mono">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
                        </div>

                        <h2 className="text-2xl text-white text-center uppercase tracking-widest">Tempo de debate</h2>
                    </div>
                    
                    <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-center">
                        <GameButton theme="purple" onClick={startVoting} variant="danger" className="w-full max-w-sm">
                            ENCERRAR E VOTAR
                        </GameButton>
                    </div>
                </motion.div>
            )}

            {/* VOTING START/PASS */}
            {phase === 'voting' && (
                <motion.div key="voting" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-screen flex flex-col bg-dark-bg">
                     <div className="flex-1 min-h-[230px] flex flex-col justify-center items-center px-6 pt-24 pb-4 text-center">
                        <div className="w-16 h-16 bg-red-900/30 border-2 border-red-500/50 rounded-full flex items-center justify-center mb-4">
                            <VoteIcon className="w-7 h-7 text-red-500" />
                        </div>
                        <h2 className="text-gray-400 mb-2">Passe o celular para</h2>
                        <h1 className="text-4xl text-white font-bold mb-5">{players[currentPlayerIdx].name}</h1>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Votação Presencial</p>
                     </div>
                     
                     <div className="bg-playzenha-surface p-6 rounded-t-3xl border-t border-purple-500/20 max-h-[60vh] overflow-hidden flex flex-col items-center">
                        <h2 className="text-center text-white mb-4 font-bold text-lg">Quem é o Lobo?</h2>
                        <div className="w-full overflow-y-auto custom-scrollbar space-y-2 pb-20">
                            {players.filter(p => p.isAlive && p.id !== players[currentPlayerIdx].id).map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => handleVoteSelection(p.id)}
                                    className={`w-full p-4 rounded-xl flex items-center justify-between border transition-all group ${
                                        selectedVote === p.id 
                                        ? 'bg-red-500/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                                    }`}
                                >
                                    <div className="flex flex-col items-start">
                                        <span className={`font-bold text-lg ${selectedVote === p.id ? 'text-red-400' : 'text-gray-300'}`}>{p.name}</span>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                                        selectedVote === p.id 
                                        ? 'bg-red-500 border-red-500' 
                                        : 'border-white/20'
                                    }`}>
                                        <div className={`w-2 h-2 bg-white rounded-full ${selectedVote === p.id ? 'opacity-100' : 'opacity-0'}`} />
                                    </div>
                                </button>
                            ))}
                            {/* Skip Vote Option */}
                            <button 
                                onClick={() => handleVoteSelection(-1)} 
                                className={`w-full py-3 text-sm font-bold uppercase tracking-wider transition-colors border rounded-xl ${
                                    selectedVote === -1 ? 'bg-purple-400 text-white border-white/30' : 'text-gray-500 border-transparent hover:bg-white/5'
                                }`}
                            >
                                Pular Voto
                            </button>
                        </div>
                        
                        {/* Confirm Button Floating */}
                        <div className="fixed bottom-6 left-0 right-0 px-6 z-50 flex justify-center">
                             <AnimatePresence>
                                {selectedVote !== null && (
                                    <motion.div
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 100, opacity: 0 }}
                                        className="w-full max-w-sm"
                                    >
                                        <GameButton
                                            theme="purple"
                                            onClick={submitVote} 
                                            variant="danger" 
                                            className="w-full shadow-2xl shadow-red-900/50 border-2 border-red-500"
                                        >
                                            CONFIRMAR VOTO
                                        </GameButton>
                                    </motion.div>
                                )}
                             </AnimatePresence>
                        </div>
                     </div>
                </motion.div>
            )}
            {/* SUSPENSE SCREEN */}
            {phase === 'voting-suspense' && (
                <motion.div key="suspense" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-screen bg-dark-bg flex flex-col items-center justify-center">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="w-32 h-32 bg-red-900/20 rounded-full flex items-center justify-center mb-8"
                    >
                        <VoteIcon className="w-16 h-16 text-red-600" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white tracking-widest uppercase animate-pulse">Contabilizando...</h1>
                </motion.div>
            )}
            {/* VOTING RESULTS */}
            {phase === 'voting-results' && (
                <motion.div key="voting-results" className="ultima-noite-voting-results-screen playzenha-game-screen h-screen bg-dark-bg flex flex-col items-center px-6 relative">
                     <h1 className="text-3xl text-white mb-8 font-bold">Resultado da Votação</h1>
                     
                     <div className="ultima-noite-vote-result-list w-full max-w-sm mb-8 max-h-[50vh] overflow-y-auto custom-scrollbar pb-24">
                         {[...players].sort((a,b) => b.votes - a.votes).map((p) => (
                             <div key={p.id} className={`ultima-noite-vote-result-row flex items-center justify-between p-4 rounded-lg ${!p.isAlive ? 'opacity-50' : ''}`}>
                                 <div className="flex items-center gap-3">
                                     <span className="font-bold text-lg">{p.name}</span>
                                     {!p.isAlive && <Skull size={16} className="text-red-500" />}
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <span className="text-2xl font-bold">{p.votes}</span>
                                     <span className="text-xs text-gray-400 uppercase">votos</span>
                                 </div>
                             </div>
                         ))}
                     </div>
                    
                     <div className="absolute bottom-6 left-0 right-0 px-6 flex gap-4 w-full justify-center">
                         <GameButton theme="purple" onClick={handleNextRoundOrEnd} className="w-full max-w-xs">
                             {getWinner() ? "VER RESULTADO FINAL" : "CONTINUAR O JOGO"}
                         </GameButton>
                     </div>
                </motion.div>
            )}

            {/* GAME OVER */}
            {phase === 'game-over' && (
                <motion.div key="gameover" className={`ultima-noite-game-over-screen playzenha-game-screen h-screen flex flex-col items-center px-6 text-center relative ${winner === 'Lobos' ? 'bg-red-950' : 'bg-blue-950'}`}>
                    {winner === 'Lobos' ? <WolfIcon size={64} /> : <Shield size={64} />}
                    <h2 className="text-xl text-white/70 mt-4 uppercase tracking-[0.3em]">Vencedores</h2>
                    <h1 className="text-6xl font-bold text-white mb-8 drop-shadow-xl">{winner}</h1>
                    
                    <p className="max-w-xs text-gray-300 mb-12 font-sans leading-relaxed">
                        {winner === 'Lobos' 
                            ? "A cidade foi dizimada. Os lobos dominaram tudo." 
                            : "A cidade está segura novamente. Todos os lobos foram eliminados."}
                    </p>

                    <div className="ultima-noite-game-over-actions space-y-4 w-full max-w-xs">
                        <GameButton theme="purple" onClick={() => setPhase('setup')} variant="secondary" className="w-full">
                            JOGAR NOVAMENTE
                        </GameButton>
                        <button onClick={onBackToHome} className="text-sm font-bold opacity-60 hover:opacity-100 transition-opacity">
                            VOLTAR AO MENU
                        </button>
                    </div>
                </motion.div>
            )}

            {/* ERROR MODAL */}
            {showErrorModal && (
                <motion.div 
                    initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                    className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
                    onClick={() => setShowErrorModal(null)}
                >
                     <motion.div 
                        initial={{scale:0.9}} animate={{scale:1}} 
                        className="bg-gray-900 border border-red-500/30 p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl shadow-red-900/20"
                        onClick={e => e.stopPropagation()}
                     >
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Atenção!</h3>
                        <p className="text-gray-300 mb-6">{showErrorModal}</p>
                        <button 
                            onClick={() => setShowErrorModal(null)}
                            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors"
                        >
                            Entendi
                        </button>
                     </motion.div>
                </motion.div>
            )}

            {/* MEDIATOR INFO MODAL */}
            {showMediatorInfo && (
                <motion.div 
                    initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                    className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
                    onClick={() => setShowMediatorInfo(false)}
                >
                     <motion.div 
                        initial={{scale:0.9}} animate={{scale:1}} 
                        className="playzenha-modal-card bg-playzenha-surface border border-purple-500/30 p-6 rounded-3xl w-full max-w-sm text-center shadow-2xl relative overflow-hidden"
                        onClick={e => e.stopPropagation()}
                     >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />
                        
                        <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400 animate-pulse">
                            <MessageCircle size={40} />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-2">O Mediador</h3>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                            <strong className="text-purple-400">É OBRIGATÓRIO</strong> escolher alguém para ser o mediador da partida!
                            <br/><br/>
                            Essa pessoa <strong className="text-white">NÃO JOGA</strong> (não recebe papel de Lobo ou Cidadão). Ela apenas organiza a noite e narra os acontecimentos.
                            <br/><br/>
                            Clique no ícone de balão <MessageCircle size={14} className="inline mx-1"/> ao lado do nome da pessoa para selecioná-la.
                        </p>
                        
                        <button 
                            onClick={() => setShowMediatorInfo(false)}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-purple-900/50"
                        >
                            Entendi, vou escolher!
                        </button>
                     </motion.div>
                </motion.div>
            )}

        </AnimatePresence>
    </div>
  )
}

// --- Subcomponents ---

type ActionPhaseColor = 'red' | 'cyan' | 'yellow' | 'purple'

interface ActionPhaseProps {
    role?: string
    title: string
    subtitle: string
    players: Player[]
    onAction: (targetId: number | null) => void
    color: ActionPhaseColor
    embedded?: boolean
}

const ActionPhase = ({ title, subtitle, players, onAction, color, embedded = false }: ActionPhaseProps) => {
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [isExiting, setIsExiting] = useState(false)

    // Helper to get color classes because dynamic purging fails
    const getColors = () => {
        switch(color) {
            case 'red': return {
                bg: 'bg-red-500', 
                border: 'border-red-500', 
                text: 'text-red-400',
                bgLight: 'bg-red-500/10',
                borderLight: 'border-red-500/30',
                shadow: 'shadow-red-500/20'
            }
            case 'cyan': return {
                bg: 'bg-cyan-500', 
                border: 'border-cyan-500', 
                text: 'text-cyan-400',
                bgLight: 'bg-cyan-500/10',
                borderLight: 'border-cyan-500/30',
                shadow: 'shadow-cyan-500/20'
            }
            case 'yellow': return {
                bg: 'bg-yellow-500', 
                border: 'border-yellow-500', 
                text: 'text-yellow-400',
                bgLight: 'bg-yellow-500/10',
                borderLight: 'border-yellow-500/30',
                shadow: 'shadow-yellow-500/20'
            }
            default: return { // Default (e.g. purple)
                bg: 'bg-purple-500', 
                border: 'border-purple-500', 
                text: 'text-purple-400',
                bgLight: 'bg-purple-500/10',
                borderLight: 'border-purple-500/30',
                shadow: 'shadow-purple-500/20'
            }
        }
    }

    const theme = getColors()

    const handleSelect = (id: number) => {
        if (isExiting) return
        setSelectedId(id)
    }

    const handleConfirm = () => {
        if (isExiting) return
        setIsExiting(true)
        setTimeout(() => {
            onAction(selectedId)
        }, 1000)
    }

    return (
        <motion.div 
            initial={{opacity: 0, y: 20}} 
            animate={{opacity: 1, y: 0}} 
            exit={{opacity: 0}}
            className={embedded ? "" : "h-screen bg-dark-bg flex flex-col pt-12"}
        >
            <div className="px-6 mb-6">
                <div className={`inline-block px-3 py-1 rounded border mb-4 text-xs font-bold uppercase tracking-widest ${theme.text} ${theme.borderLight} ${theme.bgLight}`}>
                    Fase Noturna
                </div>
                <h1 className={`text-4xl font-bold text-white mb-2`}>{title}</h1>
                <p className="text-gray-400">{subtitle}</p>
            </div>

            <div className={`flex-1 overflow-y-auto px-4 pb-8 grid grid-cols-2 gap-3 content-start transition-opacity duration-1000 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
                {players.map((p: Player) => {
                    return p.isAlive && (
                    <button 
                        key={p.id}
                        onClick={() => handleSelect(p.id)}
                        className={`ultima-noite-target-card aspect-square rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all group relative duration-300
                            ${selectedId === p.id 
                                ? `ultima-noite-target-card-selected bg-white/10 ${theme.border} scale-105 shadow-[0_0_15px_rgba(255,255,255,0.1)]`
                                : `ultima-noite-target-card-idle bg-white/5 border-white/10 hover:bg-white/10`
                            }
                        `}
                    >   
                        <div className={`ultima-noite-target-avatar w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg transition-transform ${
                            selectedId === p.id ? `${theme.bg} text-white scale-110` : 'bg-white/5 text-gray-500'
                        }`}>
                            {p.name.charAt(0)}
                        </div>
                        <span className={`font-bold text-sm truncate w-full px-2 text-center ${selectedId === p.id ? 'text-white' : 'text-gray-400'}`}>{p.name}</span>
                    </button>
                    )
                })}
            </div>
            
            {/* Action Bar */}
            <AnimatePresence>
                {selectedId !== null && !isExiting && (
                    <motion.div 
                        initial={{y: 100}} animate={{y: 0}} exit={{y: 100}}
                        className={`absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/90 to-transparent flex justify-center pb-8`}
                    >
                        <GameButton
                            theme="purple"
                            onClick={handleConfirm}
                            variant="primary"
                            className={`ultima-noite-confirm-button w-full max-w-xs shadow-lg ${theme.shadow} border ${theme.borderLight} text-white`}
                        >
                            CONFIRMAR ESCOLHA
                        </GameButton>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

// Icons
const WolfIcon = ({size}: {size:number}) => (
    <div style={{fontSize: size}}>🐺</div>
)
const VoteIcon = ({className}: {className: string}) => (
    <MessageCircle className={className} />
)

export default UltimaNoiteGame
