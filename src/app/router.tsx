import { Navigate, Route, Routes } from 'react-router-dom'
import ContatoGamePage from '../pages/GamesPage/ContatoGamePage'
import GamesPage from '../pages/GamesPage'
import HomePage from '../pages/HomePage'
import ImpostorGamePage from '../pages/GamesPage/ImpostorGamePage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import PricingPage from '../pages/PricingPage'
import ProfilePage from '../pages/ProfilePage'
import QuemSouEuGamePage from '../pages/GamesPage/QuemSouEuGamePage'
import SignupPage from '../pages/SignupPage'
import SubscriptionPage from '../pages/SubscriptionPage'
import UltimaNoiteGamePage from '../pages/GamesPage/UltimaNoiteGamePage'
import ProtectedRoute from '../features/auth/components/ProtectedRoute'

export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/jogos" element={<GamesPage />} />
    <Route path="/jogos/impostor" element={<ProtectedRoute><ImpostorGamePage /></ProtectedRoute>} />
    <Route path="/jogos/ultima-noite" element={<ProtectedRoute><UltimaNoiteGamePage /></ProtectedRoute>} />
    <Route path="/jogos/contato" element={<ProtectedRoute><ContatoGamePage /></ProtectedRoute>} />
    <Route path="/jogos/quem-sou-eu" element={<ProtectedRoute><QuemSouEuGamePage /></ProtectedRoute>} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/cadastro" element={<SignupPage />} />
    <Route path="/planos" element={<PricingPage />} />
    <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
    <Route path="/assinatura" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
    <Route path="/biblioteca" element={<Navigate to="/jogos" replace />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
)

export default AppRouter
