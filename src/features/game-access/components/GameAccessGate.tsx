import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Crown, Gamepad2, RefreshCw, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { PricingPlanCards } from '../../landing/components/PricingSection'
import { useAuth } from '../../auth/model/auth-context'
import type { PlanCode } from '../../subscriptions'
import { ApiError } from '../../../shared/api/api-error'
import { startAuthorizedGame } from '../game-access.api'
import type { AuthorizedGame } from '../game-access.types'
import '../game-access.css'

interface GameAccessGateProps<TContent> {
  slug: string
  children: (authorization: AuthorizedGame<TContent>) => ReactNode
}

interface DeniedGameDetails {
  gameName: string
  requiredPlan: PlanCode
}

const GameAccessGate = <TContent,>({ slug, children }: GameAccessGateProps<TContent>) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [authorization, setAuthorization] = useState<AuthorizedGame<TContent> | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [attempt, setAttempt] = useState(0)

  const retry = useCallback(() => setAttempt((value) => value + 1), [])

  useEffect(() => {
    let active = true
    setAuthorization(null)
    setError(null)

    startAuthorizedGame<TContent>(slug)
      .then((result) => {
        if (active) setAuthorization(result)
      })
      .catch((caughtError: unknown) => {
        if (active) setError(caughtError)
      })

    return () => { active = false }
  }, [attempt, slug])

  if (authorization) return <>{children(authorization)}</>
  if (!error) return <GameAccessLoading />

  const upgradeRequired = error instanceof ApiError && error.code === 'GAME_ACCESS_DENIED'
  const currentPlan = user?.planCode ?? 'free'
  const details = getDeniedGameDetails(error)

  if (!upgradeRequired) {
    return <GameAccessError error={error} onRetry={retry} />
  }

  return (
    <main className="game-access-page px-4 py-8 sm:px-6 sm:py-12">
      <section className="mx-auto w-full max-w-[1180px]">
        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.82fr]">
          <article className="relative grid min-h-[440px] content-between gap-8 overflow-hidden rounded-[34px] border border-slate-200 bg-white/90 p-7 shadow-[0_24px_80px_rgba(4,22,86,0.14)] backdrop-blur sm:p-12">
            <div className="absolute -right-14 -top-14 h-56 w-56 rotate-[15deg] rounded-[54px] bg-playzenha-yellow opacity-90" aria-hidden="true" />
            <div className="relative">
              <span className="grid h-[108px] w-[108px] place-items-center rounded-[34px] bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.44),transparent_34%),linear-gradient(145deg,#0441F2,#06112F)] text-white shadow-[0_24px_58px_rgba(4,65,242,0.26)]"><ShieldCheck className="h-12 w-12" /></span>
              <p className="mt-7 font-geist-pixel text-xs font-bold uppercase tracking-[0.12em] text-playzenha-blue">Jogo bloqueado</p>
              <h1 className="game-access-title mt-3">Esse jogo pede um plano maior.</h1>
              <p className="game-access-copy mt-6 leading-relaxed"><strong className="text-dark-bg">{details.gameName}</strong> está liberado a partir do plano <strong className="text-dark-bg">{getPlanLabel(details.requiredPlan)}</strong>. Escolha um plano para destravar a próxima resenha.</p>
            </div>
            <div className="relative flex flex-wrap gap-3">
              <button className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-playzenha-blue px-5 text-sm font-bold text-white shadow-[0_18px_36px_rgba(4,65,242,0.28)] transition hover:-translate-y-0.5 hover:bg-dark-bg" type="button" onClick={() => navigate('/planos')}>Desbloquear agora</button>
              <Link className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-dark-bg transition hover:-translate-y-0.5 hover:border-playzenha-blue" to="/jogos">Ver jogos grátis</Link>
            </div>
          </article>

          <aside className="relative grid min-h-[440px] gap-6 overflow-hidden rounded-[34px] bg-[linear-gradient(145deg,#06112F,#0441F2)] p-6 text-white shadow-[0_24px_80px_rgba(4,22,86,0.22)] sm:p-7">
            <div className="absolute -bottom-12 -right-11 h-48 w-48 rotate-[18deg] rounded-[46px] bg-playzenha-yellow" aria-hidden="true" />
            <span className="relative w-fit rounded-full bg-playzenha-yellow px-3 py-2 font-geist-pixel text-xs font-bold uppercase tracking-[0.12em] text-dark-bg">Acesso limitado</span>
            <div className="relative">
              <h2 className="game-access-panel-title">Seu plano ainda não libera este jogo.</h2>
              <p className="mt-4 text-base leading-relaxed text-white/80">Compare onde você está e o que precisa para entrar na partida.</p>
            </div>
            <div className="relative grid gap-3">
              <StatusRow icon={<Gamepad2 className="h-5 w-5" />} label="Plano atual" value={getPlanLabel(currentPlan)} />
              <StatusRow icon={<ShieldCheck className="h-5 w-5" />} label="Mínimo para jogar" value={getPlanLabel(details.requiredPlan)} />
              <StatusRow icon={<Crown className="h-5 w-5" />} label="Ao desbloquear" value="Mais jogos e modos de festa" />
            </div>
          </aside>
        </div>

        <section className="mt-5" aria-label="Opções de plano para desbloquear o jogo">
          <PricingPlanCards
            currentPlanCode={currentPlan}
            recommendedPlanCode={details.requiredPlan}
            onPlanClick={() => navigate('/planos')}
          />
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          <BenefitCard icon={<Gamepad2 className="h-6 w-6" />} title="Mais jogos na hora" description="Quando o grupo cansar dos básicos, você já tem novos modos para puxar." />
          <BenefitCard icon={<Crown className="h-6 w-6" />} title="Plano certo para a resenha" description="Veja os benefícios completos em cada plano antes de decidir." />
          <BenefitCard icon={<ShieldCheck className="h-6 w-6" />} title="Acesso validado com segurança" description="O Playzenha confirma seu plano antes de liberar o conteúdo de cada jogo." />
        </section>
      </section>
    </main>
  )
}

const StatusRow = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => (
  <div className="grid grid-cols-[46px_1fr] items-center gap-3 rounded-[22px] border border-white/15 bg-white/10 p-3">
    <span className="grid h-[46px] w-[46px] place-items-center rounded-2xl bg-playzenha-yellow text-dark-bg">{icon}</span>
    <span><span className="block text-sm text-white/70">{label}</span><strong className="block text-white">{value}</strong></span>
  </div>
)

const BenefitCard = ({ icon, title, description }: { icon: ReactNode; title: string; description: string }) => (
  <article className="rounded-[22px] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_48px_rgba(4,22,86,0.08)]">
    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(145deg,#0441F2,#06112F)] text-white">{icon}</span>
    <h2 className="game-access-benefit-title mt-4">{title}</h2>
    <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
  </article>
)

const GameAccessLoading = () => (
  <main className="game-access-page flex items-center px-4 py-10 sm:px-6">
    <section className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-[34px] border border-slate-200 bg-white/90 p-10 shadow-[0_24px_80px_rgba(4,22,86,0.16)]">
      <div className="absolute -right-12 -top-14 h-48 w-48 rotate-[16deg] rounded-[48px] bg-playzenha-yellow opacity-90" aria-hidden="true" />
      <div className="relative"><span className="grid h-16 w-16 place-items-center rounded-[23px] bg-playzenha-blue text-playzenha-yellow"><RefreshCw className="h-8 w-8 animate-spin" /></span><p className="mt-6 font-geist-pixel text-xs font-bold uppercase tracking-[0.12em] text-playzenha-blue">Acesso ao jogo</p><h1 className="game-access-title mt-3">Validando seu acesso.</h1><p className="game-access-copy mt-5 leading-relaxed">Confirmando sua conta e seu plano com segurança.</p></div>
    </section>
  </main>
)

const GameAccessError = ({ error, onRetry }: { error: unknown; onRetry: () => void }) => (
  <main className="game-access-page flex items-center px-4 py-10 sm:px-6">
    <section className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-[34px] border border-slate-200 bg-white/90 p-10 shadow-[0_24px_80px_rgba(4,22,86,0.16)]">
      <div className="relative"><span className="grid h-16 w-16 place-items-center rounded-[23px] bg-red-50 text-danger-red"><RefreshCw className="h-8 w-8" /></span><p className="mt-6 font-geist-pixel text-xs font-bold uppercase tracking-[0.12em] text-playzenha-blue">Partida indisponível</p><h1 className="game-access-title mt-3">Não foi possível iniciar a partida.</h1><p className="game-access-copy mt-5 leading-relaxed">{error instanceof Error ? error.message : 'Tente novamente em alguns instantes.'}</p><div className="mt-8 flex flex-wrap gap-3"><button className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-playzenha-blue px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-dark-bg" type="button" onClick={onRetry}><RefreshCw className="h-4 w-4" /> Tentar novamente</button><Link className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-dark-bg transition hover:-translate-y-0.5 hover:border-playzenha-blue" to="/jogos">Voltar aos jogos</Link></div></div>
    </section>
  </main>
)

function getDeniedGameDetails(error: unknown): DeniedGameDetails {
  if (error instanceof ApiError && isRecord(error.details) && isRecord(error.details.game)) {
    const gameName = error.details.game.name
    const requiredPlan = error.details.game.requiredPlan
    if (typeof gameName === 'string' && isPlanCode(requiredPlan)) {
      return { gameName, requiredPlan }
    }
  }

  return { gameName: 'Este jogo', requiredPlan: 'premium' }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isPlanCode(value: unknown): value is PlanCode {
  return value === 'free' || value === 'premium' || value === 'ultimate'
}

function getPlanLabel(planCode: PlanCode): string {
  if (planCode === 'free') return 'Free'
  if (planCode === 'premium') return 'Premium'
  return 'Ultimate'
}

export default GameAccessGate
