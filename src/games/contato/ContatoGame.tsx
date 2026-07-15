import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  Clock,
  Eye,
  EyeOff,
  Gavel,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Users
} from 'lucide-react'
import GameActionButton from '../shared/components/GameActionButton'
import GameButton from '../shared/components/GameButton'
import GameIconButton from '../shared/components/GameIconButton'
import { useContatoGame } from './hooks/useContatoGame'

interface ContatoGameProps {
  onBackToHome: () => void
  onBackToGames: () => void
  words: string[]
}

const formatElapsedTime = (seconds: number | null) => {
  if (seconds === null) {
    return 'Tempo não registrado'
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes === 0) {
    return `${remainingSeconds}s`
  }

  return `${minutes}min ${remainingSeconds.toString().padStart(2, '0')}s`
}

const ContatoGame: React.FC<ContatoGameProps> = ({ onBackToGames, onBackToHome, words }) => {
  const {
    canStartGame,
    currentWord,
    feedback,
    finishRound,
    goToNextRound,
    guessers,
    judge,
    maskedWord,
    phase,
    playerNames,
    resetMatch,
    revealNextLetter,
    revealElapsedSeconds,
    revealedLetters,
    revealWholeWord,
    rotateJudge,
    round,
    setPhase,
    startGame,
    startRoundPlay,
    toggleRotateJudge,
    updatePlayerName
  } = useContatoGame(words)

  return (
    <div className="playzenha-game playzenha-game-contato min-h-screen bg-dark-bg text-white font-sans overflow-hidden relative selection:bg-emerald-400/60 selection:text-white">
      <nav className="absolute top-0 w-full p-4 flex justify-between items-center z-50">
        <GameIconButton label="Voltar para a home" onClick={onBackToHome} className="bg-white/10 hover:bg-white/20">
          <ArrowLeft size={24} />
        </GameIconButton>
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 shadow-lg shadow-emerald-400/10">
          <Smartphone className="h-6 w-6 text-emerald-100" />
          <span className="text-xl font-bold tracking-wider text-emerald-100">CONTATO</span>
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
            <div className="text-center mb-6 rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-5 shadow-xl shadow-emerald-400/10">
              <h1 className="text-3xl md:text-4xl mb-2 font-bold text-emerald-100">Cadastro de Jogadores</h1>
              <p className="text-gray-400 text-sm">Jogo para exatamente 3 pessoas</p>
            </div>

            <div className="playzenha-setup-grid">
              <div className="playzenha-setup-panel">
                <div className="playzenha-setup-player-list">
                  {playerNames.map((name, index) => (
                    <motion.div key={index} className="playzenha-setup-player-card no-remove" layout>
                      <span className="playzenha-setup-avatar">{name.trim().slice(0, 1).toUpperCase() || index + 1}</span>
                      <input
                        value={name}
                        onChange={(event) => updatePlayerName(index, event.target.value)}
                        className="playzenha-setup-name-input compact"
                        placeholder={`Jogador ${index + 1}`}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="playzenha-setup-panel playzenha-setup-stack">
                <div className="playzenha-setup-option-card">
                  <div>
                    <p className="playzenha-setup-tiny-label">Rodada</p>
                    <h3>Juiz rotativo</h3>
                  </div>
                  <button
                    onClick={toggleRotateJudge}
                    className={`playzenha-setup-toggle ${rotateJudge ? 'active' : ''}`}
                    aria-label="Alternar juiz rotativo"
                  >
                    <span />
                  </button>
                </div>
                <p className="playzenha-setup-hint">
                  Ativado: o juiz muda automaticamente a cada rodada.
                </p>
              </div>
            </div>

            {feedback && (
              <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-center text-sm font-bold text-red-100">
                {feedback}
              </div>
            )}

            <div className="playzenha-game-spacer" />
            <div className="playzenha-game-action">
              <GameActionButton action="start" theme="green" onClick={startGame} disabled={!canStartGame} className="mb-6">
                COMEÇAR
              </GameActionButton>
            </div>
          </motion.div>
        )}

        {phase === 'judge-draw' && judge && (
          <motion.div
            key="judge-draw"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="playzenha-game-screen h-screen px-6 flex flex-col items-center text-center bg-dark-bg"
          >
            <div className="text-sm uppercase tracking-[0.25em] text-gray-500 mb-3">Rodada {round}</div>
            <h1 className="text-4xl font-black mb-8">Sorteio Concluído</h1>

            <div className="w-full max-w-md bg-emerald-400/10 border border-emerald-300/20 rounded-2xl p-6 mb-8 shadow-xl shadow-emerald-400/10">
              <div className="flex items-center gap-3 justify-center mb-4 text-emerald-300">
                <ShieldCheck className="w-6 h-6" />
                <span className="font-bold uppercase tracking-wider">Juiz</span>
              </div>
              <p className="text-4xl font-black mb-6 break-words">{judge.name}</p>

              <div className="h-px bg-white/10 mb-5" />

              <div className="flex items-center gap-3 justify-center mb-4 text-emerald-300">
                <Users className="w-6 h-6" />
                <span className="font-bold uppercase tracking-wider">Adivinhadores</span>
              </div>
              <p className="text-lg text-gray-200 break-words">
                {guessers.map((player) => player.name).join(' e ')}
              </p>
            </div>

            <GameButton theme="green" onClick={() => setPhase('judge-word-start')} className="w-full max-w-xs">
              INICIAR RODADA
            </GameButton>
          </motion.div>
        )}

        {phase === 'judge-word-start' && judge && (
          <motion.div
            key="judge-word-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="playzenha-game-screen h-screen px-6 flex flex-col items-center text-center bg-dark-bg"
          >
            <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-6 animate-pulse">
              <Gavel className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-gray-400 text-xl mb-2">Passe o celular para</h2>
            <h1 className="text-5xl font-black mb-10 break-words">{judge.name}</h1>
            <GameButton theme="green" onClick={() => setPhase('judge-word-reveal')} className="w-full max-w-xs">
              REVELAR PALAVRA
            </GameButton>
          </motion.div>
        )}

        {phase === 'judge-word-reveal' && judge && (
          <motion.div
            key="judge-word-reveal"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="playzenha-game-screen h-screen px-6 flex flex-col items-center text-center bg-playzenha-surface"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-gray-500 mb-4">Somente o juiz vê</p>
            <h1 className="text-6xl md:text-7xl font-black text-emerald-300 mb-8">{currentWord}</h1>
            <p className="text-gray-300 max-w-md mb-10">
              Memorize a palavra e devolva o celular para os adivinhadores.
            </p>
            <GameButton theme="green" onClick={startRoundPlay} className="w-full max-w-xs">
              ENTENDI, PASSAR CELULAR
            </GameButton>
          </motion.div>
        )}

        {phase === 'round-play' && judge && (
          <motion.div
            key="round-play"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="playzenha-game-screen h-screen pt-24 px-6 flex flex-col"
          >
            <div className="text-center mb-5">
              <h1 className="text-3xl font-black mb-2">Contato</h1>
              <p className="text-gray-400 text-sm">Juiz da rodada: {judge.name}</p>
            </div>

            <div className="bg-emerald-400/10 border border-emerald-300/20 rounded-2xl p-6 text-center mb-6 shadow-xl shadow-emerald-400/10">
              <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-3">Palavra liberada</p>
              <p className="text-4xl md:text-5xl font-black tracking-[0.25em] text-emerald-300 break-all">{maskedWord}</p>
              <p className="text-gray-500 text-xs mt-4">
                Letras liberadas: {revealedLetters}/{currentWord.length}
              </p>
            </div>

            {feedback && (
              <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4 text-center text-gray-200">
                {feedback}
              </div>
            )}

            <div className="space-y-3 mt-auto pb-8">
              <GameButton
                theme="green"
                onClick={revealNextLetter}
                variant="secondary"
                disabled={revealedLetters >= currentWord.length}
                className="w-full py-4 text-lg"
              >
                <Eye className="w-5 h-5" /> REVELAR PRÓXIMA LETRA
              </GameButton>
              <GameButton
                theme="green"
                onClick={revealWholeWord}
                variant="primary"
                disabled={revealedLetters >= currentWord.length}
                className="w-full py-4 text-lg"
              >
                <EyeOff className="w-5 h-5" /> REVELAR PALAVRA INTEIRA
              </GameButton>
              <GameButton
                theme="green"
                onClick={finishRound}
                variant="primary"
                disabled={revealedLetters < currentWord.length}
                className="w-full py-4 text-lg"
              >
                VER RESULTADO
              </GameButton>
            </div>
          </motion.div>
        )}

        {phase === 'round-result' && judge && (
          <motion.div
            key="round-result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="playzenha-game-screen h-screen px-6 flex flex-col items-center text-center bg-playzenha-surface"
          >
            <div className="mb-6">
              <Clock className="w-24 h-24 text-emerald-300 mx-auto" />
            </div>

            <h2 className="text-gray-400 text-xl uppercase tracking-widest mb-2">Resultado da Rodada</h2>
            <h1 className="text-5xl font-black mb-8">{currentWord}</h1>

            <div className="w-full max-w-sm bg-emerald-400/10 border border-emerald-300/20 rounded-2xl p-6 mb-8 shadow-xl shadow-emerald-400/10">
              <p className="text-gray-400 text-sm mb-1">Palavra da rodada</p>
              <p className="text-3xl font-black text-emerald-300">{currentWord}</p>
              <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-gray-400 text-sm mb-1">Tempo até revelar tudo</p>
                <p className="text-2xl font-black text-white">{formatElapsedTime(revealElapsedSeconds)}</p>
              </div>
              <p className="text-gray-500 text-xs mt-3">Juiz: {judge.name}</p>
            </div>

            <div className="w-full max-w-sm space-y-3">
              <GameButton theme="green" onClick={goToNextRound} className="w-full">
                <RotateCcw className="w-5 h-5" /> PRÓXIMA RODADA
              </GameButton>
              <GameButton theme="green" onClick={resetMatch} variant="secondary" className="w-full">
                NOVA PARTIDA
              </GameButton>
              <GameActionButton action="backToGames" theme="green" onClick={onBackToGames} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ContatoGame
