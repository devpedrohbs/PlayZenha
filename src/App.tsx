import { useState } from 'react'
import HomePage from './components/HomePage'
import ImpostorGame from './components/ImpostorGame'
import UltimaNoiteGame from './components/UltimaNoiteGame'
import LoginPage from './components/LoginPage'
import ContatoGame from './components/ContatoGame'
import QuemSouEuGame from './components/QuemSouEuGame'

export type GameView = 'home' | 'impostor' | 'ultima-noite' | 'contato' | 'quem-sou-eu' | 'login'

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
      {currentView === 'contato' && (
        <ContatoGame onBackToHome={backToHome} />
      )}
      {currentView === 'quem-sou-eu' && (
        <QuemSouEuGame onBackToHome={backToHome} />
      )}
    </div>
  )
}

export default App