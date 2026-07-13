import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { formatDuration, formatPlayersRange, getGamePath } from '../../features/games-catalog'
import { PRICING_PLANS } from '../../features/pricing/plans'
import { isActivationKey } from '../../shared/utils/keyboard'
import { BENEFITS, GAME_FILTERS, STEPS, USE_CASES } from './model/constants'
import { useHomePage } from './model/useHomePage'

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const {
    activeFilter,
    filteredGames,
    menuOpen,
    selectedGame,
    setActiveFilter,
    setMenuOpen,
    selectGame,
    showToast,
    scrollTo,
    toast
  } = useHomePage()

  return (
    <div className="landing-page">
      <div className="landing-page-shell">
        <nav className="landing-nav" aria-label="Navegacao principal">
          <div className="landing-nav-inner">
            <NavLink className="landing-brand" to="/" aria-label="Playzenha inicio">
              <span className="landing-brand-mark" aria-hidden="true">
                <Icon name="chat" />
              </span>
              Playzenha
            </NavLink>
            <div className="landing-nav-links">
              <a href="#como-funciona" onClick={(event) => { event.preventDefault(); scrollTo('#como-funciona') }}>Como funciona</a>
              <NavLink to="/jogos">Jogos</NavLink>
              <a href="#planos" onClick={(event) => { event.preventDefault(); scrollTo('#planos') }}>Planos</a>
              <NavLink to="/perfil">Perfil</NavLink>
              <a href="#depoimentos" onClick={(event) => { event.preventDefault(); scrollTo('#depoimentos') }}>Depoimentos</a>
            </div>
            <div className="landing-nav-actions">
              <Link className="landing-button landing-button-blue" to="/cadastro">Comecar a jogar</Link>
              <button className="landing-menu-button" type="button" aria-label="Abrir menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
                <Icon name="menu" />
              </button>
            </div>
          </div>
        </nav>

        <main id="top">
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
                      <button type="button" onClick={() => showToast('Proxima rodada pronta.')}>Rodar proxima</button>
                      <button type="button" onClick={() => showToast('Convite pronto para compartilhar.')}>Chamar a galera</button>
                    </div>
                  </div>
                </article>
                <div className="landing-float-card landing-float-a"><strong>Impostor</strong><span>blefe rapido para suspeitar de todo mundo</span></div>
                <div className="landing-float-card landing-float-b"><strong>Ultima Noite</strong><span>papeis secretos para grupo grande</span></div>
                <div className="landing-float-card landing-float-c"><strong>Contato</strong><span>sincronia e palavra secreta</span></div>
              </div>
            </div>
          </section>

          <section className="landing-section reveal" id="como-funciona">
            <SectionHead eyebrow="Como funciona" title="Da tela para a resenha em segundos">
              A experiencia precisa ser obvia na primeira visita: abriu no celular, escolheu o clima do role e todo mundo entra na brincadeira.
            </SectionHead>
            <div className="landing-steps">
              {STEPS.map(({ number, title, text }) => (
                <article className="landing-step-card" key={number}>
                  <div className="landing-step-number">{number}</div>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="landing-section reveal" id="jogos">
            <SectionHead eyebrow="Jogos disponiveis" title="Escolha o jogo que salva o role">
              Cards tocaveis, com microinteracao e feedback no mockup. No celular, o usuario entende a variedade sem precisar ler demais.
            </SectionHead>
            <div className="landing-games-shell">
              <div className="landing-filter-row" aria-label="Filtros de jogos">
                {GAME_FILTERS.map(({ value, label }) => (
                  <button
                    className={`landing-filter-chip ${activeFilter === value ? 'is-active' : ''}`}
                    key={value}
                    type="button"
                    onClick={() => setActiveFilter(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="landing-game-grid">
                {filteredGames.map((game) => (
                  <article
                    className={`landing-game-card ${selectedGame.id === game.id ? 'is-selected' : ''}`}
                    key={game.id}
                    style={{ '--card-color': game.colors?.[1] ?? 'var(--brand-blue)' } as React.CSSProperties}
                    role="button"
                    tabIndex={0}
                    aria-label={`Jogar ${game.name}`}
                    onMouseEnter={() => selectGame(game)}
                    onFocus={() => selectGame(game)}
                    onClick={() => {
                      const path = getGamePath(game)
                      if (path) navigate(path)
                    }}
                    onKeyDown={(event) => {
                      if (isActivationKey(event.key)) {
                        event.preventDefault()
                        const path = getGamePath(game)
                        if (path) navigate(path)
                      }
                    }}
                  >
                    <span className="landing-card-tag">{game.category} - {formatPlayersRange(game)} jogadores</span>
                    <h3>{game.name}</h3>
                    <p>{game.shortDescription}</p>
                    <span className="landing-card-play">Jogar - {formatDuration(game)}</span>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="landing-section reveal">
            <SectionHead eyebrow="Feito para qualquer role" title="Quando junta gente, cabe Playzenha">
              A linguagem e os cenarios sao brasileiros, sociais e diretos. Nada de app serio demais para um momento que precisa ser leve.
            </SectionHead>
            <div className="landing-use-strip">
              {USE_CASES.map(({ icon, title }) => (
                <article className="landing-use-card" key={title}>
                  <span className="landing-mini-icon"><Icon name={icon} /></span>
                  <h3>{title}</h3>
                </article>
              ))}
            </div>
          </section>

          <section className="landing-section reveal">
            <div className="landing-benefits">
              <div className="landing-benefit-hero">
                <div>
                  <p className="landing-eyebrow">Beneficios</p>
                  <h2>Menos enrolacao. Mais risada.</h2>
                  <p>Playzenha foi pensado para entrar no meio do role sem virar uma explicacao longa. O jogo precisa caber na mao e no tempo da galera.</p>
                </div>
                <Link className="landing-button landing-button-primary" to="/cadastro">Comecar de boa</Link>
              </div>
              <div className="landing-benefit-stack">
                {BENEFITS.map(({ title, text }) => (
                  <article className="landing-benefit-card" key={title}>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="landing-section reveal" id="planos">
            <SectionHead eyebrow="Planos" title="Comece gratis, evolua quando o role pedir">
              Tres caminhos simples: testar, jogar sempre ou levar para uma festa grande com experiencias especiais.
            </SectionHead>
            <div className="landing-plans">
              {PRICING_PLANS.map((plan) => (
                <article className={`landing-plan-card ${plan.featured ? 'featured' : ''} ${plan.highlighted ? 'highlighted' : ''}`} key={plan.name}>
                  {plan.badge && <span className="landing-plan-badge">{plan.badge}</span>}
                  <div className="landing-plan-heading">
                    <h3>{plan.name}</h3>
                  </div>
                  <div className="landing-price-card">
                    <span>Plano</span>
                    <div className="landing-price">{plan.price}</div>
                  </div>
                  <div className="landing-plan-copy">
                    {plan.label && <strong className="landing-plan-label">{plan.label}</strong>}
                    <p>{plan.description}</p>
                  </div>
                  <div className="landing-plan-sections">
                    {plan.sections.map((section, sectionIndex) => (
                      <div className="landing-plan-section" key={`${plan.name}-${section.title ?? sectionIndex}`}>
                        {section.title && <h4>{section.title}</h4>}
                        <ul className="landing-plan-list">
                          {section.items.map((item) => (
                            <li className={`is-${item.tone ?? 'included'}`} key={item.text}>
                              <span className="landing-plan-icon" aria-hidden="true" />
                              {item.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <button
                    className={`landing-button landing-button-${plan.variant}`}
                    type="button"
                    onClick={() => navigate('/cadastro')}
                  >
                    {plan.cta}
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="landing-section reveal" id="depoimentos">
            <div className="landing-testimonials">
              <div className="landing-quote-wall">
                <div>
                  <p className="landing-eyebrow">Social proof</p>
                  <h2>O grupo entende antes da primeira rodada acabar</h2>
                </div>
                <p>Historias curtas do tipo de momento em que o Playzenha entra melhor: churrasco, grupo novo e aquela hora em que alguem precisa puxar a energia.</p>
              </div>
              <div className="landing-testimonial-list">
                <Testimonial quote="Usei no churrasco e virou a atracao principal da noite." author="Marina, resenha de sabado" />
                <Testimonial quote="Foi perfeito para quebrar o gelo no grupo." author="Rafa, aniversario com amigos novos" />
                <Testimonial quote="Todo mundo abriu no celular e em 2 minutos ja estava jogando." author="Joao, pre-role antes da festa" />
              </div>
            </div>
          </section>

          <section className="landing-final-cta reveal">
            <p className="landing-eyebrow">Pronto para jogar</p>
            <h2>Seu proximo role pode ser muito mais divertido.</h2>
            <p>Abra no celular, chame a galera e escolha o primeiro jogo. O resto vira historia do grupo.</p>
            <Link className="landing-button landing-button-primary" to="/cadastro">Comecar a jogar agora</Link>
          </section>
        </main>

        <footer className="landing-footer">
          <span>Playzenha</span>
          <span>Jogos presenciais para resenhas, festas e grupos de amigos.</span>
        </footer>
      </div>
      <div className={`landing-toast ${toast ? 'is-visible' : ''}`} role="status" aria-live="polite">{toast}</div>
    </div>
  )
}

const SectionHead: React.FC<{ eyebrow: string; title: string; children: React.ReactNode }> = ({ eyebrow, title, children }) => (
  <div className="landing-section-head">
    <div>
      <p className="landing-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
    <p>{children}</p>
  </div>
)

const Testimonial: React.FC<{ quote: string; author: string }> = ({ quote, author }) => (
  <article className="landing-testimonial-card">
    <p>"{quote}"</p>
    <span>{author}</span>
  </article>
)

const Icon: React.FC<{ name: string }> = ({ name }) => {
  const paths: Record<string, React.ReactNode> = {
    chat: <><path d="M7 8h10a4 4 0 0 1 4 4v1a4 4 0 0 1-4 4h-1.5l-2 2-2-2H7a4 4 0 0 1-4-4v-1a4 4 0 0 1 4-4Z" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    party: <><path d="M8 21l8-18 2 7 4 4-14 7Z" /><path d="M13 9l2 2" /></>,
    grill: <><path d="M5 14h14M7 14l-2 7M17 14l2 7M8 7c0-2 2-2 2-4M14 7c0-2 2-2 2-4" /></>,
    gift: <><path d="M4 11h16v10H4z" /><path d="M4 15h16M12 11v10M8 11c-2 0-3-1-3-2s1-2 2-2c2 0 3 4 5 4s3-4 5-4c1 0 2 1 2 2s-1 2-3 2" /></>,
    home: <><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></>,
    trip: <><path d="M3 7h18v11H3z" /><path d="M7 7V5h10v2M7 18v2M17 18v2" /></>,
    drink: <><path d="M6 3h12l-1 8a5 5 0 0 1-10 0L6 3Z" /><path d="M12 16v5M8 21h8" /></>,
    group: <><path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM16 13a4 4 0 1 0 0-8" /><path d="M2 21a6 6 0 0 1 12 0M14 21a6 6 0 0 1 8-5.6" /></>
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

export default HomePage
