import React, { useEffect, useMemo, useState } from 'react'
import { GameView } from '../App'

interface HomePageProps {
  onStartGame: (game: GameView) => void
}

type GameCategory = 'all' | 'quebra-gelo' | 'desafio' | 'festa'

interface LandingGame {
  id: string
  category: Exclude<GameCategory, 'all'>
  view: GameView
  title: string
  tag: string
  prompt: string
  description: string
  color: string
}

const games: LandingGame[] = [
  {
    id: 'impostor',
    category: 'desafio',
    view: 'impostor',
    title: 'Impostor',
    tag: 'Deducao social',
    prompt: 'Descubra quem esta blefando antes que o impostor entenda o tema.',
    description: 'Um tema secreto, um impostor perdido e uma rodada cheia de suspeitas.',
    color: 'var(--brand-blue)'
  },
  {
    id: 'ultima-noite',
    category: 'festa',
    view: 'ultima-noite',
    title: 'Ultima Noite',
    tag: 'Blefe e estrategia',
    prompt: 'Lobos, anjos e detetives entram em uma noite de acusacoes.',
    description: 'Uma experiencia de grupo grande com mediador, papeis secretos e votacao.',
    color: 'var(--party-purple)'
  },
  {
    id: 'contato',
    category: 'quebra-gelo',
    view: 'contato',
    title: 'Contato',
    tag: 'Sincronia',
    prompt: 'Dois jogadores tentam chegar na palavra antes que as letras acabem.',
    description: 'Um juiz, uma palavra secreta e pistas reveladas aos poucos.',
    color: 'var(--party-green)'
  },
  {
    id: 'quem-sou-eu',
    category: 'desafio',
    view: 'quem-sou-eu',
    title: 'Quem Sou Eu',
    tag: 'Adivinhacao',
    prompt: 'Escreva personagens em segredo e tente adivinhar com o celular na testa.',
    description: 'Rodadas rapidas de personagem secreto, tempo e muita torcida.',
    color: 'var(--brand-yellow)'
  }
]

const steps = [
  ['01', 'Abra no celular', 'Nada de instalacao. O link abre rapido e ja coloca o grupo no clima.'],
  ['02', 'Escolha o jogo', 'Verdade, desafio, quiz ou modo festa conforme a energia do momento.'],
  ['03', 'Comece a resenha', 'As rodadas sao curtas, faceis de entender e feitas para gerar assunto.']
]

const useCases = [
  ['party', 'Festa com amigos'],
  ['grill', 'Churrasco'],
  ['gift', 'Aniversario'],
  ['home', 'Resenha em casa'],
  ['trip', 'Viagem'],
  ['drink', 'Pre-role'],
  ['group', 'Encontro em grupo']
]

const benefits = [
  ['Sem baixar nada', 'Abriu o link, escolheu o jogo e pronto.'],
  ['Direto no celular', 'Interface pensada para polegar, toque e mesa cheia.'],
  ['Jogos rapidos', 'Rodadas curtas para manter o grupo junto.'],
  ['Facil de explicar', 'Qualquer pessoa entende a primeira rodada.'],
  ['Quebra o gelo', 'Perfeito quando o grupo ainda nao se soltou.'],
  ['Grupo mais animado', 'Ideal para festas, churrascos e resenhas.']
]

const plans = [
  {
    name: 'Gratis',
    description: 'Para testar e jogar de boa.',
    price: 'R$ 0',
    cta: 'Comecar gratis',
    variant: 'ghost',
    items: ['Jogos basicos', 'Anuncios', 'Acesso limitado']
  },
  {
    name: 'Premium',
    description: 'Para quem joga sempre com os amigos.',
    price: 'Plano pago',
    cta: 'Assinar Premium',
    variant: 'primary',
    featured: true,
    items: ['Sem anuncios', 'Mais jogos', 'Novas categorias', 'Experiencia melhor']
  },
  {
    name: 'Festa',
    description: 'Para grupos, festas e eventos.',
    price: 'Para eventos',
    cta: 'Usar no meu role',
    variant: 'blue',
    items: ['Jogos para grupos grandes', 'Modo festa', 'Experiencias exclusivas', 'Ideal para churrascos e roles']
  }
]

const HomePage: React.FC<HomePageProps> = ({ onStartGame }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<GameCategory>('all')
  const [selectedGame, setSelectedGame] = useState<LandingGame>(games[1])
  const [toast, setToast] = useState('')

  const filteredGames = useMemo(
    () => games.filter((game) => activeFilter === 'all' || game.category === activeFilter),
    [activeFilter]
  )

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('.reveal'))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18 }
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const showToast = (message = 'Link de jogo pronto para a galera.') => setToast(message)

  const scrollTo = (id: string) => {
    const target = document.querySelector(id)
    if (!target) return
    const top = target.getBoundingClientRect().top + window.pageYOffset - 74
    window.scrollTo({ top, behavior: 'smooth' })
    setMenuOpen(false)
  }

  const selectGame = (game: LandingGame) => {
    setSelectedGame(game)
    showToast(`${game.title} aberto no mockup.`)
  }

  return (
    <div className="landing-page">
      <div className="landing-page-shell">
        <nav className="landing-nav" aria-label="Navegacao principal">
          <div className="landing-nav-inner">
            <a className="landing-brand" href="#top" onClick={(event) => { event.preventDefault(); scrollTo('#top') }} aria-label="Playzenha inicio">
              <span className="landing-brand-mark" aria-hidden="true">
                <Icon name="chat" />
              </span>
              Playzenha
            </a>
            <div className="landing-nav-links">
              <a href="#como-funciona" onClick={(event) => { event.preventDefault(); scrollTo('#como-funciona') }}>Como funciona</a>
              <a href="#jogos" onClick={(event) => { event.preventDefault(); onStartGame('biblioteca') }}>Jogos</a>
              <a href="#planos" onClick={(event) => { event.preventDefault(); scrollTo('#planos') }}>Planos</a>
              <a href="#depoimentos" onClick={(event) => { event.preventDefault(); scrollTo('#depoimentos') }}>Depoimentos</a>
            </div>
            <div className="landing-nav-actions">
              <button className="landing-button landing-button-blue" type="button" onClick={() => onStartGame('login')}>Comecar a jogar</button>
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
                  <button className="landing-button landing-button-primary" type="button" onClick={() => onStartGame('login')}>Comecar a jogar</button>
                  <button className="landing-button landing-button-ghost" type="button" onClick={() => onStartGame('biblioteca')}>Ver jogos disponiveis</button>
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
                      <small>{selectedGame.tag}</small>
                      <h3>{selectedGame.title}</h3>
                      <div className="landing-prompt-card">{selectedGame.prompt}</div>
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
              {steps.map(([number, title, text]) => (
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
                {[
                  ['all', 'Todos'],
                  ['quebra-gelo', 'Quebra-gelo'],
                  ['desafio', 'Desafio'],
                  ['festa', 'Festa']
                ].map(([filter, label]) => (
                  <button
                    className={`landing-filter-chip ${activeFilter === filter ? 'is-active' : ''}`}
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter as GameCategory)}
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
                    style={{ '--card-color': game.color } as React.CSSProperties}
                    role="button"
                    tabIndex={0}
                    aria-label={`Jogar ${game.title}`}
                    onMouseEnter={() => selectGame(game)}
                    onFocus={() => selectGame(game)}
                    onClick={() => onStartGame(game.view)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onStartGame(game.view)
                      }
                    }}
                  >
                    <span className="landing-card-tag">{game.tag}</span>
                    <h3>{game.title}</h3>
                    <p>{game.description}</p>
                    <span className="landing-card-play">Jogar</span>
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
              {useCases.map(([icon, title]) => (
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
                <button className="landing-button landing-button-primary" type="button" onClick={() => onStartGame('login')}>Comecar de boa</button>
              </div>
              <div className="landing-benefit-stack">
                {benefits.map(([title, text]) => (
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
              {plans.map((plan) => (
                <article className={`landing-plan-card ${plan.featured ? 'featured' : ''}`} key={plan.name}>
                  {plan.featured && <span className="landing-plan-badge">Mais recomendado</span>}
                  <div>
                    <h3>{plan.name}</h3>
                    <p>{plan.description}</p>
                  </div>
                  <div className="landing-price">{plan.price}</div>
                  <ul className="landing-plan-list">
                    {plan.items.map((item) => (
                      <li key={item}><span className="landing-check" aria-hidden="true" />{item}</li>
                    ))}
                  </ul>
                  <button
                    className={`landing-button landing-button-${plan.variant}`}
                    type="button"
                    onClick={() => onStartGame('login')}
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
            <button className="landing-button landing-button-primary" type="button" onClick={() => onStartGame('login')}>Comecar a jogar agora</button>
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
