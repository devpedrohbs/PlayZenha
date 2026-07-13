import { Link } from 'react-router-dom'

const SubscriptionPage = () => (
  <main className="placeholder-page">
    <section className="placeholder-card">
      <p className="placeholder-eyebrow">Assinatura</p>
      <h1>Gerenciar assinatura</h1>
      <p>Rota preparada para status do plano, upgrade, cancelamento e integracao futura com pagamentos.</p>
      <div className="placeholder-actions">
        <Link className="placeholder-button primary" to="/planos">Ver planos</Link>
        <Link className="placeholder-button" to="/">Voltar para home</Link>
      </div>
    </section>
  </main>
)

export default SubscriptionPage
