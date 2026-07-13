import { Link } from 'react-router-dom'
import type { GameCatalogItem } from '../../games-catalog'
import { formatDuration } from '../../games-catalog'

interface HeroSectionProps {
  selectedGame: GameCatalogItem
  onShowToast: (message: string) => void
}

export const HeroSection = ({ selectedGame, onShowToast }: HeroSectionProps) => (
  <section className="landing-hero">
    <div className="landing-hero-panel">
      <div className="landing-hero-copy">
        <p className="landing-eyebrow">Jogos presenciais pelo celular</p>
        <h1>Transforme qualquer role em um jogo</h1>
        <p className="landing-hero-lead">Jogos rapidos, engracados e interativos para jogar com seus amigos direto pelo celular. Sem baixar nada, sem explicar demais, sem deixar o role morrer.</p>
        <div className="landing-hero-actions">
          <Link className="landing-button landing-button-primary" to="/cadastro">Comecar a jogar</Link>
          <Link className="landing-button landing-button-ghost" to="/jogos">Ver jogos disponiveis</Link>
        </div>
        <div className="landing-hero-proof">
          <span className="landing-proof-pill">Direto no navegador</span>
          <span className="landing-proof-pill">Feito para jogar em grupo</span>
          <span className="landing-proof-pill">Planos gratis, premium e festa</span>
        </div>
      </div>

      <div className="landing-hero-visual">
        <article className="landing-phone" aria-label="Mockup do Playzenha no celular">
          <div className="landing-phone-screen">
            <div className="landing-phone-top">
              <span>Playzenha</span>
              <span>Ao vivo</span>
            </div>
            <div className="landing-game-live">
              <small>{selectedGame.category} - {formatDuration(selectedGame)}</small>
              <h3>{selectedGame.name}</h3>
              <div className="landing-prompt-card">{selectedGame.shortDescription}</div>
              <div className="landing-players" aria-label="Jogadores ativos">
                <div className="landing-player">Lu</div>
                <div className="landing-player">Ca</div>
                <div className="landing-player">Bia</div>
              </div>
            </div>
            <div className="landing-phone-cta">
              <button type="button" onClick={() => onShowToast('Proxima rodada pronta.')}>Rodar proxima</button>
              <button type="button" onClick={() => onShowToast('Convite pronto para compartilhar.')}>Chamar a galera</button>
            </div>
          </div>
        </article>
        <div className="landing-float-card landing-float-a"><strong>Impostor</strong><span>blefe rapido para suspeitar de todo mundo</span></div>
        <div className="landing-float-card landing-float-b"><strong>Ultima Noite</strong><span>papeis secretos para grupo grande</span></div>
        <div className="landing-float-card landing-float-c"><strong>Contato</strong><span>sincronia e palavra secreta</span></div>
      </div>
    </div>
  </section>
)
