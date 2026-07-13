import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Users,
  ShieldCheck,
  RotateCcw,
  Eye,
  EyeOff,
  Gavel,
  Crown
} from 'lucide-react'
import GameButton from '../shared/components/GameButton'

interface ContatoGameProps {
  onBackToHome: () => void
}

type Phase =
  | 'setup'
  | 'judge-draw'
  | 'judge-word-start'
  | 'judge-word-reveal'
  | 'round-play'
  | 'round-result'

interface Player {
  id: number
  name: string
}

const WORD_BANK = [
  'BACIA',
  'ABACAXI',
  'PIPOCA',
  'CADEIRA',
  'GIRAFA',
  'BICICLETA',
  'CHUVEIRO',
  'ESTOJO',
  'TOMATE',
  'SORVETE',
  'FUTEBOL',
  'LANTERNA',
  'CACHORRO',
  'JANELA',
  'VIOLAO',
  'PANELA',
  'TRAVESSEIRO',
  'MELANCIA',
  'PIRULITO',
  'LIVRARIA'
]

const pickRandomWord = (exclude?: string): string => {
  const options = WORD_BANK.filter((word) => word !== exclude)
  return options[Math.floor(Math.random() * options.length)]
}

const ContatoGame: React.FC<ContatoGameProps> = ({ onBackToHome }) => {
  const [phase, setPhase] = useState<Phase>('setup')
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', ''])
  const [players, setPlayers] = useState<Player[]>([])

  const [round, setRound] = useState(1)
  const [rotateJudge, setRotateJudge] = useState(true)
  const [judgeId, setJudgeId] = useState<number | null>(null)

  const [currentWord, setCurrentWord] = useState('')
  const [revealedLetters, setRevealedLetters] = useState(1)
  const [lastWord, setLastWord] = useState<string>('')

  const [roundWinner, setRoundWinner] = useState<'Adivinhadores' | 'Juiz' | null>(null)
  const [feedback, setFeedback] = useState('')

  const judge = useMemo(() => players.find((p) => p.id === judgeId) ?? null, [players, judgeId])
  const guessers = useMemo(() => players.filter((p) => p.id !== judgeId), [players, judgeId])

  const maskedWord = useMemo(() => {
    if (!currentWord) return ''
    return currentWord
      .split('')
      .map((char, idx) => (idx < revealedLetters ? char : '_'))
      .join(' ')
  }, [currentWord, revealedLetters])

  const filledPlayerCount = playerNames.filter((name) => name.trim()).length
  const canStartGame = filledPlayerCount === 3

  const updatePlayerName = (idx: number, value: string) => {
    const newNames = [...playerNames]
    newNames[idx] = value
    setPlayerNames(newNames)
  }

  const startNewRound = (basePlayers: Player[], nextRound: number, forcedJudgeId?: number) => {
    const nextJudge =
      typeof forcedJudgeId === 'number'
        ? forcedJudgeId
        : basePlayers[Math.floor(Math.random() * basePlayers.length)].id

    const nextWord = pickRandomWord(lastWord || undefined)

    setJudgeId(nextJudge)
    setCurrentWord(nextWord)
    setLastWord(nextWord)
    setRevealedLetters(1)
    setRoundWinner(null)
    setFeedback('')
    setRound(nextRound)
    setPhase('judge-draw')
  }

  const startGame = () => {
    const cleanedNames = playerNames.map((name) => name.trim())

    if (cleanedNames.some((name) => !name)) {
      alert('Preencha os 3 nomes para começar.')
      return
    }

    const unique = new Set(cleanedNames.map((name) => name.toUpperCase()))
    if (unique.size !== 3) {
      alert('Os 3 nomes precisam ser diferentes.')
      return
    }

    const newPlayers: Player[] = cleanedNames.map((name, idx) => ({
      id: idx,
      name: name.toUpperCase()
    }))

    setPlayers(newPlayers)
    startNewRound(newPlayers, 1)
  }

  const revealNextLetter = () => {
    if (revealedLetters >= currentWord.length) {
      setFeedback('A palavra inteira ja foi revelada.')
      return
    }

    setRevealedLetters((prev) => {
      const next = Math.min(prev + 1, currentWord.length)
      if (next === currentWord.length) {
        setFeedback('Todas as letras foram liberadas!')
      } else {
        setFeedback('Proxima letra liberada!')
      }
      return next
    })
  }

  const revealWholeWord = () => {
    setRevealedLetters(currentWord.length)
    setFeedback('Palavra inteira revelada!')
  }

  const goToNextRound = () => {
    if (!judge) return

    const forcedJudgeId = rotateJudge
      ? players[(players.findIndex((p) => p.id === judge.id) + 1) % players.length].id
      : undefined

    startNewRound(players, round + 1, forcedJudgeId)
  }

  const resetMatch = () => {
    setPhase('setup')
    setPlayers([])
    setRound(1)
    setJudgeId(null)
    setCurrentWord('')
    setRevealedLetters(1)
    setRoundWinner(null)
    setFeedback('')
  }

  return (
    <div className="playzenha-game playzenha-game-contato min-h-screen bg-dark-bg text-white font-sans overflow-hidden relative selection:bg-emerald-400/60 selection:text-white">
      <nav className="absolute top-0 w-full p-4 flex justify-between items-center z-50">
        <button onClick={onBackToHome} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 shadow-lg shadow-emerald-400/10">
          <span className="text-2xl">📱</span>
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
              {playerNames.map((name, i) => (
                <motion.div key={i} className="playzenha-setup-player-card no-remove" layout>
                  <span className="playzenha-setup-avatar">{name.trim().slice(0, 1).toUpperCase() || i + 1}</span>
                  <input
                    value={name}
                    onChange={(e) => updatePlayerName(i, e.target.value)}
                    className="playzenha-setup-name-input compact"
                    placeholder={`Jogador ${i + 1}`}
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
                  onClick={() => setRotateJudge((prev) => !prev)}
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

            <div className="playzenha-game-spacer" />
            <div className="playzenha-game-action">
            <GameButton theme="green" onClick={startGame} disabled={!canStartGame} className="w-full py-4 text-xl mb-6">
              COMEÇAR
            </GameButton>
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
            <GameButton theme="green" onClick={() => setPhase('round-play')} className="w-full max-w-xs">
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
                <Eye className="w-5 h-5" /> REVELAR PROXIMA LETRA
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
              <GameButton theme="green" onClick={() => { setRoundWinner('Adivinhadores'); setPhase('round-result') }} variant="primary" className="w-full py-4 text-lg">
                FINALIZAR RODADA
              </GameButton>
            </div>
          </motion.div>
        )}

        {phase === 'round-result' && judge && roundWinner && (
          <motion.div
            key="round-result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="playzenha-game-screen h-screen px-6 flex flex-col items-center text-center bg-playzenha-surface"
          >
            <div className="mb-6">
              {roundWinner === 'Adivinhadores' ? (
                <Crown className="w-24 h-24 text-emerald-300 mx-auto" />
              ) : (
                <ShieldCheck className="w-24 h-24 text-emerald-300 mx-auto" />
              )}
            </div>

            <h2 className="text-gray-400 text-xl uppercase tracking-widest mb-2">Vencedor da Rodada</h2>
            <h1 className="text-5xl font-black mb-8">{roundWinner}</h1>

            <div className="w-full max-w-sm bg-emerald-400/10 border border-emerald-300/20 rounded-2xl p-6 mb-8 shadow-xl shadow-emerald-400/10">
              <p className="text-gray-400 text-sm mb-1">Palavra da rodada</p>
              <p className="text-3xl font-black text-emerald-300">{currentWord}</p>
              <p className="text-gray-500 text-xs mt-3">Juiz: {judge.name}</p>
            </div>

            <div className="w-full max-w-sm space-y-3">
              <GameButton theme="green" onClick={goToNextRound} className="w-full">
                <RotateCcw className="w-5 h-5" /> PRÓXIMA RODADA
              </GameButton>
              <GameButton theme="green" onClick={resetMatch} variant="secondary" className="w-full">
                NOVA PARTIDA
              </GameButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ContatoGame
