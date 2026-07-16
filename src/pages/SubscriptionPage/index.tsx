import type { ReactNode } from 'react'
import { Crown, Gamepad2, ShieldCheck } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../features/auth/model/auth-context'

const PLAN_COPY = {
  premium: {
    name: 'Premium',
    price: 'R$ 24,90/mes',
    description: 'Libera os quatro jogos disponiveis para o seu grupo.'
  },
  ultimate: {
    name: 'Ultimate',
    price: 'R$ 34,90/mes',
    description: 'Inclui o Premium e os proximos modos especiais quando forem publicados.'
  }
} as const

const SubscriptionPage = () => {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const requestedPlan = searchParams.get('plano') === 'ultimate' ? 'ultimate' : 'premium'
  const plan = PLAN_COPY[requestedPlan]

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_12%_0%,rgba(255,198,3,0.28),transparent_28rem),radial-gradient(circle_at_88%_6%,rgba(4,65,242,0.2),transparent_30rem),linear-gradient(180deg,#f8fbff,#e8f0ff)] px-4 py-10 text-dark-bg sm:px-6">
      <section className="mx-auto grid w-full max-w-[1040px] gap-5 lg:grid-cols-[1fr_0.78fr]">
        <article className="relative overflow-hidden rounded-[34px] border border-slate-200 bg-white/90 p-7 shadow-[0_24px_80px_rgba(4,22,86,0.14)] sm:p-11">
          <div className="absolute -right-14 -top-14 h-52 w-52 rotate-[16deg] rounded-[52px] bg-playzenha-yellow" aria-hidden="true" />
          <div className="relative">
            <p className="font-geist-pixel text-xs font-bold uppercase tracking-[0.12em] text-playzenha-blue">Plano escolhido</p>
            <h1 className="mt-3 max-w-[10ch] font-fredoka text-5xl leading-[0.92] sm:text-7xl">{plan.name} para a sua resenha</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">{plan.description}</p>
            <div className="mt-7 rounded-[24px] border border-slate-200 bg-white p-5">
              <span className="text-sm font-bold text-slate-500">Assinatura mensal</span>
              <strong className="mt-1 block font-fredoka text-4xl">{plan.price}</strong>
              <span className="mt-2 block text-sm text-slate-500">Cancele quando quiser.</span>
            </div>
          </div>

          <div className="relative mt-7 rounded-[22px] border border-amber-200 bg-amber-50 p-5">
            <strong className="block text-amber-950">As assinaturas ainda nao foram abertas.</strong>
            <p className="mt-2 text-sm leading-relaxed text-amber-900/80">Ainda nao e possivel concluir o pagamento por aqui. Enquanto isso, sua conta gratuita ja libera o Impostor para jogar com a galera.</p>
          </div>

          <div className="relative mt-6 flex flex-wrap gap-3">
            <Link className="inline-flex min-h-[48px] items-center rounded-full bg-playzenha-blue px-5 text-sm font-bold text-white" to="/jogos/impostor">Jogar Impostor gratis</Link>
            <Link className="inline-flex min-h-[48px] items-center rounded-full border border-slate-200 bg-white px-5 text-sm font-bold" to="/planos">Comparar planos</Link>
          </div>
        </article>

        <aside className="grid content-start gap-3 rounded-[34px] bg-[linear-gradient(145deg,#06112F,#0441F2)] p-6 text-white shadow-[0_24px_80px_rgba(4,22,86,0.2)] sm:p-8">
          <span className="w-fit rounded-full bg-playzenha-yellow px-3 py-2 font-geist-pixel text-xs font-bold uppercase tracking-[0.12em] text-dark-bg">Conta ativa</span>
          <h2 className="mt-3 font-fredoka text-4xl leading-none">{user?.nickname}, voce nao perdeu sua escolha.</h2>
          <p className="mt-1 leading-relaxed text-white/75">Quando as assinaturas forem abertas, voce podera voltar e continuar com o plano {plan.name}.</p>
          <div className="mt-4 grid gap-3">
            <Benefit icon={<Crown />} text={`Plano selecionado: ${plan.name}`} />
            <Benefit icon={<ShieldCheck />} text={`Plano atual: ${user?.planCode ?? 'free'}`} />
            <Benefit icon={<Gamepad2 />} text="Impostor liberado agora" />
          </div>
        </aside>
      </section>
    </main>
  )
}

const Benefit = ({ icon, text }: { icon: ReactNode; text: string }) => (
  <div className="flex items-center gap-3 rounded-[20px] border border-white/15 bg-white/10 p-4">
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-playzenha-yellow text-dark-bg">{icon}</span>
    <strong>{text}</strong>
  </div>
)

export default SubscriptionPage
