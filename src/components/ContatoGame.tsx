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
import GameButton from './GameButton'

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
    <div className="min-h-screen bg-gray-900 text-white font-sans overflow-hidden relative selection:bg-playzenha-blue/60 selection:text-white">
      <nav className="absolute top-0 w-full p-4 flex justify-between items-center z-50">
        <button onClick={onBackToHome} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">📱</span>
          <span className="text-xl font-bold tracking-wider">CONTATO</span>
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
            className="pt-24 px-6 h-screen flex flex-col"
          >
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl mb-2 font-bold">Cadastro de Jogadores</h1>
              <p className="text-gray-400 text-sm">Jogo para exatamente 3 pessoas</p>
            </div>

            <div className="space-y-3 mb-6">
              {playerNames.map((name, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 shrink-0 flex items-center justify-center font-bold text-gray-400">
                    {i + 1}
                  </div>
                  <input
                    value={name}
                    onChange={(e) => updatePlayerName(i, e.target.value)}
                    className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-4 text-base focus:border-playzenha-blue outline-none transition-colors text-white h-12"
                    placeholder={`Nome do Jogador ${i + 1}`}
                  />
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-200 font-medium">Juiz rotativo por rodada</span>
                <button
                  onClick={() => setRotateJudge((prev) => !prev)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors ${
                    rotateJudge ? 'bg-playzenha-blue' : 'bg-white/20'
                  }`}
                  aria-label="Alternar juiz rotativo"
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white transition-transform ${
                      rotateJudge ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Ativado: o juiz muda automaticamente a cada rodada.
              </p>
            </div>

            <GameButton onClick={startGame} className="w-full py-4 text-xl mb-6">
              COMEÇAR
            </GameButton>
          </motion.div>
        )}

        {phase === 'judge-draw' && judge && (
          <motion.div
            key="judge-draw"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen px-6 flex flex-col items-center justify-center text-center bg-black"
          >
            <div className="text-sm uppercase tracking-[0.25em] text-gray-500 mb-3">Rodada {round}</div>
            <h1 className="text-4xl font-black mb-8">Sorteio Concluído</h1>

            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-3 justify-center mb-4 text-playzenha-yellow">
                <ShieldCheck className="w-6 h-6" />
                <span className="font-bold uppercase tracking-wider">Juiz</span>
              </div>
              <p className="text-4xl font-black mb-6 break-words">{judge.name}</p>

              <div className="h-px bg-white/10 mb-5" />

              <div className="flex items-center gap-3 justify-center mb-4 text-playzenha-blue">
                <Users className="w-6 h-6" />
                <span className="font-bold uppercase tracking-wider">Adivinhadores</span>
              </div>
              <p className="text-lg text-gray-200 break-words">
                {guessers.map((player) => player.name).join(' e ')}
              </p>
            </div>

            <GameButton onClick={() => setPhase('judge-word-start')} className="w-full max-w-xs">
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
            className="h-screen px-6 flex flex-col items-center justify-center text-center bg-black"
          >
            <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-6 animate-pulse">
              <Gavel className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-gray-400 text-xl mb-2">Passe o celular para</h2>
            <h1 className="text-5xl font-black mb-10 break-words">{judge.name}</h1>
            <GameButton onClick={() => setPhase('judge-word-reveal')} className="w-full max-w-xs">
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
            className="h-screen px-6 flex flex-col items-center justify-center text-center bg-gray-900"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-gray-500 mb-4">Somente o juiz vê</p>
            <h1 className="text-6xl md:text-7xl font-black text-playzenha-yellow mb-8">{currentWord}</h1>
            <p className="text-gray-300 max-w-md mb-10">
              Memorize a palavra e devolva o celular para os adivinhadores.
            </p>
            <GameButton onClick={() => setPhase('round-play')} className="w-full max-w-xs">
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
            className="h-screen pt-24 px-6 flex flex-col"
          >
            <div className="text-center mb-5">
              <h1 className="text-3xl font-black mb-2">Contato</h1>
              <p className="text-gray-400 text-sm">Juiz da rodada: {judge.name}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center mb-6">
              <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-3">Palavra liberada</p>
              <p className="text-4xl md:text-5xl font-black tracking-[0.25em] text-playzenha-blue break-all">{maskedWord}</p>
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
                onClick={revealNextLetter}
                variant="secondary"
                disabled={revealedLetters >= currentWord.length}
                className="w-full py-4 text-lg"
              >
                <Eye className="w-5 h-5" /> REVELAR PROXIMA LETRA
              </GameButton>
              <GameButton
                onClick={revealWholeWord}
                variant="primary"
                disabled={revealedLetters >= currentWord.length}
                className="w-full py-4 text-lg"
              >
                <EyeOff className="w-5 h-5" /> REVELAR PALAVRA INTEIRA
              </GameButton>
              <GameButton onClick={() => { setRoundWinner('Adivinhadores'); setPhase('round-result') }} variant="primary" className="w-full py-4 text-lg">
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
            className="h-screen px-6 flex flex-col items-center justify-center text-center bg-gray-900"
          >
            <div className="mb-6">
              {roundWinner === 'Adivinhadores' ? (
                <Crown className="w-24 h-24 text-playzenha-yellow mx-auto" />
              ) : (
                <ShieldCheck className="w-24 h-24 text-playzenha-blue mx-auto" />
              )}
            </div>

            <h2 className="text-gray-400 text-xl uppercase tracking-widest mb-2">Vencedor da Rodada</h2>
            <h1 className="text-5xl font-black mb-8">{roundWinner}</h1>

            <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <p className="text-gray-400 text-sm mb-1">Palavra da rodada</p>
              <p className="text-3xl font-black text-playzenha-yellow">{currentWord}</p>
              <p className="text-gray-500 text-xs mt-3">Juiz: {judge.name}</p>
            </div>

            <div className="w-full max-w-sm space-y-3">
              <GameButton onClick={goToNextRound} className="w-full">
                <RotateCcw className="w-5 h-5" /> PRÓXIMA RODADA
              </GameButton>
              <GameButton onClick={resetMatch} variant="secondary" className="w-full">
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
