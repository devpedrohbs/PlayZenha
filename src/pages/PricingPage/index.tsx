import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/model/auth-context'
import { PricingSection } from '../../features/landing/components/PricingSection'
import type { PlanCode } from '../../features/subscriptions'

const PricingPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const selectPlan = (planCode: PlanCode) => {
    if (planCode === 'free') {
      navigate(user ? '/jogos/impostor' : '/cadastro', {
        state: user ? undefined : { from: '/jogos/impostor' }
      })
      return
    }

    const target = `/assinatura?plano=${planCode}`
    navigate(user ? target : '/cadastro', {
      state: user ? undefined : { from: target }
    })
  }

  return (
    <main className="landing-page">
      <nav className="game-library-nav" aria-label="Navegacao dos planos">
        <Link className="game-library-back" to="/">Voltar para o inicio</Link>
        <div className="game-library-brand">
          <span>Playzenha</span>
          <strong>Planos</strong>
        </div>
        <Link className="game-library-back" to="/jogos">Ver jogos</Link>
      </nav>
      <PricingSection reveal={false} onPlanClick={selectPlan} />
    </main>
  )
}

export default PricingPage
