import { useNavigate } from 'react-router-dom'
import QuemSouEuGame from '../../games/quem-sou-eu/QuemSouEuGame'
import GameAccessGate from '../../features/game-access/components/GameAccessGate'

const QuemSouEuGamePage = () => {
  const navigate = useNavigate()

  return (
    <GameAccessGate<Record<string, never>> slug="quem-sou-eu">
      {() => <QuemSouEuGame onBackToGames={() => navigate('/jogos')} onBackToHome={() => navigate('/')} />}
    </GameAccessGate>
  )
}

export default QuemSouEuGamePage
