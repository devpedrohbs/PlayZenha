import { useNavigate } from 'react-router-dom'
import QuemEstaMentindoGame from '../../games/quem-esta-mentindo/QuemEstaMentindoGame'
import GameAccessGate from '../../features/game-access/components/GameAccessGate'
import type { QuemEstaMentindoContent } from '../../features/game-access/game-access.types'

const QuemEstaMentindoGamePage = () => {
  const navigate = useNavigate()
  return <GameAccessGate<QuemEstaMentindoContent> slug="quem-esta-mentindo">{({ content }) => <QuemEstaMentindoGame questions={content.questions} onBackToGames={() => navigate('/jogos')} />}</GameAccessGate>
}

export default QuemEstaMentindoGamePage
