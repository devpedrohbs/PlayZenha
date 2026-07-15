import { useNavigate } from 'react-router-dom'
import UltimaNoiteGame from '../../games/ultima-noite/UltimaNoiteGame'
import GameAccessGate from '../../features/game-access/components/GameAccessGate'

const UltimaNoiteGamePage = () => {
  const navigate = useNavigate()

  return (
    <GameAccessGate<Record<string, never>> slug="ultima-noite">
      {() => <UltimaNoiteGame onBackToGames={() => navigate('/jogos')} onBackToHome={() => navigate('/')} />}
    </GameAccessGate>
  )
}

export default UltimaNoiteGamePage
