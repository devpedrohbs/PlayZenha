import { Link } from 'react-router-dom'
import { Button } from '../../../shared/components/ui'
import type { GameCatalogItem } from '../../games-catalog'
import { formatDuration } from '../../games-catalog'

interface HeroSectionProps {
  selectedGame?: GameCatalogItem
  onShowToast: (message: string) => void
}

export const HeroSection = ({ selectedGame, onShowToast }: HeroSectionProps) => (
  <section className="landing-hero">
    <div className="landing-hero-panel">
      <div className="landing-hero-copy">
        <p className="landing-eyebrow">A resenha esfriou?</p>
        <h1>Coloque todo mundo no jogo.</h1>
        <p className="landing-hero-lead">Abra no celular, escolha uma partida e comece a jogar com a galera. Sem download, sem regras longas e com um jogo gratis para testar agora.</p>
        <div className="landing-hero-actions">
          <div className="landing-primary-action">
            <Link className="landing-button landing-button-primary" to="/cadastro" state={{ from: '/jogos/impostor' }}>Criar conta gratis e jogar</Link>
            <small>3 campos, sem cartao. Depois, voce entra direto no Impostor.</small>
          </div>
          <Link className="landing-button landing-button-ghost" to="/jogos">Ver os jogos primeiro</Link>
        </div>
        <div className="landing-hero-proof">
          <span className="landing-proof-pill">1 jogo gratis agora</span>
          <span className="landing-proof-pill">De 2 a 16 jogadores</span>
          <span className="landing-proof-pill">Direto no navegador</span>
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
              <small>{selectedGame ? `${selectedGame.category} - ${formatDuration(selectedGame)}` : 'Atualizando catalogo'}</small>
              <h3>{selectedGame?.name ?? 'PlayZenha'}</h3>
              <div className="landing-prompt-card">
                {selectedGame?.shortDescription ?? 'Carregando o proximo jogo para a sua resenha.'}
              </div>
              <div className="landing-players" aria-label="Jogadores ativos">
                <div className="landing-player">Lu</div>
                <div className="landing-player">Ca</div>
                <div className="landing-player">Bia</div>
              </div>
            </div>
            <div className="landing-phone-cta">
              <Button size="sm" type="button" onClick={() => onShowToast('Proxima rodada pronta.')}>Rodar proxima</Button>
              <Button size="sm" variant="ghost" type="button" onClick={() => onShowToast('Convite pronto para compartilhar.')}>Chamar a galera</Button>
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
