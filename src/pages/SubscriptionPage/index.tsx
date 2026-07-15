import { Link } from 'react-router-dom'
import { useAuth } from '../../features/auth/model/auth-context'
import { Card } from '../../shared/components/ui'

const SubscriptionPage = () => {
  const { user } = useAuth()

  return (
    <main className="placeholder-page">
      <Card className="placeholder-card" as="section">
        <p className="placeholder-eyebrow">Assinatura</p>
        <h1>Gerenciar assinatura</h1>
        <p>Plano atual: {user?.planCode ?? 'free'}. A proxima etapa natural e conectar upgrade/cancelamento a um provedor de pagamento.</p>
        <div className="placeholder-actions">
          <Link className="placeholder-button primary" to="/planos">Ver planos</Link>
          <Link className="placeholder-button" to="/">Voltar para home</Link>
        </div>
      </Card>
    </main>
  )
}

export default SubscriptionPage
