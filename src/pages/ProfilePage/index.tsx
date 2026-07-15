import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Crown,
  Gamepad2,
  KeyRound,
  LogOut,
  Mail,
  Pencil,
  Play,
  ShieldCheck,
  UserCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, Input, Modal, Toast } from '../../shared/components/ui'
import { useAuth } from '../../features/auth/model/auth-context'

const PLAN_DETAILS = {
  free: {
    name: 'Free',
    description: 'Jogos gratuitos para chamar a galera e começar a resenha.'
  },
  premium: {
    name: 'Premium',
    description: 'Mais jogos, categorias e uma experiência sem anúncios.'
  },
  ultimate: {
    name: 'Ultimate',
    description: 'Seu acesso mais completo aos jogos disponíveis no Playzenha.'
  }
} as const

const ProfilePage = () => {
  const { logout, updateProfile, user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [nickname, setNickname] = useState(user?.nickname ?? '')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return undefined

    const timeoutId = window.setTimeout(() => setToast(''), 4000)
    return () => window.clearTimeout(timeoutId)
  }, [toast])

  if (!user) return null

  const isAdmin = user.role === 'admin'
  const planCode = user.planCode ?? 'free'
  const plan = PLAN_DETAILS[planCode]
  const displayName = user.nickname
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
  const joinedAt = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric'
  }).format(new Date(user.createdAt))

  const openEditor = () => {
    setNickname(user.nickname)
    setError('')
    setIsEditing(true)
  }

  const saveNickname = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedNickname = nickname.trim().replace(/\s+/g, ' ')

    if (!normalizedNickname) {
      setError('Informe um apelido válido.')
      return
    }

    if (normalizedNickname.length > 40) {
      setError('O apelido deve ter no máximo 40 caracteres.')
      return
    }

    setError('')
    setIsSaving(true)

    try {
      await updateProfile({ nickname: normalizedNickname })
      setIsEditing(false)
      setToast('Apelido atualizado com sucesso.')
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível salvar o apelido.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_12%_0%,rgba(255,198,3,0.28),transparent_28rem),radial-gradient(circle_at_88%_6%,rgba(4,65,242,0.2),transparent_30rem),linear-gradient(180deg,#f8fbff,#e8f0ff)] px-4 py-7 text-dark-bg sm:px-6 sm:py-12">
      <section className="mx-auto w-full max-w-[1180px]">
        <Link className="inline-flex items-center gap-2 text-sm font-bold text-playzenha-blue transition hover:text-dark-bg" to="/jogos">
          <ChevronRight className="h-4 w-4 rotate-180" /> Voltar para os jogos
        </Link>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.75fr]">
          <article className="relative grid min-h-[360px] content-between gap-8 overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_rgba(4,22,86,0.14)] backdrop-blur sm:p-10">
            <div className="absolute -right-12 -top-14 h-52 w-52 rotate-[16deg] rounded-[48px] bg-playzenha-yellow opacity-90" aria-hidden="true" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="grid h-[104px] w-[104px] shrink-0 place-items-center rounded-[34px] bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.44),transparent_34%),linear-gradient(145deg,#0441F2,#06112F)] font-fredoka text-4xl font-bold tracking-tight text-white shadow-[0_22px_54px_rgba(4,65,242,0.24)]">
                {initials || <UserCircle className="h-10 w-10" />}
              </div>
              <div className="min-w-0">
                <p className="font-geist-pixel text-xs font-bold uppercase tracking-[0.12em] text-playzenha-blue">{isAdmin ? 'Área administrativa' : 'Perfil logado'}</p>
                <h1 className="mt-2 break-words font-fredoka text-5xl leading-[0.9] tracking-tight sm:text-7xl">{displayName}</h1>
                <p className="mt-3 flex items-center gap-2 break-all text-sm font-medium text-slate-500"><Mail className="h-4 w-4 shrink-0" /> {user.email}</p>
              </div>
            </div>

            <div className="relative flex flex-wrap gap-3">
              <Button className="rounded-full bg-playzenha-blue px-5 shadow-[0_18px_34px_rgba(4,65,242,0.28)] hover:bg-dark-bg" type="button" onClick={openEditor}>
                <Pencil className="h-4 w-4" /> Editar perfil
              </Button>
              <Link className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-dark-bg transition hover:-translate-y-0.5 hover:border-playzenha-blue" to="/jogos">
                <Play className="h-4 w-4" /> Começar a jogar
              </Link>
            </div>
          </article>

          <aside className="relative grid min-h-[360px] gap-6 overflow-hidden rounded-[32px] bg-[linear-gradient(145deg,#06112F,#0441F2)] p-6 text-white shadow-[0_24px_80px_rgba(4,22,86,0.22)] sm:p-7">
            <div className="absolute -bottom-12 -right-10 h-44 w-44 rotate-[18deg] rounded-[42px] bg-playzenha-yellow" aria-hidden="true" />
            {isAdmin ? (
              <>
                <span className="relative w-fit rounded-full bg-playzenha-yellow px-3 py-2 font-geist-pixel text-xs font-bold uppercase tracking-[0.12em] text-dark-bg">Acesso administrativo</span>
                <div className="relative">
                  <h2 className="max-w-[10ch] font-fredoka text-5xl leading-[0.92]">Admin ativo</h2>
                  <p className="mt-4 max-w-md leading-relaxed text-white/80">Seu papel libera o acesso comercial aos jogos publicados. As permissões operacionais continuam protegidas pelo backend.</p>
                </div>
                <div className="relative flex items-center gap-2 self-end text-sm font-bold text-white/90"><ShieldCheck className="h-5 w-5 text-playzenha-yellow" /> Conta verificada</div>
              </>
            ) : (
              <>
                <span className="relative w-fit rounded-full bg-playzenha-yellow px-3 py-2 font-geist-pixel text-xs font-bold uppercase tracking-[0.12em] text-dark-bg">Plano atual</span>
                <div className="relative">
                  <h2 className="max-w-[10ch] font-fredoka text-5xl leading-[0.92]">{plan.name} ativo</h2>
                  <p className="mt-4 max-w-md leading-relaxed text-white/80">{plan.description}</p>
                </div>
                <div className="relative self-end">
                  {planCode === 'free' ? (
                    <Link className="inline-flex min-h-[44px] items-center rounded-full bg-playzenha-yellow px-5 text-sm font-bold text-dark-bg transition hover:-translate-y-0.5" to="/planos">Conhecer planos</Link>
                  ) : planCode !== 'ultimate' ? (
                    <Link className="inline-flex min-h-[44px] items-center rounded-full border border-white/25 bg-white/10 px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/20" to="/assinatura">Ver minha assinatura</Link>
                  ) : null}
                </div>
              </>
            )}
          </aside>
        </div>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Resumo do perfil">
          <ProfileStat label={isAdmin ? 'Função' : 'Plano atual'} value={isAdmin ? 'Admin' : plan.name} icon={isAdmin ? <ShieldCheck /> : <Crown />} />
          <ProfileStat label="Status" value={getStatusLabel(user.status)} icon={<CheckCircle2 />} />
          <ProfileStat label="Na resenha desde" value={joinedAt} icon={<CalendarDays />} />
          <ProfileStat label="Acesso aos jogos" value={isAdmin ? 'Completo' : 'Ativo'} icon={<Gamepad2 />} />
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_52px_rgba(4,22,86,0.1)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-fredoka text-3xl">Dados da conta</h2>
                <p className="mt-1 text-sm text-slate-500">Informações principais do seu perfil Playzenha.</p>
              </div>
              <span className="mt-2 h-3 w-3 shrink-0 rounded-full bg-success-green shadow-[0_0_0_6px_rgba(16,185,129,0.14)]" aria-label={`Conta ${getStatusLabel(user.status).toLowerCase()}`} />
            </div>
            <dl className="mt-5 divide-y divide-slate-200">
              <AccountRow label="Apelido" value={displayName} action={<button className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-bold text-playzenha-blue transition hover:border-playzenha-blue" type="button" onClick={openEditor}>Editar</button>} />
              <AccountRow label="E-mail" value={user.email} />
              <AccountRow label="Função" value={isAdmin ? 'Administrador' : 'Jogador'} icon={isAdmin ? <ShieldCheck className="h-4 w-4 text-playzenha-blue" /> : undefined} />
              <AccountRow label="Conta" value={getStatusLabel(user.status)} />
              <AccountRow label="Segurança" value="Senha protegida" icon={<KeyRound className="h-4 w-4" />} />
            </dl>
          </section>

          {isAdmin ? <AdminProfilePanel /> : <PlayerProfilePanel />}
        </div>

        <section className="mt-5 flex flex-col justify-between gap-5 rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_52px_rgba(4,22,86,0.1)] sm:flex-row sm:items-center sm:p-7">
          <div className="flex gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-red-50 text-danger-red"><ShieldCheck className="h-5 w-5" /></span>
            <div>
              <h2 className="font-fredoka text-2xl">Sessão segura</h2>
              <p className="mt-1 text-sm text-slate-500">Encerre o acesso deste dispositivo quando precisar.</p>
            </div>
          </div>
          <Button className="rounded-full border border-red-200 bg-white text-danger-red hover:bg-red-50" type="button" variant="ghost" onClick={() => void logout()}>
            <LogOut className="h-4 w-4" /> Sair da conta
          </Button>
        </section>
      </section>

      <Modal open={isEditing} title="Editar apelido" onClose={() => !isSaving && setIsEditing(false)}>
        <form className="space-y-5" onSubmit={saveNickname}>
          <p className="text-sm">Este nome aparece no seu perfil e nas partidas.</p>
          <Input id="profile-nickname" label="Apelido" value={nickname} onChange={(event) => setNickname(event.target.value)} error={error} maxLength={40} autoFocus disabled={isSaving} required />
          <div className="flex justify-end gap-3"><Button type="button" variant="ghost" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancelar</Button><Button type="submit" disabled={isSaving}>{isSaving ? 'Salvando...' : 'Salvar apelido'}</Button></div>
        </form>
      </Modal>
      <Toast message={toast} variant="success" visible={Boolean(toast)} />
    </main>
  )
}

const ProfileStat = ({ label, value, icon }: { label: string; value: string; icon: ReactNode }) => (
  <article className="rounded-[22px] border border-slate-200 bg-white/85 p-5 shadow-[0_12px_32px_rgba(4,22,86,0.07)]">
    <span className="flex items-center gap-2 text-sm font-bold text-slate-500">{icon} {label}</span>
    <strong className="mt-3 block font-fredoka text-2xl leading-none text-dark-bg">{value}</strong>
  </article>
)

const AccountRow = ({ label, value, action, icon }: { label: string; value: string; action?: ReactNode; icon?: ReactNode }) => (
  <div className="grid gap-2 py-4 sm:grid-cols-[120px_1fr_auto] sm:items-center">
    <dt className="text-sm font-bold text-slate-500">{label}</dt>
    <dd className="flex min-w-0 items-center gap-2 break-all font-bold text-dark-bg">{icon}{value}</dd>
    {action}
  </div>
)

const PlayerProfilePanel = () => (
  <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_52px_rgba(4,22,86,0.1)] sm:p-7">
    <div>
      <h2 className="font-fredoka text-3xl">Minha Playzenha</h2>
      <p className="mt-1 text-sm text-slate-500">Escolha uma partida e chame a galera para a próxima resenha.</p>
    </div>
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      <GameShortcut name="Impostor" description="Blefe e descubra quem não sabe a palavra." to="/jogos/impostor" color="from-[#2b1138] to-[#ff335f]" />
      <GameShortcut name="Contato" description="Dicas rápidas para encontrar a palavra secreta." to="/jogos/contato" color="from-playzenha-blue to-[#7d4dff]" />
    </div>
    <Link className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-playzenha-blue transition hover:text-dark-bg" to="/jogos">Ver biblioteca completa <ChevronRight className="h-4 w-4" /></Link>
  </section>
)

const AdminProfilePanel = () => (
  <section className="rounded-[28px] border border-playzenha-blue/20 bg-[linear-gradient(145deg,rgba(4,65,242,0.08),rgba(255,255,255,0.94))] p-6 shadow-[0_18px_52px_rgba(4,22,86,0.1)] sm:p-7">
    <div>
      <p className="font-geist-pixel text-xs font-bold uppercase tracking-[0.12em] text-playzenha-blue">Centro de controle</p>
      <h2 className="mt-2 font-fredoka text-3xl">Painel do administrador</h2>
      <p className="mt-1 text-sm text-slate-600">Visão da sua responsabilidade operacional no Playzenha.</p>
    </div>
    <div className="mt-5 grid gap-3">
      <AdminCapability icon={<Gamepad2 className="h-5 w-5" />} title="Acesso comercial completo" description="Você pode iniciar qualquer jogo publicado e disponível, sem depender do plano da conta." />
      <AdminCapability icon={<Crown className="h-5 w-5" />} title="Concessões especiais" description="A permissão administrativa permite conceder e revogar ALL_GAMES por meio da API protegida." />
      <AdminCapability icon={<ShieldCheck className="h-5 w-5" />} title="Auditoria de privilégios" description="Concessões e revogações registram responsável, motivo e momento da alteração." />
    </div>
    <Link className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-playzenha-blue transition hover:text-dark-bg" to="/jogos">Abrir biblioteca de jogos <ChevronRight className="h-4 w-4" /></Link>
  </section>
)

const AdminCapability = ({ icon, title, description }: { icon: ReactNode; title: string; description: string }) => (
  <article className="flex gap-3 rounded-[20px] border border-playzenha-blue/15 bg-white/85 p-4">
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-playzenha-blue text-playzenha-yellow">{icon}</span>
    <div>
      <h3 className="font-bold text-dark-bg">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-500">{description}</p>
    </div>
  </article>
)

const GameShortcut = ({ name, description, to, color }: { name: string; description: string; to: string; color: string }) => (
  <Link className="group flex items-center gap-3 rounded-[22px] border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-playzenha-blue hover:shadow-lg" to={to}>
    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-[17px] bg-gradient-to-br ${color} text-white`}><Gamepad2 className="h-6 w-6" /></span>
    <span className="min-w-0 flex-1"><strong className="block font-fredoka text-lg text-dark-bg">{name}</strong><span className="mt-1 block text-sm leading-snug text-slate-500">{description}</span></span>
    <ChevronRight className="h-5 w-5 shrink-0 text-playzenha-blue transition group-hover:translate-x-0.5" />
  </Link>
)

function getStatusLabel(status: 'active' | 'suspended' | 'disabled'): string {
  if (status === 'active') return 'Ativa'
  if (status === 'suspended') return 'Suspensa'
  return 'Desabilitada'
}

export default ProfilePage
