import { Link, NavLink } from 'react-router-dom'
import { LandingIcon } from './LandingIcon'

interface LandingNavbarProps {
  menuOpen: boolean
  onMenuToggle: () => void
  onSectionLinkClick: (selector: string) => void
}

export const LandingNavbar = ({
  menuOpen,
  onMenuToggle,
  onSectionLinkClick
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
        <NavLink to="/perfil">Perfil</NavLink>
        <a href="#depoimentos" onClick={(event) => { event.preventDefault(); onSectionLinkClick('#depoimentos') }}>Depoimentos</a>
      </div>
      <div className="landing-nav-actions">
        <Link className="landing-button landing-button-blue" to="/cadastro">Comecar a jogar</Link>
        <button className="landing-menu-button" type="button" aria-label="Abrir menu" aria-expanded={menuOpen} onClick={onMenuToggle}>
          <LandingIcon name="menu" />
        </button>
      </div>
    </div>
  </nav>
)
