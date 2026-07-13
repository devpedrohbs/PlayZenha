import { useNavigate } from 'react-router-dom'
import UltimaNoiteGame from '../../games/ultima-noite/UltimaNoiteGame'

const UltimaNoiteGamePage = () => {
  const navigate = useNavigate()

  return <UltimaNoiteGame onBackToGames={() => navigate('/jogos')} onBackToHome={() => navigate('/')} />
}

export default UltimaNoiteGamePage
