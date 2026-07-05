import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

interface ImpostorGameProps {
  onBackToHome: () => void
}

type Phase =
  | 'setup'
  | 'role-distribution-start'
  | 'role-reveal'
  | 'game-start'
  | 'discussion'
  | 'voting-intro'
  | 'voting'
  | 'voting-results'

type Role = 'Impostor' | 'Cidadao'

interface Player {
  id: number
  name: string
  role: Role
  isAlive: boolean
  votes: number
}

const THEMES = [
  'Lua', 'Copa do Mundo', 'Praia', 'Netflix', 'Pizza',
  'Carnaval', 'Black Friday', 'Festa Junina', 'Aniversario', 'Trabalho',
  'Escola', 'Hospital', 'Shopping', 'Igreja', 'Cinema', 'Uber', 'Instagram', 'TikTok', 'WhatsApp',
  'Padaria', 'Churrasco', 'Barbearia', 'Salao de Beleza', 'Farmacia', 'Rodoviaria',
  'Metro', 'Elevador', 'Formatura', 'Natal', 'Ano Novo', 'Halloween', 'Videogame', 'YouTube',
  'Spotify', 'Bicicleta', 'Feira', 'Pet Shop', 'Supermercado', 'Academia', 'Aeroporto',
  'Acampamento', 'Parque de Diversoes', 'Museu', 'Teatro', 'Restaurante', 'Lanchonete',
  'Sorveteria', 'Cafeteria', 'Biblioteca', 'Delegacia', 'Tribunal', 'Banco', 'Correios',
  'Posto de Gasolina', 'Oficina', 'Condominio', 'Hotel', 'Pousada', 'Cruzeiro',
  'Praca', 'Floresta', 'Montanha', 'Deserto', 'Ilha', 'Cachoeira', 'Piquenique',
  'Parque Aquatico', 'Karaoke', 'Show', 'Festival', 'Casamento', 'Reuniao',
  'Home Office', 'Delivery', 'Loja de Roupas', 'Transito'
]

const phaseLabel: Record<Phase, string> = {
  setup: 'Configuracao',
  'role-distribution-start': 'Passe o celular',
  'role-reveal': 'Papel secreto',
  'game-start': 'Investigacao',
  discussion: 'Timer',
  'voting-intro': 'Alerta',
  voting: 'Votacao',
  'voting-results': 'Resultado'
}

const shuffleArray = <T,>(arr: T[]): T[] => {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const ImpostorGame: React.FC<ImpostorGameProps> = ({ onBackToHome }) => {
  const [phase, setPhase] = useState<Phase>('setup')
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', ''])
  const [players, setPlayers] = useState<Player[]>([])
  const [revealOrder, setRevealOrder] = useState<number[]>([])
  const [currentRevealStep, setCurrentRevealStep] = useState(0)
  const [theme, setTheme] = useState('')
  const [discussionTime, setDiscussionTime] = useState(180)
  const [timeLeft, setTimeLeft] = useState(0)
  const [selectedVote, setSelectedVote] = useState<number | null>(null)
  const [winner, setWinner] = useState<'Impostor' | 'Cidadaos' | null>(null)

  const currentPlayerForReveal = useMemo(
    () => players.find((player) => player.id === revealOrder[currentRevealStep]) ?? null,
    [players, revealOrder, currentRevealStep]
  )

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (phase === 'discussion' && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
    } else if (phase === 'discussion' && timeLeft === 0) {
      setPhase('voting-intro')
    }

    return () => clearInterval(interval)
  }, [phase, timeLeft])

  const addPlayerSlot = () => {
    if (playerNames.length < 16) setPlayerNames([...playerNames, ''])
  }

  const removePlayerSlot = (idx: number) => {
    if (playerNames.length > 3) {
      setPlayerNames(playerNames.filter((_, i) => i !== idx))
      return
    }

    const newNames = [...playerNames]
    newNames[idx] = ''
    setPlayerNames(newNames)
  }

  const updatePlayerName = (idx: number, val: string) => {
    const newNames = [...playerNames]
    newNames[idx] = val
    setPlayerNames(newNames)
  }

  const startGameSetup = () => {
    const activeNames: string[] = []
    const usedNames = new Set<string>()

    for (const name of playerNames) {
      const trimmed = name.trim()
      if (!trimmed) continue

      if (usedNames.has(trimmed.toUpperCase())) {
        alert(`O nome "${trimmed}" ja esta em uso!`)
        return
      }

      usedNames.add(trimmed.toUpperCase())
      activeNames.push(trimmed.toUpperCase())
    }

    if (activeNames.length < 3) {
      alert('Minimo de 3 jogadores para o Impostor.')
      return
    }

    const impostorIdx = Math.floor(Math.random() * activeNames.length)
    const selectedTheme = THEMES[Math.floor(Math.random() * THEMES.length)]
    const newPlayers: Player[] = activeNames.map((name, i) => ({
      id: i,
      name,
      role: i === impostorIdx ? 'Impostor' : 'Cidadao',
      isAlive: true,
      votes: 0
    }))

    setPlayers(newPlayers)
    setTheme(selectedTheme)
    setRevealOrder(shuffleArray(newPlayers.map((player) => player.id)))
    setCurrentRevealStep(0)
    setPhase('role-distribution-start')
  }

  const handleNextRoleReveal = () => {
    if (currentRevealStep < revealOrder.length - 1) {
      setCurrentRevealStep((prev) => prev + 1)
      setPhase('role-distribution-start')
      return
    }

    setPhase('game-start')
  }

  const startDiscussion = () => {
    setTimeLeft(discussionTime)
    setPhase('discussion')
  }

  const startVoting = () => {
    setPlayers((prev) => prev.map((player) => ({ ...player, votes: 0 })))
    setSelectedVote(null)
    setPhase('voting')
  }

  const submitVote = () => {
    if (selectedVote === null) return
    const votedPlayer = players.find((player) => player.id === selectedVote)
    if (!votedPlayer) return

    setWinner(votedPlayer.role === 'Impostor' ? 'Cidadaos' : 'Impostor')
    setPhase('voting-results')
  }

  const restartGame = () => {
    setPhase('setup')
    setWinner(null)
    setPlayers([])
    setRevealOrder([])
    setCurrentRevealStep(0)
    setSelectedVote(null)
  }

  return (
    <div className="impostor-game">
      <div className="impostor-shell">
        <header className="impostor-topbar">
          <button className="impostor-home-link" type="button" onClick={onBackToHome} aria-label="Voltar para a home">
            <ArrowLeft size={16} />
            Home
          </button>
          <div className="impostor-brand">
            <span className="impostor-brand-mark"><Icon name="mask" /></span>
            Playzenha
          </div>
          <span className="impostor-round-chip">{phaseLabel[phase]}</span>
        </header>

        <AnimatePresence mode="wait">
          {phase === 'setup' && (
            <motion.section key="setup" className="impostor-screen" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="impostor-hero-card">
                <p className="impostor-kicker">Impostor</p>
                <h1>Quem vai jogar?</h1>
                <p>Adicione de 3 a 16 pessoas. Depois e so passar o celular e deixar cada um descobrir seu papel em segredo.</p>
              </div>

              <div className="impostor-setup-grid">
                <div className="impostor-panel">
                  <div className="impostor-player-list">
                    {playerNames.map((name, index) => (
                      <motion.div className="impostor-player-card" key={`player-${index}`} layout>
                        <span className="impostor-avatar">{name.trim().slice(0, 1).toUpperCase() || index + 1}</span>
                        <input
                          className="impostor-name-input compact"
                          value={name}
                          maxLength={18}
                          placeholder={`Jogador ${index + 1}`}
                          onChange={(event) => updatePlayerName(index, event.target.value)}
                        />
                        <button className="impostor-remove-button" type="button" aria-label={`Remover jogador ${index + 1}`} onClick={() => removePlayerSlot(index)}>
                          <Icon name="x" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                  <ImpostorButton variant="ghost" onClick={addPlayerSlot} disabled={playerNames.length >= 16} className="impostor-add-player-button">
                    <Icon name="plus" /> Adicionar jogador
                  </ImpostorButton>
                </div>

                <div className="impostor-panel impostor-stack">
                  <div className="impostor-time-card">
                    <div>
                      <p className="impostor-tiny-label">Discussao</p>
                      <h3>Tempo da rodada</h3>
                    </div>
                    <div className="impostor-stepper">
                      <button className="impostor-icon-button" type="button" onClick={() => setDiscussionTime(Math.max(60, discussionTime - 60))}>
                        <Icon name="minus" />
                      </button>
                      <strong>{discussionTime / 60} min</strong>
                      <button className="impostor-icon-button" type="button" onClick={() => setDiscussionTime(Math.min(900, discussionTime + 60))}>
                        <Icon name="plus" />
                      </button>
                    </div>
                  </div>
                  <p className={playerNames.filter((name) => name.trim()).length >= 3 ? 'impostor-hint' : 'impostor-hint error'}>
                    {playerNames.filter((name) => name.trim()).length >= 3
                      ? `${playerNames.filter((name) => name.trim()).length} jogadores prontos para a investigacao.`
                      : 'Minimo de 3 jogadores para comecar.'}
                  </p>
                </div>
              </div>

              <div className="impostor-spacer" />
              <div className="impostor-sticky-action">
                <ImpostorButton disabled={playerNames.filter((name) => name.trim()).length < 3} onClick={startGameSetup}>Comecar rodada</ImpostorButton>
              </div>
            </motion.section>
          )}

          {phase === 'role-distribution-start' && currentPlayerForReveal && (
            <motion.section key="role-start" className="impostor-screen" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="impostor-hero-card">
                <p className="impostor-kicker">Segredo da vez</p>
                <h2>Passe o celular para</h2>
                <div className="impostor-pass-player-name">{currentPlayerForReveal.name}</div>
                <p>Ninguem mais deve olhar. A proxima tela mostra o papel secreto desta pessoa.</p>
              </div>
              <div className="impostor-pass-illustration">
                <motion.div className="impostor-secret-token" animate={{ rotate: [-4, 3, -4], y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                  <Icon name="eyeOff" />
                </motion.div>
              </div>
              <div className="impostor-spacer" />
              <ImpostorButton onClick={() => setPhase('role-reveal')}>
                <Icon name="eye" /> Revelar papel
              </ImpostorButton>
            </motion.section>
          )}

          {phase === 'role-reveal' && currentPlayerForReveal && (
            <motion.section key="role-reveal" className="impostor-screen impostor-screen-fill" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className={`impostor-secret-card ${currentPlayerForReveal.role === 'Impostor' ? 'impostor' : 'citizen'}`}>
                <div>
                  <div className="impostor-big-icon"><Icon name={currentPlayerForReveal.role === 'Impostor' ? 'mask' : 'card'} /></div>
                  <p className="impostor-kicker role-name">{currentPlayerForReveal.name}</p>
                  {currentPlayerForReveal.role === 'Impostor' ? (
                    <>
                      <h2>Voce e o Impostor</h2>
                      <p className="impostor-secret-copy">Seu objetivo e descobrir o tema ou enganar todo mundo para nao ser votado.</p>
                    </>
                  ) : (
                    <>
                      <h2>Tema da rodada</h2>
                      <div className="impostor-theme-badge">{theme}</div>
                      <p className="impostor-secret-copy theme-help">Encontre quem nao sabe este tema.</p>
                    </>
                  )}
                </div>
                <p className="impostor-hint">Esconda o papel antes de devolver o celular.</p>
              </div>
              <div className="impostor-spacer" />
              <ImpostorButton variant={currentRevealStep === revealOrder.length - 1 ? 'blue' : 'ghost'} onClick={handleNextRoleReveal}>
                {currentRevealStep === revealOrder.length - 1 ? 'Comecar investigacao' : 'Esconder e passar'}
              </ImpostorButton>
            </motion.section>
          )}

          {phase === 'game-start' && (
            <motion.section key="game-start" className="impostor-screen impostor-screen-fill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="impostor-secret-card">
                <div>
                  <div className="impostor-big-icon"><Icon name="alert" /></div>
                  <p className="impostor-kicker role-name">Agora e conversa</p>
                  <h1>Investiguem!</h1>
                  <p className="impostor-secret-copy">Facam perguntas sobre o tema. O Impostor vai tentar parecer confiante sem saber do que todo mundo esta falando.</p>
                </div>
                <p className="impostor-hint">Dica: perguntas especificas deixam a mentira mais dificil.</p>
              </div>
              <div className="impostor-spacer" />
              <ImpostorButton onClick={startDiscussion}>Iniciar timer</ImpostorButton>
            </motion.section>
          )}

          {phase === 'discussion' && (
            <motion.section key="discussion" className="impostor-screen" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="impostor-hero-card">
                <p className="impostor-kicker">Discussao</p>
                <h2>{timeLeft <= 30 ? 'Pressao subindo' : 'Facam perguntas'}</h2>
                <p>O grupo tenta achar quem esta fingindo. O Impostor escuta, improvisa e tenta escapar.</p>
              </div>
              <div className="impostor-timer-wrap">
                <div
                  className="impostor-timer-ring"
                  style={{
                    '--progress': Math.max(0, timeLeft / discussionTime),
                    '--ring-color': timeLeft <= 30 ? 'var(--impostor-danger)' : 'var(--impostor-yellow)'
                  } as React.CSSProperties}
                >
                  <div>
                    <div className="impostor-timer-value">
                      {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
                    </div>
                    <p>{timeLeft <= 30 ? 'Ultimos segundos' : 'Tempo restante'}</p>
                  </div>
                </div>
              </div>
              <div className="impostor-split">
                <ImpostorButton variant="ghost" onClick={() => { setTimeLeft((prev) => prev + 60); setDiscussionTime((prev) => prev + 60) }}>+1 minuto</ImpostorButton>
                <ImpostorButton variant="danger" onClick={() => setPhase('voting-intro')}>Votar agora</ImpostorButton>
              </div>
            </motion.section>
          )}

          {phase === 'voting-intro' && (
            <motion.section key="voting-intro" className="impostor-screen impostor-screen-fill" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="impostor-secret-card impostor">
                <div>
                  <div className="impostor-big-icon"><Icon name="vote" /></div>
                  <p className="impostor-kicker role-name">Momento decisivo</p>
                  <h1>Hora de votar</h1>
                  <p>Quem voces acham que e o Impostor? Escolham a pessoa mais suspeita do grupo.</p>
                </div>
                <p className="impostor-hint">Selecione quem recebeu mais votos na conversa.</p>
              </div>
              <div className="impostor-spacer" />
              <ImpostorButton variant="danger" onClick={startVoting}>Abrir votacao</ImpostorButton>
            </motion.section>
          )}

          {phase === 'voting' && (
            <motion.section key="voting" className="impostor-screen" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="impostor-hero-card">
                <p className="impostor-kicker">Votacao</p>
                <h2>Quem recebeu mais votos?</h2>
                <p>Toque no jogador escolhido pelo grupo. O card vermelho marca o principal suspeito.</p>
              </div>
              <div className="impostor-vote-grid">
                {players.map((player) => (
                  <button className={`impostor-vote-card ${selectedVote === player.id ? 'selected' : ''}`} key={player.id} type="button" onClick={() => setSelectedVote(player.id)}>
                    <span className="impostor-avatar">{player.name.slice(0, 1)}</span>
                    <strong>{player.name}</strong>
                    {selectedVote === player.id && <Icon name="alert" />}
                  </button>
                ))}
              </div>
              <div className="impostor-spacer" />
              <ImpostorButton variant="danger" disabled={selectedVote === null} onClick={submitVote}>Confirmar voto</ImpostorButton>
            </motion.section>
          )}

          {phase === 'voting-results' && winner && (
            <motion.section key="results" className="impostor-screen impostor-screen-fill" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className={`impostor-secret-card impostor-result-card ${winner === 'Cidadaos' ? 'citizens' : 'impostor-win'}`}>
                <div>
                  <div className="impostor-big-icon"><Icon name={winner === 'Cidadaos' ? 'crown' : 'mask'} /></div>
                  <p className="impostor-kicker role-name">Resultado</p>
                  <h1>{winner === 'Cidadaos' ? 'Cidadaos venceram' : 'Impostor venceu'}</h1>
                  <p>{winner === 'Cidadaos' ? 'O grupo encontrou quem estava mentindo.' : 'O Impostor escapou e enganou a resenha.'}</p>
                </div>
                <div className="impostor-facts">
                  <div className="impostor-fact"><span className="impostor-tiny-label">Impostor</span><strong>{players.find((player) => player.role === 'Impostor')?.name}</strong></div>
                  <div className="impostor-fact"><span className="impostor-tiny-label">Tema</span><strong>{theme}</strong></div>
                </div>
              </div>
              <div className="impostor-result-actions">
                <ImpostorButton variant={winner === 'Cidadaos' ? 'success' : 'danger'} onClick={restartGame}>Jogar de novo</ImpostorButton>
                <ImpostorButton variant="ghost" onClick={onBackToHome}>Voltar para inicio</ImpostorButton>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

interface IconProps {
  name: 'eye' | 'eyeOff' | 'card' | 'alert' | 'vote' | 'crown' | 'mask' | 'plus' | 'minus' | 'x'
}

const Icon: React.FC<IconProps> = ({ name }) => {
  const paths: Record<IconProps['name'], React.ReactNode> = {
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><path d="M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" /></>,
    eyeOff: <><path d="m3 3 18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.2 5.5A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3.1 4.2" /><path d="M6.2 6.8C3.5 8.6 2 12 2 12s3.5 7 10 7c1.6 0 3-.4 4.2-1" /></>,
    card: <><rect x="5" y="3" width="14" height="18" rx="3" /><path d="M9 8h6M9 12h4" /></>,
    alert: <><path d="M12 3 2 21h20L12 3Z" /><path d="M12 9v5M12 17h.01" /></>,
    vote: <><path d="M4 14h16v7H4z" /><path d="M8 14V8l4-5 4 5v6" /><path d="M9 18h6" /></>,
    crown: <><path d="m3 7 5 5 4-8 4 8 5-5-2 12H5L3 7Z" /><path d="M5 19h14" /></>,
    mask: <><path d="M4 9c2-2 5-3 8-3s6 1 8 3v3c0 4-3.5 7-8 7s-8-3-8-7V9Z" /><path d="M8 12h.01M16 12h.01" /><path d="M9 16c2 1 4 1 6 0" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    x: <><path d="M6 6l12 12M18 6 6 18" /></>
  }

  return (
    <span className="impostor-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">{paths[name]}</svg>
    </span>
  )
}

interface ImpostorButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'blue' | 'danger' | 'ghost' | 'success'
  disabled?: boolean
  onClick?: () => void
  className?: string
}

const ImpostorButton: React.FC<ImpostorButtonProps> = ({ children, variant = 'primary', disabled, onClick, className = '' }) => (
  <button className={`impostor-game-button ${variant} ${disabled ? 'disabled' : ''} ${className}`} disabled={disabled} onClick={onClick} type="button">
    {children}
  </button>
)

export default ImpostorGame
