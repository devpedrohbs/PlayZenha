import { useNavigate } from 'react-router-dom'
import ContatoGame from '../../games/contato/ContatoGame'

const ContatoGamePage = () => {
  const navigate = useNavigate()

  return <ContatoGame onBackToGames={() => navigate('/jogos')} onBackToHome={() => navigate('/')} />
}

export default ContatoGamePage
