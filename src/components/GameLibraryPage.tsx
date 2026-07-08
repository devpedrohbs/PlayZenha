import React, { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Brain,
  Clock,
  Crown,
  Dice5,
  EyeOff,
  Heart,
  Home,
  Lock,
  Play,
  Search,
  Sparkles,
  Star,
  Target,
  Users,
  Zap
} from 'lucide-react'
import { GameView } from '../App'

interface GameLibraryPageProps {
  onBackToHome: () => void
  onStartGame: (game: GameView) => void
}

type GameCategory =
  | 'Todos'
  | 'Em Alta'
  | 'Novidades'
  | 'Festa'
  | 'Blefe'
  | 'Estrategia'
  | 'Casal'
  | 'Familia'
  | 'Quebra-Gelo'
  | 'IA'

interface LibraryGame {
  id: string
  name: string
  category: Exclude<GameCategory, 'Todos' | 'Em Alta' | 'Novidades'>
  players: string
  durationLabel: string
  difficulty: 'facil' | 'media' | 'alta'
  tags: string[]
  desc: string
  colors: [string, string]
  icon: keyof typeof iconMap
  featured?: boolean
  isNew?: boolean
  view?: GameView
}

const iconMap = {
  mask: EyeOff,
  cards: Crown,
  users: Users,
  spark: Sparkles,
  bolt: Zap,
  heart: Heart,
  home: Home,
  target: Target,
  party: Dice5,
  brain: Brain,
  star: Star
}

const games: LibraryGame[] = [
  {
    id: 'impostor',
    name: 'Impostor',
    category: 'Blefe',
    players: '3-16',
    durationLabel: '12 min',
    difficulty: 'media',
    tags: ['Popular', 'Blefe', 'Disponivel'],
    desc: 'Um tema secreto, um blefe e a galera tentando descobrir quem esta fingindo.',
    colors: ['#2b1138', '#ff335f'],
    icon: 'mask',
    featured: true,
    view: 'impostor'
  },
  {
    id: 'ultima-noite',
    name: 'Ultima Noite',
    category: 'Blefe',
    players: '6-16',
    durationLabel: '25 min',
    difficulty: 'media',
    tags: ['Grupo', 'Papeis secretos', 'Disponivel'],
    desc: 'Lobos, anjo, detetive e mediador em uma noite de acusacoes e votacao.',
    colors: ['#24104a', '#7d4dff'],
    icon: 'spark',
    featured: true,
    view: 'ultima-noite'
  },
  {
    id: 'contato',
    name: 'Contato',
    category: 'Quebra-Gelo',
    players: '3',
    durationLabel: '10 min',
    difficulty: 'facil',
    tags: ['Palavra secreta', 'Disponivel'],
    desc: 'Um juiz, uma palavra escondida e jogadores tentando se conectar pelas pistas.',
    colors: ['#04180e', '#37f28a'],
    icon: 'users',
    view: 'contato'
  },
  {
    id: 'quem-sou-eu',
    name: 'Quem Sou Eu',
    category: 'Festa',
    players: '2-10',
    durationLabel: '15 min',
    difficulty: 'facil',
    tags: ['Adivinhacao', 'Disponivel'],
    desc: 'Escreva personagens em segredo e tente adivinhar com o celular na testa.',
    colors: ['#06112f', '#ffc603'],
    icon: 'brain',
    view: 'quem-sou-eu'
  },
  {
    id: 'verdade-desafio',
    name: 'Verdade ou Desafio',
    category: 'Festa',
    players: '3-10',
    durationLabel: '15 min',
    difficulty: 'facil',
    tags: ['Popular', 'Em breve'],
    desc: 'Perguntas e missoes rapidas para quebrar qualquer gelo sem deixar estranho.',
    colors: ['#0441f2', '#ffc603'],
    icon: 'cards',
    featured: true
  },
  {
    id: 'quem-provavel',
    name: 'Quem e mais provavel?',
    category: 'Quebra-Gelo',
    players: '3-14',
    durationLabel: '10 min',
    difficulty: 'facil',
    tags: ['Popular', 'Em breve'],
    desc: 'Aponte quem do grupo mais combina com a situacao e prepare a defesa.',
    colors: ['#4cff9b', '#0441f2'],
    icon: 'users'
  },
  {
    id: 'ia-resenha',
    name: 'IA da Resenha',
    category: 'IA',
    players: '2-12',
    durationLabel: '8 min',
    difficulty: 'facil',
    tags: ['IA', 'Premium', 'Em breve'],
    desc: 'Rodadas personalizadas para o clima, lugar e nivel de intimidade do grupo.',
    colors: ['#0441f2', '#7d4dff'],
    icon: 'spark',
    isNew: true
  },
  {
    id: 'quiz-resenha',
    name: 'Quiz da Resenha',
    category: 'Festa',
    players: '4-16',
    durationLabel: '20 min',
    difficulty: 'media',
    tags: ['Grupo', 'Em breve'],
    desc: 'Perguntas sobre musica, cultura e memorias internas para jogar em times.',
    colors: ['#0441f2', '#4cff9b'],
    icon: 'bolt'
  },
  {
    id: 'casal-sincero',
    name: 'Casal Sincero',
    category: 'Casal',
    players: '2',
    durationLabel: '18 min',
    difficulty: 'media',
    tags: ['Premium', 'Novo', 'Em breve'],
    desc: 'Perguntas leves, engracadas e algumas sinceronas para jogar a dois.',
    colors: ['#ff4faa', '#ffc603'],
    icon: 'heart',
    isNew: true
  },
  {
    id: 'familia-em-jogo',
    name: 'Familia em Jogo',
    category: 'Familia',
    players: '3-12',
    durationLabel: '15 min',
    difficulty: 'facil',
    tags: ['Familia', 'Em breve'],
    desc: 'Rodadas seguras e divertidas para jogar com primos, tios e todo mundo junto.',
    colors: ['#ffc603', '#0441f2'],
    icon: 'home'
  },
  {
    id: 'desafio-relampago',
    name: 'Desafio Relampago',
    category: 'Festa',
    players: '3-12',
    durationLabel: '7 min',
    difficulty: 'facil',
    tags: ['Novo', 'Em breve'],
    desc: 'Missoes de poucos segundos para levantar a energia quando o papo esfria.',
    colors: ['#7d4dff', '#ffc603'],
    icon: 'bolt',
    isNew: true
  },
  {
    id: 'estrategia-caos',
    name: 'Estrategia do Caos',
    category: 'Estrategia',
    players: '4-8',
    durationLabel: '25 min',
    difficulty: 'alta',
    tags: ['Premium', 'Em breve'],
    desc: 'Aliancas, escolhas escondidas e reviravoltas para quem quer pensar um pouco mais.',
    colors: ['#06112f', '#0441f2'],
    icon: 'target'
  },
  {
    id: 'eu-nunca',
    name: 'Eu Nunca',
    category: 'Quebra-Gelo',
    players: '3-14',
    durationLabel: '12 min',
    difficulty: 'facil',
    tags: ['Popular', 'Em breve'],
    desc: 'Historias, confissoes leves e muita risada para descobrir causos do grupo.',
    colors: ['#ff4faa', '#0441f2'],
    icon: 'cards'
  },
  {
    id: 'modo-festa',
    name: 'Modo Festa',
    category: 'Festa',
    players: '6-20',
    durationLabel: '30 min',
    difficulty: 'media',
    tags: ['Premium', 'Grupo', 'Em breve'],
    desc: 'Experiencia grande com times, rodadas variadas e energia de evento.',
    colors: ['#ffc603', '#ff4faa'],
    icon: 'party'
  },
  {
    id: 'date-rapido',
    name: 'Date Rapido',
    category: 'Casal',
    players: '2',
    durationLabel: '10 min',
    difficulty: 'facil',
    tags: ['Novo', 'Em breve'],
    desc: 'Perguntas boas para sair do basico sem transformar o encontro em entrevista.',
    colors: ['#ff4faa', '#7d4dff'],
    icon: 'heart'
  }
]

const categories: GameCategory[] = ['Todos', 'Em Alta', 'Novidades', 'Festa', 'Blefe', 'Estrategia', 'Casal', 'Familia', 'Quebra-Gelo', 'IA']

const normalize = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const GameLibraryPage: React.FC<GameLibraryPageProps> = ({ onBackToHome, onStartGame }) => {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<GameCategory>('Todos')
  const playableGames = games.filter((game) => game.view)

  const filteredGames = useMemo(() => {
    const normalizedQuery = normalize(query.trim())

    return games.filter((game) => {
      const matchesCategory =
        activeCategory === 'Todos' ||
        (activeCategory === 'Em Alta' && game.featured) ||
        (activeCategory === 'Novidades' && game.isNew) ||
        game.category === activeCategory

      const searchable = normalize([
        game.name,
        game.category,
        game.desc,
        game.difficulty,
        ...game.tags
      ].join(' '))

      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery))
    })
  }, [activeCategory, query])

  const playRandom = () => {
    const nextGame = playableGames[Math.floor(Math.random() * playableGames.length)]
    if (nextGame.view) onStartGame(nextGame.view)
  }

  return (
    <div className="game-library-page">
      <nav className="game-library-nav" aria-label="Navegacao da biblioteca">
        <button className="game-library-back" type="button" onClick={onBackToHome}>
          <ArrowLeft size={18} />
          Inicio
        </button>
        <div className="game-library-brand">
          <span>Playzenha</span>
          <strong>Biblioteca</strong>
        </div>
        <button className="game-library-random compact" type="button" onClick={playRandom}>
          <Dice5 size={18} />
        </button>
      </nav>

      <main className="game-library-shell">
        <section className="game-library-hero">
          <div>
            <p className="game-library-eyebrow">Playzenha jogos</p>
            <h1>Biblioteca de Jogos</h1>
            <p>
              Encontre rapido o jogo certo para o clima da galera. Os jogos disponiveis ja abrem direto; os outros ficam marcados como em breve.
            </p>
          </div>
          <div className="game-library-feature-stack" aria-label="Jogos disponiveis em destaque">
            {playableGames.slice(0, 3).map((game) => (
              <button className="game-library-feature-tile" key={game.id} type="button" onClick={() => game.view && onStartGame(game.view)}>
                <GameArt game={game} />
                <span>
                  <strong>{game.name}</strong>
                  <small>{game.category} - {game.players} jogadores</small>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="game-library-controls" aria-label="Busca e filtros">
          <label className="game-library-search">
            <Search size={22} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="Buscar por Impostor, festa, IA, casal..."
              autoComplete="off"
            />
          </label>
          <button className="game-library-random" type="button" onClick={playRandom}>
            <Dice5 size={19} />
            Jogo aleatorio
          </button>
          <div className="game-library-categories" aria-label="Categorias">
            {categories.map((category) => (
              <button
                className={`game-library-chip ${activeCategory === category ? 'active' : ''}`}
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="game-library-results" aria-label="Todos os jogos">
          <div className="game-library-section-title">
            <h2>Todos os jogos</h2>
            <p>{filteredGames.length} jogos encontrados</p>
          </div>

          {filteredGames.length > 0 ? (
            <div className="game-library-grid">
              {filteredGames.map((game) => (
                <article className={`game-library-card ${game.view ? 'available' : 'locked'}`} key={game.id}>
                  <GameArt game={game} />
                  <div className="game-library-card-top">
                    <span>{game.category}</span>
                    {game.view ? <span className="game-library-status ready">Disponivel</span> : <span className="game-library-status soon">Em breve</span>}
                  </div>
                  <h3>{game.name}</h3>
                  <p>{game.desc}</p>
                  <div className="game-library-meta">
                    <span><Users size={14} /> {game.players}</span>
                    <span><Clock size={14} /> {game.durationLabel}</span>
                    <span>{game.difficulty}</span>
                  </div>
                  <div className="game-library-tags">
                    {game.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <button
                    className="game-library-play"
                    type="button"
                    disabled={!game.view}
                    onClick={() => game.view && onStartGame(game.view)}
                  >
                    {game.view ? <><Play size={17} /> Jogar</> : <><Lock size={17} /> Em breve</>}
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="game-library-empty">Nenhum jogo encontrado com essa busca. Tente uma palavra mais geral.</div>
          )}
        </section>
      </main>
    </div>
  )
}

const GameArt = ({ game }: { game: LibraryGame }) => {
  const Icon = iconMap[game.icon]
  return (
    <span
      className="game-library-art"
      style={{ '--art-a': game.colors[0], '--art-b': game.colors[1] } as React.CSSProperties}
      aria-hidden="true"
    >
      <Icon size={34} />
    </span>
  )
}

export default GameLibraryPage
