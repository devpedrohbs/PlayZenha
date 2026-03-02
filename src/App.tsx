import { useState } from 'react'
import HomePage from './components/HomePage'
import ImpostorGame from './components/ImpostorGame'

export type GameView = 'home' | 'impostor'

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
      {currentView === 'impostor' && (
        <ImpostorGame onBackToHome={backToHome} />
      )}
    </div>
  )
}

export default App