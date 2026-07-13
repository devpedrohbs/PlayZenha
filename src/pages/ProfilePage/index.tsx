import { Link } from 'react-router-dom'
import { Card } from '../../shared/components/ui'

const ProfilePage = () => (
  <main className="placeholder-page">
    <Card className="placeholder-card" as="section">
      <p className="placeholder-eyebrow">Perfil</p>
      <h1>Perfil do jogador</h1>
      <p>Espaco reservado para favoritos, historico, rankings e dados da conta quando a autenticacao real existir.</p>
      <div className="placeholder-actions">
        <Link className="placeholder-button primary" to="/login">Entrar</Link>
        <Link className="placeholder-button" to="/">Voltar para home</Link>
      </div>
    </Card>
  </main>
)

export default ProfilePage
