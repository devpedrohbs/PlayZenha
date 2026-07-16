import { useNavigate } from 'react-router-dom'
import ImpostorGame from '../../games/impostor/ImpostorGame'
import GameAccessGate from '../../features/game-access/components/GameAccessGate'
import type { ImpostorContent } from '../../features/game-access/game-access.types'

const ImpostorGamePage = () => {
  const navigate = useNavigate()

  return (
    <GameAccessGate<ImpostorContent> slug="impostor">
      {({ content }) => <ImpostorGame themes={content.themes} onBackToGames={() => navigate('/jogos')} />}
    </GameAccessGate>
  )
}

export default ImpostorGamePage
