const { useEffect, useMemo, useState } = React;
const { motion, AnimatePresence } = window.Motion;

const THEMES = [
  "Churrasco",
  "Praia",
  "Cinema",
  "Festa junina",
  "Viagem",
  "Aniversário",
  "Academia",
  "Restaurante",
  "Escola",
  "Balada",
  "Supermercado",
  "Resenha em casa"
];

const initialPlayers = ["", "", ""];

function Icon({ name }) {
  const paths = {
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><path d="M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"/></>,
    eyeOff: <><path d="m3 3 18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.2 5.5A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3.1 4.2"/><path d="M6.2 6.8C3.5 8.6 2 12 2 12s3.5 7 10 7c1.6 0 3-.4 4.2-1"/></>,
    card: <><rect x="5" y="3" width="14" height="18" rx="3"/><path d="M9 8h6M9 12h4"/></>,
    alert: <><path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5M12 17h.01"/></>,
    vote: <><path d="M4 14h16v7H4z"/><path d="M8 14V8l4-5 4 5v6"/><path d="M9 18h6"/></>,
    crown: <><path d="m3 7 5 5 4-8 4 8 5-5-2 12H5L3 7Z"/><path d="M5 19h14"/></>,
    mask: <><path d="M4 9c2-2 5-3 8-3s6 1 8 3v3c0 4-3.5 7-8 7s-8-3-8-7V9Z"/><path d="M8 12h.01M16 12h.01"/><path d="M9 16c2 1 4 1 6 0"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    minus: <><path d="M5 12h14"/></>,
    x: <><path d="M6 6l12 12M18 6 6 18"/></>
  };
  return <span className="icon" aria-hidden="true"><svg viewBox="0 0 24 24">{paths[name]}</svg></span>;
}

function GameButton({ children, variant = "primary", disabled, onClick, className = "" }) {
  return (
    <button className={`game-button ${variant} ${disabled ? "disabled" : ""} ${className}`} disabled={disabled} onClick={onClick} type="button">
      {children}
    </button>
  );
}

function Shell({ phase, children }) {
  return (
    <div className="game-shell">
      <header className="topbar" data-od-id="impostor-topbar">
        <div className="brand"><span className="brand-mark"><Icon name="mask" /></span>Playzenha</div>
        <div className="topbar-actions">
          <a className="home-link" href="index.html" data-od-id="back-to-games-home">Home</a>
          <span className="round-chip">{phase}</span>
        </div>
      </header>
      {children}
    </div>
  );
}

function SetupScreen({ players, setPlayers, minutes, setMinutes, onStart }) {
  const validPlayers = players.map((player) => player.trim()).filter(Boolean);
  const canStart = validPlayers.length >= 3;

  function addPlayer() {
    if (players.length >= 16) return;
    setPlayers([...players, ""]);
  }

  function removePlayer(index) {
    setPlayers(players.filter((_, itemIndex) => itemIndex !== index));
  }

  function updatePlayer(index, value) {
    setPlayers(players.map((player, itemIndex) => itemIndex === index ? value : player));
  }

  return (
    <motion.section className="screen" data-od-id="setup-screen" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="hero-card">
        <p className="kicker">Impostor</p>
        <h1>Quem vai jogar?</h1>
        <p>Adicione de 3 a 16 pessoas. Depois é só passar o celular e deixar cada um descobrir seu papel em segredo.</p>
      </div>

      <div className="setup-grid">
        <div className="panel">
          <div className="player-list">
            {players.map((player, index) => (
              <motion.div className="player-card" key={`player-${index}`} layout>
                <span className="avatar">{player.trim().slice(0, 1).toUpperCase() || index + 1}</span>
                <input className="name-input compact" value={player} maxLength="18" placeholder={`Jogador ${index + 1}`} onChange={(event) => updatePlayer(index, event.target.value)} />
                <button className="remove-button" type="button" aria-label={`Remover jogador ${index + 1}`} onClick={() => removePlayer(index)} disabled={players.length <= 1}><Icon name="x" /></button>
              </motion.div>
            ))}
          </div>
          <GameButton variant="ghost" onClick={addPlayer} disabled={players.length >= 16} className="add-player-button"><Icon name="plus" /> Adicionar jogador</GameButton>
        </div>

        <div className="panel stack">
          <div className="time-card">
            <div>
              <p className="tiny-label">Discussão</p>
              <h3>Tempo da rodada</h3>
            </div>
            <div className="stepper">
              <button className="icon-button" type="button" onClick={() => setMinutes(Math.max(1, minutes - 1))}><Icon name="minus" /></button>
              <strong>{minutes} min</strong>
              <button className="icon-button" type="button" onClick={() => setMinutes(Math.min(15, minutes + 1))}><Icon name="plus" /></button>
            </div>
          </div>
          <p className={canStart ? "hint" : "hint error"}>{canStart ? `${validPlayers.length} jogadores prontos para a investigação.` : "Mínimo de 3 jogadores para começar."}</p>
        </div>
      </div>

      <div className="spacer" />
      <div className="sticky-action">
        <GameButton disabled={!canStart} onClick={onStart}>Começar rodada</GameButton>
      </div>
    </motion.section>
  );
}

function PassScreen({ player, onReveal }) {
  return (
    <motion.section className="screen" data-od-id="pass-phone-screen" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="hero-card">
        <p className="kicker">Segredo da vez</p>
        <h2>Passe o celular para</h2>
        <div className="pass-player-name" data-od-id="pass-player-name">{player}</div>
        <p>Ninguém mais deve olhar. A próxima tela mostra o papel secreto desta pessoa.</p>
      </div>
      <div className="pass-illustration">
        <motion.div className="secret-token" animate={{ rotate: [-4, 3, -4], y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
          <Icon name="eyeOff" />
        </motion.div>
      </div>
      <div className="spacer" />
      <GameButton variant="primary" onClick={onReveal}><Icon name="eye" /> Revelar papel</GameButton>
    </motion.section>
  );
}

function RevealScreen({ player, isImpostor, theme, isLast, onNext }) {
  return (
    <motion.section className="screen" data-od-id="role-reveal-screen" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className={`secret-card ${isImpostor ? "impostor" : "citizen"}`}>
        <div>
          <div className="big-icon"><Icon name={isImpostor ? "mask" : "card"} /></div>
          <p className="kicker" style={{ marginTop: 22 }}>{player}</p>
          {isImpostor ? (
            <>
              <h2>Você é o Impostor</h2>
              <p>Seu objetivo é descobrir o tema ou enganar todo mundo para não ser votado.</p>
            </>
          ) : (
            <>
              <h2>Tema da rodada</h2>
              <div className="theme-badge">{theme}</div>
              <p style={{ marginTop: 14 }}>Encontre quem não sabe este tema.</p>
            </>
          )}
        </div>
        <p className="hint">Esconda o papel antes de devolver o celular.</p>
      </div>
      <div className="spacer" />
      <GameButton variant={isLast ? "blue" : "ghost"} onClick={onNext}>{isLast ? "Começar investigação" : "Esconder e passar"}</GameButton>
    </motion.section>
  );
}

function InvestigationScreen({ onStart }) {
  return (
    <motion.section className="screen" data-od-id="investigation-start-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="secret-card">
        <div>
          <div className="big-icon"><Icon name="alert" /></div>
          <p className="kicker" style={{ marginTop: 22 }}>Agora é conversa</p>
          <h1>Investiguem!</h1>
          <p>Façam perguntas sobre o tema. O Impostor vai tentar parecer confiante sem saber do que todo mundo está falando.</p>
        </div>
        <p className="hint">Dica: perguntas específicas deixam a mentira mais difícil.</p>
      </div>
      <div className="spacer" />
      <GameButton onClick={onStart}>Iniciar timer</GameButton>
    </motion.section>
  );
}

function DiscussionScreen({ seconds, totalSeconds, onVoteNow, onAddMinute }) {
  const lowTime = seconds <= 30;
  const progress = Math.max(0, seconds / totalSeconds);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <motion.section className="screen" data-od-id="discussion-timer-screen" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="hero-card">
        <p className="kicker">Discussão</p>
        <h2>{lowTime ? "Pressão subindo" : "Façam perguntas"}</h2>
        <p>O grupo tenta achar quem está fingindo. O Impostor escuta, improvisa e tenta escapar.</p>
      </div>
      <div className="timer-wrap">
        <div className="timer-ring" style={{ "--progress": progress, "--ring-color": lowTime ? "var(--danger)" : "var(--yellow)" }}>
          <div>
            <div className="timer-value">{mm}:{ss}</div>
            <p style={{ textAlign: "center" }}>{lowTime ? "Últimos segundos" : "Tempo restante"}</p>
          </div>
        </div>
      </div>
      <div className="split">
        <GameButton variant="ghost" onClick={onAddMinute}>+1 minuto</GameButton>
        <GameButton variant="danger" onClick={onVoteNow}>Votar agora</GameButton>
      </div>
    </motion.section>
  );
}

function VoteIntroScreen({ onContinue }) {
  return (
    <motion.section className="screen" data-od-id="vote-intro-screen" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="secret-card impostor">
        <div>
          <div className="big-icon"><Icon name="vote" /></div>
          <p className="kicker" style={{ marginTop: 22 }}>Momento decisivo</p>
          <h1>Hora de votar</h1>
          <p>Quem vocês acham que é o Impostor? Escolham a pessoa mais suspeita do grupo.</p>
        </div>
        <p className="hint">Selecione quem recebeu mais votos na conversa.</p>
      </div>
      <div className="spacer" />
      <GameButton variant="danger" onClick={onContinue}>Abrir votação</GameButton>
    </motion.section>
  );
}

function VotingScreen({ players, selected, setSelected, onConfirm }) {
  return (
    <motion.section className="screen" data-od-id="voting-list-screen" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="hero-card">
        <p className="kicker">Votação</p>
        <h2>Quem recebeu mais votos?</h2>
        <p>Toque no jogador escolhido pelo grupo. O card vermelho marca o principal suspeito.</p>
      </div>
      <div className="vote-grid">
        {players.map((player, index) => (
          <button className={`vote-card ${selected === index ? "selected" : ""}`} key={`${player}-${index}`} type="button" onClick={() => setSelected(index)}>
            <span className="avatar">{player.slice(0, 1).toUpperCase()}</span>
            <strong>{player}</strong>
            {selected === index && <Icon name="alert" />}
          </button>
        ))}
      </div>
      <div className="spacer" />
      <GameButton variant="danger" disabled={selected === null} onClick={onConfirm}>Confirmar voto</GameButton>
    </motion.section>
  );
}

function ResultScreen({ citizensWin, impostor, theme, onAgain }) {
  return (
    <motion.section className="screen" data-od-id="result-screen" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <div className={`secret-card result-card ${citizensWin ? "citizens" : "impostor-win"}`}>
        <div>
          <div className="big-icon"><Icon name={citizensWin ? "crown" : "mask"} /></div>
          <p className="kicker" style={{ marginTop: 22 }}>Resultado</p>
          <h1>{citizensWin ? "Cidadãos venceram" : "Impostor venceu"}</h1>
          <p>{citizensWin ? "O grupo encontrou quem estava mentindo." : "O Impostor escapou e enganou a resenha."}</p>
        </div>
        <div className="facts">
          <div className="fact"><span className="tiny-label">Impostor</span><strong>{impostor}</strong></div>
          <div className="fact"><span className="tiny-label">Tema</span><strong>{theme}</strong></div>
        </div>
      </div>
      <GameButton variant={citizensWin ? "success" : "danger"} onClick={onAgain}>Jogar de novo</GameButton>
    </motion.section>
  );
}

function App() {
  const [phase, setPhase] = useState("setup");
  const [players, setPlayers] = useState(initialPlayers);
  const [minutes, setMinutes] = useState(3);
  const [theme, setTheme] = useState(THEMES[0]);
  const [impostorIndex, setImpostorIndex] = useState(0);
  const [revealIndex, setRevealIndex] = useState(0);
  const [seconds, setSeconds] = useState(180);
  const [totalSeconds, setTotalSeconds] = useState(180);
  const [selectedVote, setSelectedVote] = useState(null);
  const [citizensWin, setCitizensWin] = useState(false);

  const phaseLabel = {
    setup: "Configuração",
    pass: "Passe o celular",
    reveal: "Papel secreto",
    investigation: "Investigação",
    discussion: "Timer",
    voteIntro: "Alerta",
    voting: "Votação",
    result: "Resultado"
  }[phase];

  const activePlayers = useMemo(() => players.map((player) => player.trim()).filter(Boolean), [players]);

  function startRound() {
    const nextTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
    const nextImpostor = Math.floor(Math.random() * activePlayers.length);
    const nextSeconds = minutes * 60;
    setTheme(nextTheme);
    setImpostorIndex(nextImpostor);
    setRevealIndex(0);
    setSeconds(nextSeconds);
    setTotalSeconds(nextSeconds);
    setSelectedVote(null);
    setPhase("pass");
  }

  function nextAfterReveal() {
    if (revealIndex >= activePlayers.length - 1) {
      setPhase("investigation");
    } else {
      setRevealIndex(revealIndex + 1);
      setPhase("pass");
    }
  }

  function confirmVote() {
    setCitizensWin(selectedVote === impostorIndex);
    setPhase("result");
  }

  useEffect(() => {
    if (phase !== "discussion") return undefined;
    if (seconds <= 0) {
      setPhase("voteIntro");
      return undefined;
    }
    const id = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(id);
  }, [phase, seconds]);

  return (
    <Shell phase={phaseLabel}>
      <AnimatePresence mode="wait">
        {phase === "setup" && <SetupScreen key="setup" players={players} setPlayers={setPlayers} minutes={minutes} setMinutes={setMinutes} onStart={startRound} />}
        {phase === "pass" && <PassScreen key="pass" player={activePlayers[revealIndex]} onReveal={() => setPhase("reveal")} />}
        {phase === "reveal" && <RevealScreen key="reveal" player={activePlayers[revealIndex]} isImpostor={revealIndex === impostorIndex} theme={theme} isLast={revealIndex === activePlayers.length - 1} onNext={nextAfterReveal} />}
        {phase === "investigation" && <InvestigationScreen key="investigation" onStart={() => setPhase("discussion")} />}
        {phase === "discussion" && <DiscussionScreen key="discussion" seconds={seconds} totalSeconds={totalSeconds} onVoteNow={() => setPhase("voteIntro")} onAddMinute={() => { setSeconds(seconds + 60); setTotalSeconds(totalSeconds + 60); }} />}
        {phase === "voteIntro" && <VoteIntroScreen key="voteIntro" onContinue={() => setPhase("voting")} />}
        {phase === "voting" && <VotingScreen key="voting" players={activePlayers} selected={selectedVote} setSelected={setSelectedVote} onConfirm={confirmVote} />}
        {phase === "result" && <ResultScreen key="result" citizensWin={citizensWin} impostor={activePlayers[impostorIndex]} theme={theme} onAgain={startRound} />}
      </AnimatePresence>
    </Shell>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
