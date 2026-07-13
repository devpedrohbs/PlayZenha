import { useNavigate } from 'react-router-dom'
import ImpostorGame from '../../games/impostor/ImpostorGame'

const ImpostorGamePage = () => {
  const navigate = useNavigate()

  return <ImpostorGame onBackToGames={() => navigate('/jogos')} onBackToHome={() => navigate('/')} />
}

export default ImpostorGamePage
