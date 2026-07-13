import { Link } from 'react-router-dom'

const PricingPage = () => (
  <main className="placeholder-page">
    <section className="placeholder-card">
      <p className="placeholder-eyebrow">Planos</p>
      <h1>Assinaturas PlayZenha</h1>
      <p>Esta rota ja esta preparada para receber checkout, pagamentos e gestao de planos em uma etapa futura.</p>
      <div className="placeholder-actions">
        <Link className="placeholder-button primary" to="/">Ver planos na home</Link>
        <Link className="placeholder-button" to="/jogos">Explorar jogos</Link>
      </div>
    </section>
  </main>
)

export default PricingPage
