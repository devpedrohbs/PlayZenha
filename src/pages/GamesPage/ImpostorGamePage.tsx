import { useNavigate } from 'react-router-dom'
import ImpostorGame from '../../games/impostor/ImpostorGame'

const ImpostorGamePage = () => {
  const navigate = useNavigate()

  return <ImpostorGame onBackToHome={() => navigate('/')} />
}

export default ImpostorGamePage
