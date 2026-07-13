import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button, FormField, Input, Toast } from '../../../shared/components/ui'

interface LoginPageProps {
  initialMode?: AuthMode
}

type AuthMode = 'login' | 'signup'

interface AuthForm {
  name: string
  email: string
  password: string
  remember: boolean
}

const INITIAL_FORM: AuthForm = {
  name: '',
  email: '',
  password: '',
  remember: true
}

const LoginPage: React.FC<LoginPageProps> = ({ initialMode = 'signup' }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [form, setForm] = useState<AuthForm>(INITIAL_FORM)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const isCreate = mode === 'signup'
  const title = isCreate ? 'Crie sua conta' : 'Entre na resenha'
  const subtitle = isCreate
    ? 'Salve seus grupos, favoritos e jogos para comecar mais rapido no proximo role.'
    : 'Acesse seus jogos, planos e grupos salvos para chamar a galera sem enrolacao.'
  const cta = isCreate ? 'Criar conta e jogar' : 'Entrar e comecar'

  useEffect(() => {
    setMode(initialMode)
    setError('')
    setShowPassword(false)
  }, [initialMode])

  const canSubmit = useMemo(() => {
    const emailOk = /.+@.+\..+/.test(form.email.trim())
    const passwordOk = form.password.trim().length >= 6
    const nameOk = !isCreate || form.name.trim().length >= 2
    return emailOk && passwordOk && nameOk
  }, [form, isCreate])

  useEffect(() => {
    if (!toast) return undefined
    const id = window.setTimeout(() => setToast(''), 2400)
    return () => window.clearTimeout(id)
  }, [toast])

  const updateField = <Field extends keyof AuthForm>(field: Field, value: AuthForm[Field]) => {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
  }

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    setError('')
    setShowPassword(false)
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!canSubmit) {
      setError(isCreate ? 'Preencha nome, e-mail valido e senha com 6+ caracteres.' : 'Use um e-mail valido e uma senha com 6+ caracteres.')
      return
    }
    setToast(isCreate ? 'Conta pronta. Bora comecar a resenha.' : 'Login aprovado. Seus jogos estao prontos.')
  }

  return (
    <div className="auth-page">
      <div className="auth-page-shell">
        <header className="auth-page-topbar">
          <Link className="auth-page-brand" to="/">
            <BrandMark />
            Playzenha
          </Link>
          <Link className="auth-page-home-link" to="/">Home</Link>
        </header>

        <section className="auth-page-layout">
          <motion.aside className="auth-page-hero-panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div>
              <p className="auth-page-kicker">Sua conta Playzenha</p>
              <h1>Entre, chame a galera e jogue.</h1>
              <p className="auth-page-hero-copy">Uma conta simples para guardar seus jogos favoritos, planos e grupos. Abriu no celular, escolheu o jogo e a resenha comeca.</p>
            </div>
            <div className="auth-page-party-card">
              <div className="auth-page-avatars">
                <span className="auth-page-avatar">Lu</span>
                <span className="auth-page-avatar">Ca</span>
                <span className="auth-page-avatar">Bi</span>
              </div>
              <strong>Grupo pronto para jogar</strong>
              <p>Impostor, Contato, Quem Sou Eu e Ultima Noite em poucos toques.</p>
            </div>
          </motion.aside>

          <motion.section className="auth-page-form-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <div className="auth-page-mode-tabs">
              <button className={`auth-page-mode-tab ${mode === 'login' ? 'active' : ''}`} type="button" onClick={() => switchMode('login')}>Entrar</button>
              <button className={`auth-page-mode-tab ${mode === 'signup' ? 'active' : ''}`} type="button" onClick={() => switchMode('signup')}>Criar conta</button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: isCreate ? 16 : -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isCreate ? -16 : 16 }}
                transition={{ duration: 0.18 }}
              >
                <div className="auth-page-form-head">
                  <p className="auth-page-small-label">{isCreate ? 'Novo por aqui' : 'Bem-vindo de volta'}</p>
                  <h2>{title}</h2>
                  <p>{subtitle}</p>
                </div>

                <form className="auth-page-form" onSubmit={submit}>
                  {isCreate && (
                    <AuthField
                      label="Nome ou apelido"
                      value={form.name}
                      placeholder="Como a galera te chama?"
                      onChange={(value) => updateField('name', value)}
                    />
                  )}
                  <AuthField label="E-mail" type="email" value={form.email} placeholder="voce@email.com" onChange={(value) => updateField('email', value)} />
                  <AuthField
                    label="Senha"
                    type="password"
                    value={form.password}
                    placeholder="Minimo 6 caracteres"
                    passwordVisible={showPassword}
                    onTogglePassword={() => setShowPassword((value) => !value)}
                    onChange={(value) => updateField('password', value)}
                  />

                  <div className="auth-page-inline-row">
                    <label className="auth-page-checkbox">
                      <input type="checkbox" checked={form.remember} onChange={(event) => updateField('remember', event.target.checked)} />
                      <span>Manter conectado</span>
                    </label>
                    {!isCreate && <a className="auth-page-text-link" href="#recuperar">Esqueci a senha</a>}
                  </div>

                  <p className="auth-page-error" role="alert">{error}</p>
                  <Button className="auth-page-button" type="submit" disabled={!canSubmit} fullWidth>{cta}</Button>

                  <div className="auth-page-divider">ou continue com</div>
                  <div className="auth-page-social-row">
                    <Button className="auth-page-social-button" type="button" variant="ghost" onClick={() => setToast('Google conectado para teste visual.')}>Google</Button>
                    <Button className="auth-page-social-button" type="button" variant="ghost" onClick={() => setToast('Apple conectado para teste visual.')}>Apple</Button>
                  </div>
                </form>
              </motion.div>
            </AnimatePresence>
          </motion.section>
        </section>

        <section className="auth-page-perks">
          <article className="auth-page-perk-card"><h3>Sem baixar nada</h3><p>Conta leve, jogo direto no navegador do celular.</p></article>
          <article className="auth-page-perk-card"><h3>Grupos salvos</h3><p>Volte para a mesma galera sem cadastrar tudo de novo.</p></article>
          <article className="auth-page-perk-card"><h3>Planos e jogos</h3><p>Acesse Premium, Festa e favoritos em um so lugar.</p></article>
        </section>

        <Toast className="auth-page-toast" message={toast} visible={Boolean(toast)} variant="success" />
      </div>
    </div>
  )
}

interface AuthFieldProps {
  label: string
  type?: React.HTMLInputTypeAttribute
  value: string
  placeholder: string
  onChange: (value: string) => void
  passwordVisible?: boolean
  onTogglePassword?: () => void
}

const AuthField: React.FC<AuthFieldProps> = ({ label, type = 'text', value, placeholder, onChange, passwordVisible, onTogglePassword }) => {
  const fieldType = type === 'password' && passwordVisible ? 'text' : type

  return (
    <FormField label={label} className="auth-page-field">
      <span className="auth-page-input-wrap">
        <Input
          className={`auth-page-input ${type === 'password' ? 'password' : ''}`}
          type={fieldType}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
        {type === 'password' && (
          <Button className="auth-page-show-pass" size="sm" variant="ghost" type="button" onClick={onTogglePassword}>
            {passwordVisible ? 'Ocultar' : 'Mostrar'}
          </Button>
        )}
      </span>
    </FormField>
  )
}

const BrandMark: React.FC = () => (
  <span className="auth-page-brand-mark" aria-hidden="true">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M7 8h10a4 4 0 0 1 4 4v1a4 4 0 0 1-4 4h-1.5l-2 2-2-2H7a4 4 0 0 1-4-4v-1a4 4 0 0 1 4-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 12h.01M12 12h.01M16 12h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  </span>
)

export default LoginPage
