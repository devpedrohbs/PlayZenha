import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, ChevronRight, Eye, EyeOff, MessageCircle, Plus, RotateCcw, Vote, X } from 'lucide-react'
import GameActionButton from '../shared/components/GameActionButton'
import GameButton from '../shared/components/GameButton'
import GameIconButton from '../shared/components/GameIconButton'
import {
  QUEM_MENTE_CATEGORIES,
  QUEM_MENTE_MAX_PLAYERS,
  QUEM_MENTE_NAME_MAX_LENGTH,
  QUEM_MENTE_PHASE_LABEL
} from './domain/quemEstaMentindo.constants'
import type { QuemEstaMentindoQuestion } from './domain/quemEstaMentindo.types'
import { useQuemEstaMentindoGame } from './hooks/useQuemEstaMentindoGame'

interface QuemEstaMentindoGameProps {
  onBackToGames: () => void
  questions: QuemEstaMentindoQuestion[]
}

const formatTime = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

const QuemEstaMentindoGame: React.FC<QuemEstaMentindoGameProps> = ({ onBackToGames, questions }) => {
  const {
    addDiscussionTime,
    addPlayerSlot,
    canStartGame,
    changeDiscussionTime,
    changeResponseTime,
    changeRounds,
    currentRevealPlayer,
    currentRevealStep,
    currentVoter,
    feedback,
    filledPlayerCount,
    liars,
    nextReveal,
    phase,
    playerNames,
    players,
    question,
    removePlayerSlot,
    restartGame,
    result,
    round,
    selectVote,
    selectedVote,
    setPhase,
    settings,
    startDiscussion,
    startGame,
    startNextRound,
    startVoting,
    submitVote,
    timeLeft,
    toggleCategory,
    updatePlayerName,
    updateSettings,
    votingOrder
  } = useQuemEstaMentindoGame(questions)

  const isLastReveal = currentRevealStep === players.length - 1
  const isLastRound = round === settings.rounds

  return (
    <div className="quem-mente-game">
      <div className="quem-mente-shell">
        <header className="quem-mente-topbar">
          <GameIconButton label="Voltar para a biblioteca de jogos" onClick={onBackToGames} className="quem-mente-home-link"><ArrowLeft size={18} /></GameIconButton>
          <div className="quem-mente-brand"><span><MessageCircle size={19} /></span>Playzenha</div>
          <span className="quem-mente-phase-chip">{QUEM_MENTE_PHASE_LABEL[phase]}</span>
        </header>

        <AnimatePresence mode="wait">
          {phase === 'setup' && (
            <Screen key="setup">
              <Hero kicker="Quem Está Mentindo?" title="Quem vai jogar?" copy="Uma pessoa vai inventar uma resposta. O resto do grupo precisa descobrir quem." />
              <div className="quem-mente-setup-grid">
                <section className="quem-mente-panel">
                  <div className="quem-mente-player-list">
                    {playerNames.map((name, index) => (
                      <motion.div className="quem-mente-player-card" key={`player-${index}`} layout>
                        <span className="quem-mente-avatar">{name.trim().slice(0, 1).toUpperCase() || index + 1}</span>
                        <input value={name} maxLength={QUEM_MENTE_NAME_MAX_LENGTH} className="quem-mente-name-input" placeholder={`Jogador ${index + 1}`} onChange={(event) => updatePlayerName(index, event.target.value)} />
                        <button className="quem-mente-icon-button danger" type="button" aria-label={`Remover jogador ${index + 1}`} onClick={() => removePlayerSlot(index)}><X size={18} /></button>
                      </motion.div>
                    ))}
                  </div>
                  <button className="quem-mente-add-player" type="button" disabled={playerNames.length >= QUEM_MENTE_MAX_PLAYERS} onClick={addPlayerSlot}><Plus size={18} /> Adicionar jogador</button>
                </section>
                <section className="quem-mente-panel quem-mente-ready-panel">
                  <p className="quem-mente-tiny-label">Partida local</p>
                  <h3>3 a 12 jogadores</h3>
                  <p>{feedback || (canStartGame ? `${filledPlayerCount} jogadores prontos para a rodada.` : 'Cadastre pelo menos 3 jogadores para continuar.')}</p>
                </section>
              </div>
              <div className="quem-mente-spacer" />
              <GameActionButton action="next" theme="yellow" disabled={!canStartGame} onClick={() => setPhase('settings')}>CONFIGURAR RODADA</GameActionButton>
            </Screen>
          )}

          {phase === 'settings' && (
            <Screen key="settings">
              <Hero kicker="Configuração" title="Ajuste o ritmo" copy="Escolha quantas rodadas jogar e como as perguntas entram na resenha." />
              <section className="quem-mente-panel quem-mente-settings">
                <Stepper label="Rodadas" value={settings.rounds} onDecrease={() => changeRounds(-1)} onIncrease={() => changeRounds(1)} />
                <Stepper label="Tempo para responder" value={`${settings.responseTime}s`} onDecrease={() => changeResponseTime(-1)} onIncrease={() => changeResponseTime(1)} />
                <Stepper label="Tempo de discussão" value={formatTime(settings.discussionTime)} onDecrease={() => changeDiscussionTime(-30)} onIncrease={() => changeDiscussionTime(30)} />
                <OptionGroup label="Nível das perguntas" values={['Leve', 'Médio', 'Sem filtro'] as const} selected={settings.difficulty} onSelect={(difficulty) => updateSettings({ difficulty })} />
                <Toggle label="Pontuação ativada" active={settings.scoringEnabled} onClick={() => updateSettings({ scoringEnabled: !settings.scoringEnabled })} />
                <Toggle label="Permitir perguntas pessoais" active={settings.allowPersonalQuestions} onClick={() => updateSettings({ allowPersonalQuestions: !settings.allowPersonalQuestions })} />
                <Toggle label="Mentira dupla (4+ jogadores)" active={settings.doubleLie} onClick={() => updateSettings({ doubleLie: !settings.doubleLie })} />
                <div>
                  <p className="quem-mente-tiny-label">Categorias</p>
                  <div className="quem-mente-chips">{QUEM_MENTE_CATEGORIES.map((category) => <button key={category} type="button" className={settings.categories.includes(category) ? 'selected' : ''} onClick={() => toggleCategory(category)}>{category}</button>)}</div>
                </div>
              </section>
              {feedback && <p className="quem-mente-feedback">{feedback}</p>}
              <div className="quem-mente-spacer" />
              <GameActionButton action="start" theme="yellow" onClick={startGame}>COMEÇAR PARTIDA</GameActionButton>
            </Screen>
          )}

          {phase === 'role-distribution-start' && currentRevealPlayer && (
            <Screen key="role-pass" fill>
              <Hero kicker={`Rodada ${round} de ${settings.rounds}`} title="Passe o celular para" copy="Ninguém mais deve olhar. A próxima tela mostra a missão secreta desta pessoa." />
              <strong className="quem-mente-pass-name">{currentRevealPlayer.name}</strong>
              <div className="quem-mente-secret-token"><EyeOff size={42} /></div>
              <div className="quem-mente-spacer" />
              <GameButton theme="yellow" onClick={() => setPhase('role-reveal')}><Eye size={20} /> REVELAR PAPEL</GameButton>
            </Screen>
          )}

          {phase === 'role-reveal' && currentRevealPlayer && (
            <Screen key="role-reveal" fill>
              <section className={`quem-mente-secret-card ${currentRevealPlayer.role === 'Mentiroso' ? 'liar' : 'truth'}`}>
                <div>
                  <span className="quem-mente-secret-icon">{currentRevealPlayer.role === 'Mentiroso' ? <EyeOff size={33} /> : <Check size={33} />}</span>
                  <p className="quem-mente-tiny-label">{currentRevealPlayer.name}</p>
                  <h1>{currentRevealPlayer.role === 'Mentiroso' ? 'Você é o mentiroso.' : 'Responda com a verdade.'}</h1>
                  <p>{currentRevealPlayer.role === 'Mentiroso' ? 'Invente uma resposta convincente e tente não levantar suspeitas.' : 'Uma pessoa vai tentar enganar o grupo. Escute cada detalhe.'}</p>
                </div>
                <p className="quem-mente-secret-hint">Esconda o papel antes de devolver o celular.</p>
              </section>
              <div className="quem-mente-spacer" />
              <GameButton theme="yellow" variant={isLastReveal ? 'secondary' : 'primary'} onClick={isLastReveal ? () => setPhase('question') : nextReveal}>{isLastReveal ? 'COMEÇAR PERGUNTA' : 'ESCONDER E PASSAR'} <ChevronRight size={20} /></GameButton>
            </Screen>
          )}

          {phase === 'question' && question && (
            <Screen key="question" fill>
              <section className="quem-mente-question-card">
                <p className="quem-mente-tiny-label">Pergunta da rodada</p>
                <h1>{question.text}</h1>
                <p>Todos respondem oralmente. Cada pessoa tem até {settings.responseTime} segundos para responder.</p>
                <div className="quem-mente-question-meta"><span>{question.category}</span><span>{settings.responseTime}s por pessoa</span></div>
              </section>
              <div className="quem-mente-spacer" />
              <GameButton theme="yellow" onClick={startDiscussion}>ABRIR DISCUSSÃO</GameButton>
            </Screen>
          )}

          {phase === 'discussion' && (
            <Screen key="discussion">
              <Hero kicker="Discussão" title={timeLeft <= 30 ? 'Pressão subindo' : 'Encontrem a mentira'} copy="Questionem respostas, peçam detalhes e procurem contradições." />
              <div className="quem-mente-timer-wrap"><div className="quem-mente-timer-ring" style={{ '--progress': Math.max(0, timeLeft / settings.discussionTime), '--timer-color': timeLeft <= 30 ? 'var(--quem-mente-danger)' : 'var(--quem-mente-orange)' } as React.CSSProperties}><div className="quem-mente-timer-content"><strong>{formatTime(timeLeft)}</strong><span>{timeLeft <= 30 ? 'Últimos segundos' : 'Tempo restante'}</span></div></div></div>
              <div className="quem-mente-actions-split"><GameButton theme="yellow" variant="secondary" onClick={addDiscussionTime}>+30 segundos</GameButton><GameButton theme="yellow" variant="danger" onClick={() => setPhase('voting-intro')}>VOTAR AGORA</GameButton></div>
            </Screen>
          )}

          {phase === 'voting-intro' && (
            <Screen key="voting-intro" fill>
              <section className="quem-mente-secret-card liar">
                <div><span className="quem-mente-secret-icon"><Vote size={33} /></span><p className="quem-mente-tiny-label">Momento decisivo</p><h1>Hora de votar.</h1><p>O celular vai passar de mão em mão. Cada pessoa escolhe em segredo quem acredita estar mentindo.</p></div>
                <p className="quem-mente-secret-hint">Seu voto não aparece para o próximo jogador.</p>
              </section>
              <div className="quem-mente-spacer" />
              <GameButton theme="yellow" variant="danger" onClick={startVoting}>ABRIR VOTAÇÃO</GameButton>
            </Screen>
          )}

          {phase === 'voting-distribution-start' && currentVoter && (
            <Screen key="vote-pass" fill>
              <Hero kicker={`Voto ${Math.min(votingOrder.length, votingOrder.indexOf(currentVoter.id) + 1)} de ${votingOrder.length}`} title="Passe o celular para" copy="Escolha sozinho quem você acha que está mentindo." />
              <strong className="quem-mente-pass-name">{currentVoter.name}</strong>
              <div className="quem-mente-secret-token vote"><Vote size={42} /></div>
              <div className="quem-mente-spacer" />
              <GameButton theme="yellow" onClick={() => setPhase('voting')}>VOTAR EM SEGREDO</GameButton>
            </Screen>
          )}

          {phase === 'voting' && currentVoter && (
            <Screen key="voting">
              <Hero kicker={`Voto de ${currentVoter.name}`} title="Quem está mentindo?" copy="Escolha uma pessoa. Você não pode votar em si mesmo." />
              <div className="quem-mente-vote-grid">{players.filter((player) => player.id !== currentVoter.id).map((player) => <button key={player.id} className={selectedVote === player.id ? 'selected' : ''} type="button" onClick={() => selectVote(player.id)}><span className="quem-mente-avatar">{player.name.slice(0, 1)}</span><strong>{player.name}</strong>{selectedVote === player.id && <Check size={20} />}</button>)}</div>
              <div className="quem-mente-spacer" />
              <GameButton theme="yellow" variant="danger" disabled={!selectedVote} onClick={submitVote}>CONFIRMAR VOTO</GameButton>
            </Screen>
          )}

          {phase === 'results' && result && (
            <Screen key="results" fill>
              <section className={`quem-mente-result-card ${result.winner === 'Grupo' ? 'group' : 'liars'}`}>
                <div><span className="quem-mente-secret-icon">{result.winner === 'Grupo' ? <Check size={33} /> : <EyeOff size={33} />}</span><p className="quem-mente-tiny-label">Resultado</p><h1>{result.winner === 'Grupo' ? 'O grupo descobriu!' : 'Os mentirosos escaparam.'}</h1><p>{result.winner === 'Grupo' ? 'A votação apontou apenas para quem estava mentindo.' : 'A desconfiança se espalhou e a mentira sobreviveu à rodada.'}</p></div>
                <div className="quem-mente-result-facts"><div><span>Mentiroso{liars.length > 1 ? 's' : ''}</span><strong>{liars.map((player) => player.name).join(' e ')}</strong></div><div><span>Mais votado{result.topVotedIds.length > 1 ? 's' : ''}</span><strong>{result.topVotedIds.length ? result.topVotedIds.map((id) => players.find((player) => player.id === id)?.name).join(' e ') : 'Sem votos'}</strong></div></div>
              </section>
              <section className="quem-mente-score-list">{players.map((player) => <div key={player.id}><span className="quem-mente-avatar">{player.name.slice(0, 1)}</span><div><strong>{player.name}</strong><small>{result.voteCounts[player.id] ?? 0} voto{(result.voteCounts[player.id] ?? 0) === 1 ? '' : 's'} recebidos {result.correctVoterIds.includes(player.id) ? '· acertou' : ''}</small></div>{settings.scoringEnabled && <b>{player.score} pt{player.score === 1 ? '' : 's'}</b>}</div>)}</section>
              <div className="quem-mente-spacer" />
              <div className="quem-mente-result-actions">{!isLastRound && <GameButton theme="yellow" onClick={startNextRound}><RotateCcw size={20} /> PRÓXIMA RODADA</GameButton>}{isLastRound && <GameActionButton action="restart" theme="yellow" onClick={restartGame}>NOVA PARTIDA</GameActionButton>}<GameActionButton action="backToGames" theme="yellow" onClick={onBackToGames} /></div>
            </Screen>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const Screen = ({ children, fill = false }: { children: React.ReactNode; fill?: boolean }) => <motion.section className={`quem-mente-screen ${fill ? 'fill' : ''}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>{children}</motion.section>
const Hero = ({ kicker, title, copy }: { kicker: string; title: string; copy: string }) => <section className="quem-mente-hero-card"><p className="quem-mente-kicker">{kicker}</p><h1>{title}</h1><span>{copy}</span></section>
const Stepper = ({ label, value, onDecrease, onIncrease }: { label: string; value: string | number; onDecrease: () => void; onIncrease: () => void }) => <div className="quem-mente-stepper"><span>{label}</span><button type="button" onClick={onDecrease}>−</button><strong>{value}</strong><button type="button" onClick={onIncrease}>+</button></div>
const Toggle = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => <button className="quem-mente-toggle" type="button" onClick={onClick}><span>{label}</span><i className={active ? 'active' : ''}>{active && <Check size={15} />}</i></button>
const OptionGroup = <T extends string>({ label, values, selected, onSelect }: { label: string; values: readonly T[]; selected: T; onSelect: (value: T) => void }) => <div><p className="quem-mente-tiny-label">{label}</p><div className="quem-mente-chips">{values.map((value) => <button key={value} type="button" className={selected === value ? 'selected' : ''} onClick={() => onSelect(value)}>{value}</button>)}</div></div>

export default QuemEstaMentindoGame
