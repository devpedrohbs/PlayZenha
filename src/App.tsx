import { useState } from 'react'
import HomePage from './components/HomePage'
import ImpostorGame from './components/ImpostorGame'
import UltimaNoiteGame from './components/UltimaNoiteGame'
import LoginPage from './components/LoginPage'

export type GameView = 'home' | 'impostor' | 'ultima-noite' | 'login'

function App() {
  const [currentView, setCurrentView] = useState<GameView>('home')

  const startGame = (game: GameView) => {
    setCurrentView(game)
  }

  const backToHome = () => {
    setCurrentView('home')
  }

  return (
    <div className="App">
      {currentView === 'home' && (
        <HomePage onStartGame={startGame} />
      )}
      {currentView === 'login' && (
        <LoginPage onBackToHome={backToHome} />
      )}
      {currentView === 'impostor' && (
        <ImpostorGame onBackToHome={backToHome} />
      )}
      {currentView === 'ultima-noite' && (
        <UltimaNoiteGame onBackToHome={backToHome} />
      )}
    </div>
  )
}

export default App