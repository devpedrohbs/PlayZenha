import { useNavigate } from 'react-router-dom'
import UltimaNoiteGame from '../../games/ultima-noite/UltimaNoiteGame'

const UltimaNoiteGamePage = () => {
  const navigate = useNavigate()

  return <UltimaNoiteGame onBackToHome={() => navigate('/')} />
}

export default UltimaNoiteGamePage
