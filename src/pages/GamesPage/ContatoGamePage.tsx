import { useNavigate } from 'react-router-dom'
import ContatoGame from '../../games/contato/ContatoGame'
import GameAccessGate from '../../features/game-access/components/GameAccessGate'
import type { ContatoContent } from '../../features/game-access/game-access.types'

const ContatoGamePage = () => {
  const navigate = useNavigate()

  return (
    <GameAccessGate<ContatoContent> slug="contato">
      {({ content }) => <ContatoGame words={content.words} onBackToGames={() => navigate('/jogos')} />}
    </GameAccessGate>
  )
}

export default ContatoGamePage
