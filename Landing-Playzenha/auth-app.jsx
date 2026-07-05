const { useEffect, useMemo, useState } = React;
const { motion, AnimatePresence } = window.Motion;

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  remember: true
};

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M7 8h10a4 4 0 0 1 4 4v1a4 4 0 0 1-4 4h-1.5l-2 2-2-2H7a4 4 0 0 1-4-4v-1a4 4 0 0 1 4-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 12h.01M12 12h.01M16 12h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function AuthField({ label, type = "text", value, placeholder, onChange, passwordVisible, onTogglePassword }) {
  const fieldType = type === "password" && passwordVisible ? "text" : type;
  return (
    <label className="field">
      <span>{label}</span>
      <span className="input-wrap">
        <input className={`input ${type === "password" ? "password" : ""}`} type={fieldType} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
        {type === "password" && <button className="show-pass" type="button" onClick={onTogglePassword}>{passwordVisible ? "Ocultar" : "Mostrar"}</button>}
      </span>
    </label>
  );
}

function App() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const isCreate = mode === "signup";
  const title = isCreate ? "Crie sua conta" : "Entre na resenha";
  const subtitle = isCreate
    ? "Salve seus grupos, favoritos e jogos para começar mais rápido no próximo rolê."
    : "Acesse seus jogos, planos e grupos salvos para chamar a galera sem enrolação.";

  const cta = isCreate ? "Criar conta e jogar" : "Entrar e começar";

  const canSubmit = useMemo(() => {
    const emailOk = /.+@.+\..+/.test(form.email.trim());
    const passwordOk = form.password.trim().length >= 6;
    const nameOk = !isCreate || form.name.trim().length >= 2;
    return emailOk && passwordOk && nameOk;
  }, [form, isCreate]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setShowPassword(false);
  }

  function submit(event) {
    event.preventDefault();
    if (!canSubmit) {
      setError(isCreate ? "Preencha nome, e-mail válido e senha com 6+ caracteres." : "Use um e-mail válido e uma senha com 6+ caracteres.");
      return;
    }
    setToast(isCreate ? "Conta pronta. Bora começar a resenha." : "Login aprovado. Seus jogos estão prontos.");
  }

  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(id);
  }, [toast]);

  return (
    <div className="auth-shell">
      <header className="topbar" data-od-id="auth-topbar">
        <a className="brand" href="index.html" data-od-id="auth-brand-link"><BrandMark />Playzenha</a>
        <a className="home-link" href="index.html" data-od-id="auth-home-link">Home</a>
      </header>

      <section className="auth-layout">
        <motion.aside className="hero-panel" data-od-id="auth-hero-panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <p className="kicker">Sua conta Playzenha</p>
            <h1>Entre, chame a galera e jogue.</h1>
            <p className="hero-copy">Uma conta simples para guardar seus jogos favoritos, planos e grupos. Abriu no celular, escolheu o jogo e a resenha começa.</p>
          </div>
          <div className="party-card" data-od-id="auth-party-card">
            <div className="avatars">
              <span className="avatar">Lu</span>
              <span className="avatar">Ca</span>
              <span className="avatar">Bi</span>
            </div>
            <strong>Grupo pronto para jogar</strong>
            <p>Impostor, Eu Nunca, Quiz da Resenha e Modo Festa em poucos toques.</p>
          </div>
        </motion.aside>

        <motion.section className="form-card" data-od-id="auth-form-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <div className="mode-tabs" data-od-id="auth-mode-tabs">
            <button className={`mode-tab ${mode === "login" ? "active" : ""}`} type="button" onClick={() => switchMode("login")}>Entrar</button>
            <button className={`mode-tab ${mode === "signup" ? "active" : ""}`} type="button" onClick={() => switchMode("signup")}>Criar conta</button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={mode} initial={{ opacity: 0, x: isCreate ? 16 : -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isCreate ? -16 : 16 }} transition={{ duration: 0.18 }}>
              <div className="form-head">
                <p className="small-label">{isCreate ? "Novo por aqui" : "Bem-vindo de volta"}</p>
                <h2 data-od-id="auth-form-title">{title}</h2>
                <p>{subtitle}</p>
              </div>

              <form className="auth-form" data-od-id="auth-form" onSubmit={submit}>
                {isCreate && (
                  <AuthField label="Nome ou apelido" value={form.name} placeholder="Como a galera te chama?" onChange={(value) => updateField("name", value)} />
                )}
                <AuthField label="E-mail" type="email" value={form.email} placeholder="voce@email.com" onChange={(value) => updateField("email", value)} />
                <AuthField label="Senha" type="password" value={form.password} placeholder="Mínimo 6 caracteres" passwordVisible={showPassword} onTogglePassword={() => setShowPassword((value) => !value)} onChange={(value) => updateField("password", value)} />

                <div className="inline-row">
                  <label className="checkbox">
                    <input type="checkbox" checked={form.remember} onChange={(event) => updateField("remember", event.target.checked)} />
                    <span>Manter conectado</span>
                  </label>
                  {!isCreate && <a className="text-link" href="#recuperar" data-od-id="forgot-password-link">Esqueci a senha</a>}
                </div>

                <p className="error" role="alert">{error}</p>
                <button className="auth-button" data-od-id="auth-primary-button" type="submit">{cta}</button>

                <div className="divider">ou continue com</div>
                <div className="social-row" data-od-id="auth-social-buttons">
                  <button className="social-button" type="button" onClick={() => setToast("Google conectado para teste visual.")}>Google</button>
                  <button className="social-button" type="button" onClick={() => setToast("Apple conectado para teste visual.")}>Apple</button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </motion.section>
      </section>

      <section className="perks" data-od-id="auth-perks">
        <article className="perk-card"><h3>Sem baixar nada</h3><p>Conta leve, jogo direto no navegador do celular.</p></article>
        <article className="perk-card"><h3>Grupos salvos</h3><p>Volte para a mesma galera sem cadastrar tudo de novo.</p></article>
        <article className="perk-card"><h3>Planos e jogos</h3><p>Acesse Premium, Festa e favoritos em um só lugar.</p></article>
      </section>

      <div className={`toast ${toast ? "visible" : ""}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
