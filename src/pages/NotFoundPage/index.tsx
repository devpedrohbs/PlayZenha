import { Link } from 'react-router-dom'
import { Card } from '../../shared/components/ui'

const NotFoundPage = () => (
  <main className="placeholder-page">
    <Card className="placeholder-card" as="section">
      <p className="placeholder-eyebrow">404</p>
      <h1>Essa rota saiu da resenha</h1>
      <p>A pagina que voce tentou abrir nao existe ou ainda nao foi criada.</p>
      <div className="placeholder-actions">
        <Link className="placeholder-button primary" to="/">Voltar para home</Link>
        <Link className="placeholder-button" to="/jogos">Ver jogos</Link>
      </div>
    </Card>
  </main>
)

export default NotFoundPage
