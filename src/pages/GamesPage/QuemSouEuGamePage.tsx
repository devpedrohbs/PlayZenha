import { useNavigate } from 'react-router-dom'
import QuemSouEuGame from '../../games/quem-sou-eu/QuemSouEuGame'

const QuemSouEuGamePage = () => {
  const navigate = useNavigate()

  return <QuemSouEuGame onBackToGames={() => navigate('/jogos')} onBackToHome={() => navigate('/')} />
}

export default QuemSouEuGamePage
