import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Clock,
  Crown,
  Flame,
  Gamepad2,
  Heart,
  Moon,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
  Zap
} from 'lucide-react'
import { GameView } from '../App'
import AppShell from './ui/AppShell'
import Badge from './ui/Badge'
import Button from './ui/Button'
import Card from './ui/Card'
import Footer from './ui/Footer'
import Modal from './ui/Modal'
import Navbar from './ui/Navbar'

interface HomePageProps {
  onStartGame: (game: GameView) => void
}

type RulesKey = 'impostor' | 'ultima-noite' | 'contato' | 'quem-sou-eu'
type GameThemeKey = 'blue' | 'purple' | 'green' | 'yellow'

interface GameTheme {
  accent: string
  accentHex: string
  accentSoft: string
  bg: string
  border: string
  text: string
  textStrong: string
  onAccent: string
  shadow: string
  ring: string
}

interface GameItem {
  id: RulesKey
  view: GameView
  name: string
  category: string
  players: string
  averageTime: string
  description: string
  icon: React.ReactNode
  theme: GameThemeKey
  featured?: boolean
}

const gameThemes: Record<GameThemeKey, GameTheme> = {
  blue: {
    accent: 'bg-playzenha-blue',
    accentHex: '#0441F2',
    accentSoft: 'bg-playzenha-blue/15',
    bg: 'from-playzenha-blue/25 via-playzenha-card to-playzenha-card',
    border: 'border-playzenha-blue/45',
    text: 'text-blue-200',
    textStrong: 'text-playzenha-blue',
    onAccent: 'text-white',
    shadow: 'shadow-playzenha-blue/25',
    ring: 'ring-playzenha-blue/35'
  },
  purple: {
    accent: 'bg-purple-500',
    accentHex: '#A855F7',
    accentSoft: 'bg-purple-500/15',
    bg: 'from-purple-500/25 via-playzenha-card to-playzenha-card',
    border: 'border-purple-400/45',
    text: 'text-purple-200',
    textStrong: 'text-purple-300',
    onAccent: 'text-white',
    shadow: 'shadow-purple-500/25',
    ring: 'ring-purple-400/35'
  },
  green: {
    accent: 'bg-emerald-400',
    accentHex: '#34D399',
    accentSoft: 'bg-emerald-400/15',
    bg: 'from-emerald-400/25 via-playzenha-card to-playzenha-card',
    border: 'border-emerald-300/45',
    text: 'text-emerald-200',
    textStrong: 'text-emerald-300',
    onAccent: 'text-dark-bg',
    shadow: 'shadow-emerald-400/20',
    ring: 'ring-emerald-300/35'
  },
  yellow: {
    accent: 'bg-playzenha-yellow',
    accentHex: '#FFC603',
    accentSoft: 'bg-playzenha-yellow/15',
    bg: 'from-playzenha-yellow/25 via-playzenha-card to-playzenha-card',
    border: 'border-playzenha-yellow/50',
    text: 'text-yellow-100',
    textStrong: 'text-playzenha-yellow',
    onAccent: 'text-dark-bg',
    shadow: 'shadow-playzenha-yellow/20',
    ring: 'ring-playzenha-yellow/35'
  }
}

const games: GameItem[] = [
  {
    id: 'impostor',
    view: 'impostor',
    name: 'Impostor',
    category: 'Dedução social',
    players: '3-12 jogadores',
    averageTime: '10 min',
    description: 'Descubra quem está blefando antes que o impostor entenda a palavra secreta.',
    icon: <Users className="h-7 w-7" />,
    theme: 'blue',
    featured: true
  },
  {
    id: 'ultima-noite',
    view: 'ultima-noite',
    name: 'Última Noite',
    category: 'Estratégia e blefe',
    players: '6+ jogadores',
    averageTime: '15 min',
    description: 'Lobos, anjos e detetives em uma rodada tensa de acusações e sobrevivência.',
    icon: <Moon className="h-7 w-7" />,
    theme: 'purple',
    featured: true
  },
  {
    id: 'contato',
    view: 'contato',
    name: 'Contato',
    category: 'Sincronia e palavra',
    players: '3 jogadores',
    averageTime: '8 min',
    description: 'Dois jogadores tentam pensar igual enquanto o juiz libera novas pistas.',
    icon: <Zap className="h-7 w-7" />,
    theme: 'green'
  },
  {
    id: 'quem-sou-eu',
    view: 'quem-sou-eu',
    name: 'Quem Sou Eu',
    category: 'Adivinhação',
    players: '2-10 jogadores',
    averageTime: '5-12 min',
    description: 'Escreva personagens em segredo e tente adivinhar com o celular na testa.',
    icon: <BrainCircuit className="h-7 w-7" />,
    theme: 'yellow'
  }
]

const rulesContent: Record<RulesKey, { title: string; sections: Array<{ heading: string; body: string[] }> }> = {
  impostor: {
    title: 'Regras: Impostor',
    sections: [
      {
        heading: 'Objetivo',
        body: [
          'Civis tentam descobrir quem é o impostor.',
          'O impostor precisa se misturar e descobrir o tema sem ser votado.'
        ]
      },
      {
        heading: 'Como jogar',
        body: [
          'Cada jogador recebe uma palavra, exceto o impostor.',
          'Todos dão dicas relacionadas ao tema.',
          'Depois da discussão, o grupo vota em quem parece estar blefando.'
        ]
      }
    ]
  },
  'ultima-noite': {
    title: 'Regras: Última Noite',
    sections: [
      {
        heading: 'Objetivo',
        body: [
          'Cidadãos vencem quando eliminam todos os lobos.',
          'Lobos vencem quando conseguem dominar a votação.'
        ]
      },
      {
        heading: 'Fases',
        body: [
          'Durante a noite, papéis especiais agem em segredo.',
          'Durante o dia, todos debatem, acusam e votam.',
          'A partida segue até uma facção vencer.'
        ]
      }
    ]
  },
  contato: {
    title: 'Regras: Contato',
    sections: [
      {
        heading: 'Objetivo',
        body: [
          'Os adivinhadores precisam sincronizar ideias para chegar à palavra final.',
          'O juiz valida os contatos e libera letras conforme a rodada avança.'
        ]
      },
      {
        heading: 'Fluxo',
        body: [
          'O app sorteia juiz e palavra.',
          'Adivinhadores veem pistas parciais.',
          'O juiz decide quando liberar novas letras ou revelar a palavra.'
        ]
      }
    ]
  },
  'quem-sou-eu': {
    title: 'Regras: Quem Sou Eu',
    sections: [
      {
        heading: 'Objetivo',
        body: [
          'Cada jogador tenta adivinhar o personagem escrito para ele.',
          'Ganha destaque quem acerta em menos tempo.'
        ]
      },
      {
        heading: 'Como jogar',
        body: [
          'Jogadores escrevem personagens em segredo.',
          'Na sua vez, o jogador coloca o celular na testa.',
          'O grupo ajuda com pistas até o acerto ou desistência.'
        ]
      }
    ]
  }
}

const dashboardStats = [
  { label: 'Partidas jogadas', value: '128', icon: <Gamepad2 className="h-5 w-5" /> },
  { label: 'Vitórias', value: '74', icon: <Trophy className="h-5 w-5" /> },
  { label: 'Ranking', value: '#42', icon: <Crown className="h-5 w-5" /> },
  { label: 'Plano atual', value: 'Premium', icon: <ShieldCheck className="h-5 w-5" /> }
]

const recentGames: RulesKey[] = ['impostor', 'quem-sou-eu', 'contato']
const favoriteGames: RulesKey[] = ['ultima-noite', 'impostor']

const HomePage: React.FC<HomePageProps> = ({ onStartGame }) => {
  const [showRules, setShowRules] = useState<RulesKey | null>(null)
  const selectedRules = showRules ? rulesContent[showRules] : null
  const selectedRulesGame = showRules ? games.find((game) => game.id === showRules) : null
  const featuredGame = useMemo(() => games.find((game) => game.featured) ?? games[0], [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <AppShell>
      <Navbar
        onLogin={() => onStartGame('login')}
        onExploreGames={() => scrollTo('jogos')}
        onDashboard={() => scrollTo('dashboard')}
      />

      <main>
        <HeroSection onStart={() => scrollTo('jogos')} onExplore={() => scrollTo('jogos')} featuredGame={featuredGame} />
        <ExperienceSection />
        <GamesLibrary games={games} onStartGame={onStartGame} onShowRules={setShowRules} />
        <DashboardSection />
      </main>

      <Footer />

      <Modal open={Boolean(showRules && selectedRules)} title={selectedRules?.title ?? ''} onClose={() => setShowRules(null)}>
        {selectedRules && (
          <div className="space-y-6">
            {selectedRules.sections.map((section) => (
              <section key={section.heading} className="space-y-3">
                <h3 className="flex items-center gap-2 font-fredoka text-xl text-white">
                  <BookOpen className={`h-5 w-5 ${selectedRulesGame ? gameThemes[selectedRulesGame.theme].textStrong : 'text-playzenha-yellow'}`} />
                  {section.heading}
                </h3>
                <ul className="space-y-2">
                  {section.body.map((item) => (
                    <li
                      key={item}
                      className={`rounded-2xl border bg-white/5 p-4 leading-relaxed text-playzenha-muted ${selectedRulesGame ? gameThemes[selectedRulesGame.theme].border : 'border-white/10'}`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </Modal>
    </AppShell>
  )
}

interface HeroSectionProps {
  featuredGame: GameItem
  onStart: () => void
  onExplore: () => void
}

const HeroSection: React.FC<HeroSectionProps> = ({ featuredGame, onStart, onExplore }) => {
  const theme = gameThemes[featuredGame.theme]

  return (
    <section className="section-container grid min-h-[calc(100vh-5rem)] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="max-w-3xl"
      >
        <Badge variant="primary" className="mb-5">
          <Sparkles className="h-3.5 w-3.5 text-playzenha-yellow" />
          SaaS de party games
        </Badge>
        <h1 className="font-fredoka text-5xl leading-[0.95] text-white sm:text-6xl lg:text-7xl">
          Dê play na sua resenha.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-playzenha-muted sm:text-xl">
          Jogos feitos para transformar qualquer encontro em uma experiência inesquecível.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={onStart}>
            <Play className="h-5 w-5 fill-current" />
            Começar agora
          </Button>
          <Button size="lg" variant="ghost" onClick={onExplore}>
            Explorar jogos
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative"
      >
        <Card className={`bg-gradient-to-br p-5 ring-1 sm:p-7 ${theme.bg} ${theme.border} ${theme.ring}`}>
          <div className={`absolute right-6 top-6 opacity-20 ${theme.textStrong}`}>
            <Star className="h-24 w-24 fill-current" />
          </div>
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge variant="accent">Ao vivo agora</Badge>
                <h2 className="mt-4 font-fredoka text-4xl text-white">{featuredGame.name}</h2>
                <p className="mt-2 text-playzenha-muted">{featuredGame.description}</p>
              </div>
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl shadow-lg ${theme.accent} ${theme.onAccent} ${theme.shadow}`}>
                {featuredGame.icon}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <MiniStat label="Jogadores" value={featuredGame.players} icon={<Users className="h-4 w-4" />} theme={theme} />
              <MiniStat label="Tempo médio" value={featuredGame.averageTime} icon={<Clock className="h-4 w-4" />} theme={theme} />
              <MiniStat label="Status" value="Pronto" icon={<Flame className="h-4 w-4" />} theme={theme} />
              <MiniStat label="Clima" value="Competitivo" icon={<Trophy className="h-4 w-4" />} theme={theme} />
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-dark-bg/60 p-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="font-bold text-white">Energia da resenha</span>
                <span className={`font-bold ${theme.textStrong}`}>92%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div className={`h-full w-[92%] rounded-full ${theme.accent}`} />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  )
}

const MiniStat: React.FC<{ label: string; value: string; icon: React.ReactNode; theme: GameTheme }> = ({ label, value, icon, theme }) => (
  <div className={`rounded-2xl border bg-white/5 p-4 ${theme.border}`}>
    <div className={`mb-2 flex items-center gap-2 ${theme.textStrong}`}>{icon}</div>
    <p className="text-xs font-bold uppercase tracking-wide text-playzenha-muted">{label}</p>
    <p className="mt-1 font-bold text-white">{value}</p>
  </div>
)

const ExperienceSection: React.FC = () => {
  const items = [
    {
      title: 'Rápido de começar',
      text: 'Abra no celular, escolha o jogo e deixe a rodada acontecer sem setup complicado.',
      icon: <Zap className="h-6 w-6" />
    },
    {
      title: 'Visual de jogo premium',
      text: 'Interfaces grandes, claras e divertidas para todo mundo entender mesmo na bagunça.',
      icon: <Sparkles className="h-6 w-6" />
    },
    {
      title: 'Evolução de SaaS',
      text: 'Base visual pronta para ranking, planos, histórico, favoritos e próximos modos.',
      icon: <BarChart3 className="h-6 w-6" />
    }
  ]

  return (
    <section className="section-container py-10 sm:py-16">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Card key={item.title} interactive>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-playzenha-blue text-white">
              {item.icon}
            </div>
            <h3 className="font-fredoka text-2xl text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-playzenha-muted">{item.text}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}

interface GamesLibraryProps {
  games: GameItem[]
  onStartGame: (game: GameView) => void
  onShowRules: (game: RulesKey) => void
}

const GamesLibrary: React.FC<GamesLibraryProps> = ({ games, onStartGame, onShowRules }) => {
  return (
    <section id="jogos" className="section-container scroll-mt-24 py-12 sm:py-16">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge variant="accent" className="mb-4">Biblioteca de jogos</Badge>
          <h2 className="font-fredoka text-4xl text-white sm:text-5xl">Escolha o jogo da rodada</h2>
        </div>
        <p className="max-w-xl text-playzenha-muted">
          Cards grandes, informações claras e ações rápidas para colocar a galera para jogar sem perder o clima.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
          >
            <GameCard game={game} onPlay={() => onStartGame(game.view)} onRules={() => onShowRules(game.id)} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

interface GameCardProps {
  game: GameItem
  onPlay: () => void
  onRules: () => void
}

const GameCard: React.FC<GameCardProps> = ({ game, onPlay, onRules }) => {
  const theme = gameThemes[game.theme]

  return (
    <Card interactive className={`flex h-full min-h-[28rem] flex-col bg-gradient-to-br ${theme.bg} ${theme.border}`}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className={`flex h-16 w-16 items-center justify-center rounded-3xl shadow-lg ${theme.accent} ${theme.onAccent} ${theme.shadow}`}>
          {game.icon}
        </div>
        {game.featured && <Badge variant="accent">Destaque</Badge>}
      </div>
      <Badge variant="primary" className={`w-fit ${theme.accentSoft} ${theme.border} ${theme.text}`}>{game.category}</Badge>
      <h3 className={`mt-4 font-fredoka text-3xl text-white decoration-4 underline-offset-8 group-hover:underline ${theme.textStrong}`}>{game.name}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-playzenha-muted">{game.description}</p>

      <div className="mt-6 grid gap-3 text-sm">
        <div className="flex items-center gap-2 text-playzenha-muted">
          <Users className={`h-4 w-4 ${theme.textStrong}`} />
          {game.players}
        </div>
        <div className="flex items-center gap-2 text-playzenha-muted">
          <Clock className={`h-4 w-4 ${theme.textStrong}`} />
          {game.averageTime}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-[1fr_auto] gap-3">
        <Button
          onClick={onPlay}
          fullWidth
          className={`${theme.onAccent} ${theme.shadow}`}
          style={{ backgroundColor: theme.accentHex }}
        >
          Jogar
        </Button>
        <Button variant="ghost" onClick={onRules} aria-label={`Ver regras de ${game.name}`} className={`${theme.accentSoft} ${theme.border} ${theme.text}`}>
          <BookOpen className="h-5 w-5" />
          <span className="hidden sm:inline xl:hidden">Regras</span>
        </Button>
      </div>
    </Card>
  )
}

const DashboardSection: React.FC = () => {
  return (
    <section id="dashboard" className="section-container scroll-mt-24 py-12 sm:py-16">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge variant="primary" className="mb-4">Dashboard</Badge>
          <h2 className="font-fredoka text-4xl text-white sm:text-5xl">Seu painel da resenha</h2>
        </div>
        <p className="max-w-xl text-playzenha-muted">
          Uma visão premium para evolução da conta, jogos recentes, favoritos e estatísticas.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {dashboardStats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-dark-bg/50 p-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-playzenha-blue text-white">
                  {stat.icon}
                </div>
                <p className="text-sm text-playzenha-muted">{stat.label}</p>
                <p className="mt-1 font-fredoka text-3xl text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-5">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-fredoka text-2xl text-white">Jogos recentes</h3>
              <Badge variant="muted">Histórico</Badge>
            </div>
            <div className="space-y-3">
              {recentGames.map((game, index) => (
                <DashboardRow key={game} label={game} value={`${index + 1}ª última partida`} icon={<Clock className="h-4 w-4" />} />
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-fredoka text-2xl text-white">Favoritos</h3>
              <Heart className="h-5 w-5 text-playzenha-yellow fill-current" />
            </div>
            <div className="space-y-3">
              {favoriteGames.map((game) => (
                <DashboardRow key={game} label={game} value="Pronto para jogar" icon={<Star className="h-4 w-4" />} />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

const DashboardRow: React.FC<{ label: RulesKey; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => {
  const game = games.find((item) => item.id === label) ?? games[0]
  const theme = gameThemes[game.theme]

  return (
    <div className={`flex items-center justify-between gap-4 rounded-2xl border bg-white/5 p-4 ${theme.border}`}>
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${theme.accentSoft} ${theme.textStrong}`}>
          {icon}
        </span>
        <div>
          <p className="font-bold text-white">{game.name}</p>
          <p className="text-xs text-playzenha-muted">{value}</p>
        </div>
      </div>
      <ArrowRight className={`h-4 w-4 shrink-0 ${theme.textStrong}`} />
    </div>
  )
}

export default HomePage
