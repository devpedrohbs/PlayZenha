import { Link, useNavigate } from 'react-router-dom'
import { PricingSection } from '../../features/landing/components/PricingSection'

const PricingPage = () => {
  const navigate = useNavigate()

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
      <PricingSection reveal={false} onSignupClick={() => navigate('/cadastro')} />
    </main>
  )
}

export default PricingPage
