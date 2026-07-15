import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../../../shared/api/api-error'
import { Button, FormField, Input, Toast } from '../../../shared/components/ui'
import { useAuth } from '../model/auth-context'

interface LoginPageProps {
  initialMode?: AuthMode
}

type AuthMode = 'login' | 'signup' | 'recover'
type RecoveryStage = 'request' | 'reset'

interface AuthForm {
  nickname: string
  email: string
  password: string
  resetToken: string
}

const INITIAL_FORM: AuthForm = {
  nickname: '',
  email: '',
  password: '',
  resetToken: ''
}

const LoginPage: React.FC<LoginPageProps> = ({ initialMode = 'signup' }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    login,
    register,
    requestPasswordReset,
    resetPassword,
    status
  } = useAuth()
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [recoveryStage, setRecoveryStage] =
    useState<RecoveryStage>('request')
  const [form, setForm] = useState<AuthForm>(INITIAL_FORM)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const isCreate = mode === 'signup'
  const isRecover = mode === 'recover'
  const title = getTitle(mode, recoveryStage)
  const subtitle = getSubtitle(mode, recoveryStage)
  const cta = getCta(mode, recoveryStage)
  const redirectPath = getRedirectPath(location.state)

  useEffect(() => {
    setMode(initialMode)
    setRecoveryStage('request')
    setError('')
    setShowPassword(false)
  }, [initialMode])

  useEffect(() => {
    if (status === 'authenticated') {
      navigate(redirectPath, { replace: true })
    }
  }, [navigate, redirectPath, status])

  const canSubmit = useMemo(() => {
    const emailOk = /.+@.+\..+/.test(form.email.trim())
    const passwordOk = form.password.trim().length >= 8
    const nicknameOk = !isCreate || form.nickname.trim().length >= 2
    const resetTokenOk =
      !isRecover || recoveryStage === 'request' || form.resetToken.trim()

    if (isRecover && recoveryStage === 'request') return emailOk

    return emailOk && passwordOk && nicknameOk && Boolean(resetTokenOk)
  }, [form, isCreate, isRecover, recoveryStage])

  useEffect(() => {
    if (!toast) return undefined
    const id = window.setTimeout(() => setToast(''), 3200)
    return () => window.clearTimeout(id)
  }, [toast])

  const updateField = <Field extends keyof AuthForm>(
    field: Field,
    value: AuthForm[Field]
  ) => {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
  }

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    setRecoveryStage('request')
    setError('')
    setShowPassword(false)
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!canSubmit) {
      setError(getValidationMessage(mode, recoveryStage))
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      if (mode === 'signup') {
        await register({
          nickname: form.nickname,
          email: form.email,
          password: form.password
        })
        setToast('Conta criada. Bora jogar.')
        return
      }

      if (mode === 'login') {
        await login({ email: form.email, password: form.password })
        setToast('Login aprovado. Seus jogos estao prontos.')
        return
      }

      if (recoveryStage === 'request') {
        const response = await requestPasswordReset(form.email)
        if (response.resetToken) {
          updateField('resetToken', response.resetToken)
          setToast('Token gerado para ambiente local.')
        } else {
          setToast(response.message)
        }
        setRecoveryStage('reset')
        return
      }

      await resetPassword({
        token: form.resetToken,
        password: form.password
      })
      setToast('Senha atualizada. Entre com sua nova senha.')
      setForm((current) => ({ ...current, password: '', resetToken: '' }))
      switchMode('login')
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError))
    } finally {
      setIsSubmitting(false)
    }
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
                key={`${mode}-${recoveryStage}`}
                initial={{ opacity: 0, x: isCreate ? 16 : -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isCreate ? -16 : 16 }}
                transition={{ duration: 0.18 }}
              >
                <div className="auth-page-form-head">
                  <p className="auth-page-small-label">{getSmallLabel(mode, recoveryStage)}</p>
                  <h2>{title}</h2>
                  <p>{subtitle}</p>
                </div>

                <form className="auth-page-form" onSubmit={submit}>
                  {isCreate && (
                    <AuthField
                      label="Nome ou apelido"
                      value={form.nickname}
                      placeholder="Como a galera te chama?"
                      onChange={(value) => updateField('nickname', value)}
                    />
                  )}
                  <AuthField label="E-mail" type="email" value={form.email} placeholder="voce@email.com" onChange={(value) => updateField('email', value)} />
                  {(!isRecover || recoveryStage === 'reset') && (
                    <AuthField
                      label={isRecover ? 'Nova senha' : 'Senha'}
                      type="password"
                      value={form.password}
                      placeholder="Minimo 8 caracteres"
                      passwordVisible={showPassword}
                      onTogglePassword={() => setShowPassword((value) => !value)}
                      onChange={(value) => updateField('password', value)}
                    />
                  )}
                  {isRecover && recoveryStage === 'reset' && (
                    <AuthField
                      label="Token de recuperacao"
                      value={form.resetToken}
                      placeholder="Cole o token recebido"
                      onChange={(value) => updateField('resetToken', value)}
                    />
                  )}

                  {!isRecover && !isCreate && (
                    <div className="auth-page-inline-row">
                      <button className="auth-page-text-link" type="button" onClick={() => switchMode('recover')}>
                        Esqueci a senha
                      </button>
                    </div>
                  )}
                  {isRecover && (
                    <div className="auth-page-inline-row">
                      <button className="auth-page-text-link" type="button" onClick={() => switchMode('login')}>
                        Voltar para login
                      </button>
                    </div>
                  )}

                  <p className="auth-page-error" role="alert">{error}</p>
                  <Button className="auth-page-button" type="submit" disabled={!canSubmit || isSubmitting} fullWidth>
                    {isSubmitting ? 'Enviando...' : cta}
                  </Button>
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

const AuthField: React.FC<AuthFieldProps> = ({
  label,
  type = 'text',
  value,
  placeholder,
  onChange,
  passwordVisible,
  onTogglePassword
}) => {
  const fieldType = type === 'password' && passwordVisible ? 'text' : type
  const fieldId = `auth-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return (
    <FormField label={label} htmlFor={fieldId} className="auth-page-field">
      <span className="auth-page-input-wrap">
        <Input
          className={`auth-page-input ${type === 'password' ? 'password' : ''}`}
          id={fieldId}
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

function getTitle(mode: AuthMode, recoveryStage: RecoveryStage): string {
  if (mode === 'recover') {
    return recoveryStage === 'request' ? 'Recupere sua senha' : 'Crie uma nova senha'
  }

  return mode === 'signup' ? 'Crie sua conta' : 'Entre na resenha'
}

function getSubtitle(mode: AuthMode, recoveryStage: RecoveryStage): string {
  if (mode === 'recover') {
    return recoveryStage === 'request'
      ? 'Informe seu e-mail para receber um token de recuperacao.'
      : 'Use o token recebido e escolha uma senha nova.'
  }

  return mode === 'signup'
    ? 'Salve seus grupos, favoritos e jogos para comecar mais rapido no proximo role.'
    : 'Acesse seus jogos, planos e grupos salvos para chamar a galera sem enrolacao.'
}

function getCta(mode: AuthMode, recoveryStage: RecoveryStage): string {
  if (mode === 'recover') {
    return recoveryStage === 'request' ? 'Enviar recuperacao' : 'Atualizar senha'
  }

  return mode === 'signup' ? 'Criar conta e jogar' : 'Entrar e comecar'
}

function getSmallLabel(mode: AuthMode, recoveryStage: RecoveryStage): string {
  if (mode === 'recover') {
    return recoveryStage === 'request' ? 'Esqueceu a senha' : 'Nova senha'
  }

  return mode === 'signup' ? 'Novo por aqui' : 'Bem-vindo de volta'
}

function getValidationMessage(
  mode: AuthMode,
  recoveryStage: RecoveryStage
): string {
  if (mode === 'recover' && recoveryStage === 'request') {
    return 'Use um e-mail valido para recuperar a senha.'
  }

  if (mode === 'recover') {
    return 'Informe token e uma nova senha com 8+ caracteres.'
  }

  return mode === 'signup'
    ? 'Preencha nome, e-mail valido e senha com 8+ caracteres.'
    : 'Use um e-mail valido e uma senha com 8+ caracteres.'
}

function getAuthErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === 'EMAIL_ALREADY_EXISTS') {
      return 'Este e-mail ja esta cadastrado. Tente entrar.'
    }

    if (error.code === 'INVALID_CREDENTIALS') {
      return 'E-mail ou senha invalidos.'
    }

    if (error.code === 'INVALID_PASSWORD_RESET_TOKEN') {
      return 'Token de recuperacao invalido ou expirado.'
    }

    return error.message
  }

  return 'Nao foi possivel concluir agora. Tente novamente.'
}

function getRedirectPath(state: unknown): string {
  if (
    typeof state === 'object' &&
    state !== null &&
    'from' in state &&
    typeof state.from === 'string'
  ) {
    return state.from
  }

  return '/perfil'
}

export default LoginPage
