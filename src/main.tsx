import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './styles/index.css'
import './styles/tokens.css'
import './styles/utilities.css'
import './features/landing/landing.css'
import './pages/placeholder.css'
import './games/impostor/impostor.css'
import './games/quem-esta-mentindo/quem-esta-mentindo.css'
import './features/auth/auth.css'
import './styles/animations.css'
import './styles/globals.css'
import './games/shared/game-shell.css'
import './features/games-catalog/games-catalog.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
