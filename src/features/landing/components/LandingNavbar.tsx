import { Link, NavLink } from 'react-router-dom'
import type { AuthUser } from '../../auth/api/auth.types'
import { LandingIcon } from './LandingIcon'

interface LandingNavbarProps {
  menuOpen: boolean
  onMenuToggle: () => void
  onSectionLinkClick: (selector: string) => void
  user: AuthUser | null
  onLogout: () => void
}

export const LandingNavbar = ({
  menuOpen,
  onMenuToggle,
  onSectionLinkClick,
  user,
  onLogout
}: LandingNavbarProps) => (
  <nav className="landing-nav" aria-label="Navegacao principal">
    <div className="landing-nav-inner">
      <NavLink className="landing-brand" to="/" aria-label="Playzenha inicio">
        <span className="landing-brand-mark" aria-hidden="true">
          <LandingIcon name="chat" />
        </span>
        Playzenha
      </NavLink>
      <div className="landing-nav-links">
        <a href="#como-funciona" onClick={(event) => { event.preventDefault(); onSectionLinkClick('#como-funciona') }}>Como funciona</a>
        <NavLink to="/jogos">Jogos</NavLink>
        <a href="#planos" onClick={(event) => { event.preventDefault(); onSectionLinkClick('#planos') }}>Planos</a>
        {user ? (
          <>
            <NavLink to="/perfil">Meu perfil</NavLink>
            <NavLink to="/assinatura">Minha assinatura</NavLink>
            <button className="landing-nav-logout" type="button" onClick={onLogout}>Sair</button>
          </>
        ) : <NavLink to="/perfil">Perfil</NavLink>}
        <a href="#duvidas" onClick={(event) => { event.preventDefault(); onSectionLinkClick('#duvidas') }}>Duvidas</a>
      </div>
      <div className="landing-nav-actions">
        {user ? (
          <>
            <Link className="landing-profile-link" to="/perfil" aria-label="Abrir meu perfil">
              <span className="landing-profile-avatar" aria-hidden="true">{user.nickname.slice(0, 1).toUpperCase()}</span>
              <span className="landing-profile-name">{user.nickname}</span>
            </Link>
            <button className="landing-logout-button" type="button" onClick={onLogout}>Sair</button>
          </>
        ) : (
          <Link className="landing-button landing-button-blue" to="/cadastro" state={{ from: '/jogos/impostor' }}>Jogar gratis</Link>
        )}
        <button className="landing-menu-button" type="button" aria-label="Abrir menu" aria-expanded={menuOpen} onClick={onMenuToggle}>
          <LandingIcon name="menu" />
        </button>
      </div>
    </div>
  </nav>
)
