import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Users,
  Trash2,
  PenSquare,
  UserCircle2,
  ShieldAlert,
  Timer,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw
} from 'lucide-react'
import GameActionButton from '../shared/components/GameActionButton'
import GameButton from '../shared/components/GameButton'
import GameIconButton from '../shared/components/GameIconButton'
import { useQuemSouEuGame } from './hooks/useQuemSouEuGame'

interface QuemSouEuGameProps {
  onBackToGames: () => void
}

const QuemSouEuGame: React.FC<QuemSouEuGameProps> = ({ onBackToGames }) => {
  const {
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
    feedback,
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
    resumeCountdown,
    setCurrentCharacterInput,
    setIsScreenMasked,
    setPendingAction,
    setResumeCountdown,
    showWritingTarget,
    startRoundCountdown,
    startWritingPhase,
    timeLeft,
    updatePlayerName,
    writingOrder,
    writingStep
  } = useQuemSouEuGame()

  return (
    <div className="playzenha-game playzenha-game-quem-sou-eu min-h-screen bg-dark-bg text-white font-sans overflow-hidden relative selection:bg-playzenha-yellow/60 selection:text-dark-bg">
      <nav className="absolute top-0 w-full p-4 flex justify-between items-center z-50">
        <GameIconButton label="Voltar para a biblioteca de jogos" onClick={onBackToGames} className="bg-white/10 hover:bg-white/20">
          <ArrowLeft size={24} />
        </GameIconButton>
        <div className="flex items-center gap-2 rounded-2xl border border-playzenha-yellow/30 bg-playzenha-yellow/10 px-4 py-2 shadow-lg shadow-playzenha-yellow/10">
          <span className="text-2xl">🧠</span>
          <span className="text-xl font-bold tracking-wider text-yellow-100">QUEM SOU EU</span>
        </div>
        <div className="w-10" />
      </nav>

      <AnimatePresence mode="wait">
        {phase === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="playzenha-game-screen pt-24 px-6 h-screen flex flex-col"
          >
            <div className="text-center mb-6 rounded-3xl border border-playzenha-yellow/20 bg-playzenha-yellow/10 p-5 shadow-xl shadow-playzenha-yellow/10">
              <h1 className="text-3xl md:text-4xl font-black mb-2 text-yellow-100">Cadastro de Jogadores</h1>
              <p className="text-gray-400 text-sm">Minimo 2, maximo 10 jogadores</p>
            </div>

            <div className="playzenha-setup-grid">
              <div className="playzenha-setup-panel">
                <div className="playzenha-setup-player-list">
              {playerNames.map((name, idx) => (
                <motion.div key={idx} className="playzenha-setup-player-card" layout>
                  <span className="playzenha-setup-avatar">{name.trim().slice(0, 1).toUpperCase() || idx + 1}</span>
                  <input
                    className="playzenha-setup-name-input compact"
                    placeholder={`Jogador ${idx + 1}`}
                    value={name}
                    onChange={(e) => updatePlayerName(idx, e.target.value)}
                  />
                  <button
                    onClick={() => removePlayerSlot(idx)}
                    className="playzenha-setup-remove-button"
                    type="button"
                    aria-label={`Remover jogador ${idx + 1}`}
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
                </div>

              {playerNames.length < 10 && (
                <button
                  onClick={addPlayerSlot}
                  className="playzenha-setup-add-button"
                >
                  + Adicionar Jogador
                </button>
              )}

              {playerNames.length === 0 && (
                <div className="h-full min-h-32 flex items-center justify-center text-gray-500 text-sm border border-dashed border-white/10 rounded-xl">
                  Nenhum jogador adicionado ainda.
                </div>
              )}
              </div>
            </div>

            {feedback && (
              <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-center text-sm font-bold text-red-100">
                {feedback}
              </div>
            )}

            <div className="playzenha-game-spacer" />
            <div className="playzenha-game-action">
              <GameActionButton action="start" theme="yellow" onClick={startWritingPhase} disabled={!canStartWritingPhase} className="mb-6">
                INICIAR JOGO
              </GameActionButton>
            </div>
          </motion.div>
        )}

        {phase === 'writing-pass' && currentWriter && (
          <motion.div
            key="writing-pass"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="playzenha-game-screen h-screen px-6 flex flex-col items-center text-center bg-dark-bg"
          >
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 animate-pulse border border-white/20">
              <Users className="w-10 h-10 text-white" />
            </div>
            <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Fase Secreta {writingStep + 1}/{writingOrder.length}
            </span>
            <h2 className="text-xl text-gray-400 mb-2 mt-4">Passe o celular para</h2>
            <h1 className="text-5xl text-white mb-12 font-bold tracking-tight px-2 break-words max-w-full">
              {currentWriter.name}
            </h1>
            <GameButton theme="yellow" onClick={showWritingTarget} className="w-full max-w-xs">
              REVELAR
            </GameButton>
          </motion.div>
        )}

        {phase === 'writing-reveal' && currentWriter && currentTarget && (
          <motion.div
            key="writing-reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="playzenha-game-screen h-screen pt-24 px-6 flex flex-col"
          >
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
                Fase Secreta {writingStep + 1}/{writingOrder.length}
              </span>
              <h1 className="text-3xl font-black mt-2 mb-1">{currentWriter.name}, escreva um personagem</h1>
              <p className="text-gray-400 text-sm">Destino revelado apenas para voce.</p>
            </div>

            <div className="bg-playzenha-yellow/10 border border-playzenha-yellow/20 rounded-xl p-4 mb-4 text-center shadow-xl shadow-playzenha-yellow/10">
              <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-2">Voce vai escrever para</p>
              <p className="text-3xl font-black text-playzenha-yellow break-words">{currentTarget.name}</p>
            </div>

            <div className="bg-playzenha-yellow/10 border border-playzenha-yellow/20 rounded-2xl p-4 mb-4">
              <label className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3 block">Personagem / Celebridade</label>
              <input
                value={currentCharacterInput}
                onChange={(e) => setCurrentCharacterInput(e.target.value)}
                placeholder="Ex.: HOMEM ARANHA"
                className="w-full h-14 px-4 rounded-xl bg-white/5 border border-playzenha-yellow/20 focus:border-playzenha-yellow outline-none text-lg"
                autoFocus
              />
            </div>

            {feedback && (
              <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-center text-sm font-bold text-red-100">
                {feedback}
              </div>
            )}

            <GameButton theme="yellow" onClick={confirmCharacter} className="w-full py-4 text-lg mb-6 mt-auto">
              <PenSquare className="w-5 h-5" /> CONFIRMAR
            </GameButton>
          </motion.div>
        )}

        {phase === 'round-intro' && currentGuesser && (
          <motion.div
            key="round-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="playzenha-game-screen h-screen px-6 flex flex-col items-center text-center bg-dark-bg"
          >
            <UserCircle2 className="w-24 h-24 text-playzenha-yellow mb-6" />
            <h1 className="text-4xl md:text-5xl font-black mb-3">Vez de {currentGuesser.name}!</h1>
            <p className="text-gray-300 mb-10">Passe o celular para ele e toque quando estiver pronto.</p>
            <GameButton theme="yellow" onClick={startRoundCountdown} className="w-full max-w-xs">
              ESTOU PRONTO
            </GameButton>
          </motion.div>
        )}

        {phase === 'countdown' && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="playzenha-game-screen h-screen px-6 flex flex-col items-center justify-center text-center bg-dark-bg"
          >
            <p className="text-gray-400 uppercase tracking-[0.2em] mb-6">Posicione o celular na testa</p>
            <motion.div
              key={countdown}
              initial={{ scale: 0.7, opacity: 0.4 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-8xl font-black text-playzenha-yellow"
            >
              {countdown}
            </motion.div>
          </motion.div>
        )}

        {phase === 'guessing' && currentGuesser && currentAssignment && (
          <motion.div
            key="guessing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen relative bg-playzenha-surface"
          >
            <div className={`absolute inset-0 bg-black z-10 ${isScreenMasked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />

            <div className="absolute top-20 left-0 right-0 text-center px-4 z-30">
              <div className="inline-flex items-center gap-2 bg-playzenha-yellow/10 border border-playzenha-yellow/20 rounded-full px-4 py-2 text-sm text-yellow-100">
                <Timer className="w-4 h-4" /> {timeLeft}s
              </div>
            </div>

            <div className="h-full flex flex-col items-center justify-center px-6 pb-32 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">Personagem</p>
              <h1 className="text-5xl md:text-7xl font-black leading-tight break-words max-w-3xl">
                {currentAssignment.character}
              </h1>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 grid grid-cols-2 gap-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
              <button
                onClick={() => {
                  setIsScreenMasked(true)
                  setPendingAction('desistiu')
                }}
                className="h-16 rounded-2xl bg-red-500 text-white font-black text-xl active:scale-95 transition-transform"
              >
                <span className="inline-flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> DESISTIR
                </span>
              </button>
              <button
                onClick={() => {
                  setIsScreenMasked(true)
                  setPendingAction('acertou')
                }}
                className="h-16 rounded-2xl bg-green-500 text-white font-black text-xl active:scale-95 transition-transform"
              >
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> ACERTEI
                </span>
              </button>
            </div>

            <AnimatePresence>
              {pendingAction && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center p-4 bg-black z-20"
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-sm rounded-2xl border border-playzenha-yellow/20 bg-playzenha-surface p-6 text-center"
                  >
                    <h3 className="text-2xl font-black mb-2">Tem certeza?</h3>
                    <p className="text-gray-300 mb-6">
                      Opcao escolhida: <strong className="text-white uppercase">{pendingAction}</strong>
                    </p>
                    <div className="space-y-3">
                    <GameButton theme="yellow" onClick={() => finishRound(pendingAction)} className="w-full">
                        CONFIRMAR
                      </GameButton>
                      <GameButton
                        theme="yellow"
                        onClick={() => {
                          setPendingAction(null)
                          setIsScreenMasked(true)
                          setResumeCountdown(3)
                        }}
                        variant="secondary"
                        className="w-full"
                      >
                        VOLTAR A ADIVINHAR
                      </GameButton>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {resumeCountdown !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-dark-bg flex items-center justify-center z-30"
                >
                  <motion.div
                    key={resumeCountdown}
                    initial={{ scale: 0.8, opacity: 0.6 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center relative z-40"
                  >
                    <p className="text-gray-400 uppercase tracking-[0.2em] mb-4">Retomando em</p>
                    <p className="text-7xl font-black text-playzenha-yellow">{resumeCountdown}</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {phase === 'round-result' && lastRoundResult && (
          <motion.div
            key="round-result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="playzenha-game-screen h-screen px-6 flex flex-col items-center text-center bg-dark-bg"
          >
            <div className="mb-6">
              {lastRoundResult.status === 'acertou' ? (
                <CheckCircle2 className="w-24 h-24 text-green-500" />
              ) : (
                <ShieldAlert className="w-24 h-24 text-red-500" />
              )}
            </div>

            <h2 className="text-gray-400 text-lg uppercase tracking-[0.2em] mb-2">Resultado da Rodada</h2>
            <h1 className="text-4xl font-black mb-6">
              {players.find((p) => p.id === lastRoundResult.playerId)?.name}
            </h1>

            <div className="w-full max-w-sm bg-playzenha-yellow/10 border border-playzenha-yellow/20 rounded-2xl p-6 mb-8 shadow-xl shadow-playzenha-yellow/10">
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <p className={`text-3xl font-black mb-4 ${lastRoundResult.status === 'acertou' ? 'text-green-400' : 'text-red-400'}`}>
                {lastRoundResult.status.toUpperCase()}
              </p>
              <p className="text-gray-400 text-sm mb-1">Personagem</p>
              <p className="text-2xl font-bold mb-4 break-words">{lastRoundResult.character}</p>
              <p className="text-gray-400 text-sm mb-1">Tempo usado</p>
              <p className="text-xl font-mono">{lastRoundResult.timeUsed}s</p>
            </div>

            <GameButton theme="yellow" onClick={nextRoundOrFinal} className="w-full max-w-sm">
              {guessStep < guessOrder.length - 1 ? 'PROXIMO JOGADOR' : 'VER PLACAR FINAL'}
            </GameButton>
          </motion.div>
        )}

        {phase === 'final-results' && (
          <motion.div
            key="final-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="playzenha-game-screen h-screen pt-24 px-6 flex flex-col"
          >
            <div className="text-center mb-6">
              <Trophy className="w-14 h-14 text-playzenha-yellow mx-auto mb-2" />
              <h1 className="text-4xl font-black">Placar Final</h1>
            </div>

            <div className="bg-playzenha-yellow/10 border border-playzenha-yellow/20 rounded-2xl p-4 mb-4 text-center shadow-xl shadow-playzenha-yellow/10">
              {bestPlayers.length > 0 ? (
                <>
                  <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-2">Menor tempo da partida</p>
                  <p className="text-playzenha-yellow text-2xl font-black mb-1">
                    {bestPlayers
                      .map((winner) => players.find((p) => p.id === winner.playerId)?.name)
                      .filter(Boolean)
                      .join(' e ')}
                  </p>
                  <p className="text-white font-mono text-lg">{bestTime}s</p>
                </>
              ) : (
                <p className="text-gray-300">Nenhum jogador acertou nesta partida.</p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 mb-6">
              {orderedResults.map((result) => {
                const player = players.find((p) => p.id === result.playerId)
                const isBest = result.status === 'acertou' && result.timeUsed === bestTime
                return (
                  <div
                    key={result.playerId}
                    className={`rounded-2xl p-4 border ${
                      isBest
                        ? 'bg-playzenha-yellow/10 border-playzenha-yellow/50'
                        : result.status === 'acertou'
                          ? 'bg-green-500/10 border-green-500/40'
                          : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h3 className="font-black text-lg truncate">
                        {player?.name}{isBest ? ' • MELHOR TEMPO' : ''}
                      </h3>
                      <span className={`text-xs uppercase tracking-wider font-bold ${isBest ? 'text-playzenha-yellow' : result.status === 'acertou' ? 'text-green-300' : 'text-red-300'}`}>
                        {result.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 break-words mb-1">Personagem: {result.character}</p>
                    <p className="text-sm text-gray-400">Tempo usado: {result.timeUsed}s</p>
                  </div>
                )
              })}
            </div>

            <div className="space-y-3 pb-8">
              <GameButton theme="yellow" onClick={resetGame} className="w-full py-4 text-lg">
                <RotateCcw className="w-5 h-5" /> JOGAR NOVAMENTE
              </GameButton>
              <GameActionButton action="backToGames" theme="yellow" onClick={onBackToGames} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default QuemSouEuGame
