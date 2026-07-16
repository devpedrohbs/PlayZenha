import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, type Prisma } from '../src/generated/prisma/client.js'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is required to seed the database.')
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString })
})

const PUBLISHED_AT = new Date('2026-07-15T00:00:00.000Z')

const protectedGameContent: Record<string, Prisma.InputJsonValue> = {
  impostor: {
    themes: [
      'Lua', 'Copa do Mundo', 'Praia', 'Netflix', 'Pizza', 'Carnaval', 'Black Friday',
      'Festa Junina', 'Aniversario', 'Trabalho', 'Escola', 'Hospital', 'Shopping', 'Igreja',
      'Cinema', 'Uber', 'Instagram', 'TikTok', 'WhatsApp', 'Padaria', 'Churrasco', 'Barbearia',
      'Salao de Beleza', 'Farmacia', 'Rodoviaria', 'Metro', 'Elevador', 'Formatura', 'Natal',
      'Ano Novo', 'Halloween', 'Videogame', 'YouTube', 'Spotify', 'Bicicleta', 'Feira', 'Pet Shop',
      'Supermercado', 'Academia', 'Aeroporto', 'Acampamento', 'Parque de Diversoes', 'Museu',
      'Teatro', 'Restaurante', 'Lanchonete', 'Sorveteria', 'Cafeteria', 'Biblioteca', 'Delegacia',
      'Tribunal', 'Banco', 'Correios', 'Posto de Gasolina', 'Oficina', 'Condominio', 'Hotel',
      'Pousada', 'Cruzeiro', 'Praca', 'Floresta', 'Montanha', 'Deserto', 'Ilha', 'Cachoeira',
      'Piquenique', 'Parque Aquatico', 'Karaoke', 'Show', 'Festival', 'Casamento', 'Reuniao',
      'Home Office', 'Delivery', 'Loja de Roupas', 'Transito'
    ]
  },
  contato: {
    words: [
      'BACIA', 'ABACAXI', 'PIPOCA', 'CADEIRA', 'GIRAFA', 'BICICLETA', 'CHUVEIRO',
      'ESTOJO', 'TOMATE', 'SORVETE', 'FUTEBOL', 'LANTERNA', 'CACHORRO', 'JANELA',
      'VIOLAO', 'PANELA', 'TRAVESSEIRO', 'MELANCIA', 'PIRULITO', 'LIVRARIA'
    ]
  },
  'quem-esta-mentindo': {
    questions: [
      { category: 'Cotidiano', text: 'Qual foi a última coisa que você pesquisou?', personal: false, difficulty: 'Leve' },
      { category: 'Cotidiano', text: 'Qual comida você nunca dividiria?', personal: false, difficulty: 'Leve' },
      { category: 'Preferências', text: 'Qual filme você poderia assistir dez vezes?', personal: false, difficulty: 'Leve' },
      { category: 'Preferências', text: 'Qual música sempre melhora seu humor?', personal: false, difficulty: 'Leve' },
      { category: 'Situações absurdas', text: 'Em qual profissão você seria péssimo?', personal: false, difficulty: 'Leve' },
      { category: 'Situações absurdas', text: 'Qual superpoder seria inútil nas suas mãos?', personal: false, difficulty: 'Leve' },
      { category: 'Trabalho e estudos', text: 'Qual tarefa você evitaria para sempre?', personal: false, difficulty: 'Médio' },
      { category: 'Trabalho e estudos', text: 'Qual foi seu maior improviso em uma apresentação?', personal: false, difficulty: 'Médio' },
      { category: 'Cotidiano', text: 'Qual foi a compra mais inútil que já fez?', personal: false, difficulty: 'Médio' },
      { category: 'Situações absurdas', text: 'Qual regra estranha você criaria para todo mundo seguir?', personal: false, difficulty: 'Médio' },
      { category: 'Relacionamentos', text: 'Qual foi o conselho amoroso mais estranho que já recebeu?', personal: true, difficulty: 'Sem filtro' },
      { category: 'Relacionamentos', text: 'Qual detalhe faz você gostar de alguém?', personal: true, difficulty: 'Sem filtro' },
      { category: 'Constrangedoras', text: 'Qual mentira boba você já contou para escapar de algo?', personal: true, difficulty: 'Sem filtro' },
      { category: 'Constrangedoras', text: 'Qual mensagem você gostaria de apagar da memória?', personal: true, difficulty: 'Sem filtro' },
      { category: 'Trabalho e estudos', text: 'Qual foi a desculpa mais criativa que você já usou para um atraso?', personal: true, difficulty: 'Sem filtro' },
      { category: 'Preferências', text: 'Qual lugar você quer conhecer logo?', personal: false, difficulty: 'Médio' },
      { category: 'Cotidiano', text: 'Qual hábito seu ninguém entende?', personal: false, difficulty: 'Médio' },
      { category: 'Constrangedoras', text: 'Qual foi a situação mais aleatória que viveu esta semana?', personal: true, difficulty: 'Sem filtro' }
    ]
  }
}

const plans = [
  {
    code: 'free',
    name: 'PlayZenha Free',
    priceCents: 0,
    currency: 'BRL',
    billingInterval: 'month',
    entitlements: ['play_free_games'],
    active: true
  },
  {
    code: 'premium',
    name: 'PlayZenha Premium',
    priceCents: 2490,
    currency: 'BRL',
    billingInterval: 'month',
    entitlements: [
      'play_free_games',
      'play_premium_games',
      'remove_ads',
      'use_ai',
      'advanced_statistics',
      'early_access'
    ],
    active: true
  },
  {
    code: 'ultimate',
    name: 'PlayZenha Ultimate',
    priceCents: 3490,
    currency: 'BRL',
    billingInterval: 'month',
    entitlements: [
      'play_free_games',
      'play_premium_games',
      'play_adult_games',
      'remove_ads',
      'use_ai',
      'advanced_statistics',
      'early_access'
    ],
    active: true
  }
] satisfies Prisma.SubscriptionPlanCreateInput[]

const games = [
  {
    slug: 'impostor',
    name: 'Impostor',
    shortDescription: 'Um tema secreto, um blefe e a galera tentando descobrir quem esta fingindo.',
    category: 'Blefe',
    minPlayers: 3,
    maxPlayers: 16,
    averageDurationMinutes: 12,
    difficulty: 'medium',
    status: 'available',
    requiredPlan: 'free',
    tags: ['Popular', 'Blefe', 'Disponivel'],
    colors: ['#2b1138', '#ff335f'],
    icon: 'mask',
    featured: true
  },
  {
    slug: 'ultima-noite',
    name: 'Ultima Noite',
    shortDescription: 'Lobos, anjo, detetive e mediador em uma noite de acusacoes e votacao.',
    category: 'Blefe',
    minPlayers: 6,
    maxPlayers: 16,
    averageDurationMinutes: 25,
    difficulty: 'medium',
    status: 'available',
    requiredPlan: 'premium',
    tags: ['Grupo', 'Papeis secretos', 'Premium', 'Disponivel'],
    colors: ['#24104a', '#7d4dff'],
    icon: 'spark',
    featured: true
  },
  {
    slug: 'contato',
    name: 'Contato',
    shortDescription: 'Um juiz, uma palavra escondida e jogadores tentando se conectar pelas pistas.',
    category: 'Quebra-Gelo',
    minPlayers: 3,
    maxPlayers: 3,
    averageDurationMinutes: 10,
    difficulty: 'easy',
    status: 'available',
    requiredPlan: 'premium',
    tags: ['Palavra secreta', 'Premium', 'Disponivel'],
    colors: ['#04180e', '#37f28a'],
    icon: 'users'
  },
  {
    slug: 'quem-sou-eu',
    name: 'Quem Sou Eu',
    shortDescription: 'Escreva personagens em segredo e tente adivinhar com o celular na testa.',
    category: 'Festa',
    minPlayers: 2,
    maxPlayers: 10,
    averageDurationMinutes: 15,
    difficulty: 'easy',
    status: 'available',
    requiredPlan: 'premium',
    tags: ['Adivinhacao', 'Premium', 'Disponivel'],
    colors: ['#06112f', '#ffc603'],
    icon: 'brain'
  },
  {
    slug: 'quem-esta-mentindo',
    name: 'Quem Está Mentindo?',
    shortDescription: 'Uma pessoa inventa a resposta e o grupo precisa descobrir quem está blefando.',
    category: 'Blefe',
    minPlayers: 3,
    maxPlayers: 12,
    averageDurationMinutes: 18,
    difficulty: 'medium',
    status: 'available',
    requiredPlan: 'free',
    tags: ['Blefe', 'Voto secreto', 'Disponível'],
    colors: ['#34120a', '#ff7a45'],
    icon: 'mask',
    isNew: true
  },
  {
    slug: 'verdade-desafio',
    name: 'Verdade ou Desafio',
    shortDescription: 'Perguntas e missoes rapidas para quebrar qualquer gelo sem deixar estranho.',
    category: 'Festa',
    minPlayers: 3,
    maxPlayers: 10,
    averageDurationMinutes: 15,
    difficulty: 'easy',
    status: 'comingSoon',
    requiredPlan: 'free',
    tags: ['Popular', 'Em breve'],
    colors: ['#0441f2', '#ffc603'],
    icon: 'cards',
    featured: true
  },
  {
    slug: 'quem-provavel',
    name: 'Quem e mais provavel?',
    shortDescription: 'Aponte quem do grupo mais combina com a situacao e prepare a defesa.',
    category: 'Quebra-Gelo',
    minPlayers: 3,
    maxPlayers: 14,
    averageDurationMinutes: 10,
    difficulty: 'easy',
    status: 'comingSoon',
    requiredPlan: 'free',
    tags: ['Popular', 'Em breve'],
    colors: ['#4cff9b', '#0441f2'],
    icon: 'users'
  },
  {
    slug: 'ia-resenha',
    name: 'IA da Resenha',
    shortDescription: 'Rodadas personalizadas para o clima, lugar e nivel de intimidade do grupo.',
    category: 'IA',
    minPlayers: 2,
    maxPlayers: 12,
    averageDurationMinutes: 8,
    difficulty: 'easy',
    status: 'comingSoon',
    requiredPlan: 'premium',
    tags: ['IA', 'Premium', 'Em breve'],
    colors: ['#0441f2', '#7d4dff'],
    icon: 'spark',
    isNew: true
  },
  {
    slug: 'quiz-resenha',
    name: 'Quiz da Resenha',
    shortDescription: 'Perguntas sobre musica, cultura e memorias internas para jogar em times.',
    category: 'Festa',
    minPlayers: 4,
    maxPlayers: 16,
    averageDurationMinutes: 20,
    difficulty: 'medium',
    status: 'comingSoon',
    requiredPlan: 'premium',
    tags: ['Grupo', 'Em breve'],
    colors: ['#0441f2', '#4cff9b'],
    icon: 'bolt'
  },
  {
    slug: 'casal-sincero',
    name: 'Casal Sincero',
    shortDescription: 'Perguntas leves, engracadas e algumas sinceronas para jogar a dois.',
    category: 'Casal',
    minPlayers: 2,
    maxPlayers: 2,
    averageDurationMinutes: 18,
    difficulty: 'medium',
    status: 'comingSoon',
    requiredPlan: 'premium',
    tags: ['Premium', 'Novo', 'Em breve'],
    colors: ['#ff4faa', '#ffc603'],
    icon: 'heart',
    isNew: true
  },
  {
    slug: 'familia-em-jogo',
    name: 'Familia em Jogo',
    shortDescription: 'Rodadas seguras e divertidas para jogar com primos, tios e todo mundo junto.',
    category: 'Familia',
    minPlayers: 3,
    maxPlayers: 12,
    averageDurationMinutes: 15,
    difficulty: 'easy',
    status: 'comingSoon',
    requiredPlan: 'free',
    tags: ['Familia', 'Em breve'],
    colors: ['#ffc603', '#0441f2'],
    icon: 'home'
  },
  {
    slug: 'desafio-relampago',
    name: 'Desafio Relampago',
    shortDescription: 'Missoes de poucos segundos para levantar a energia quando o papo esfria.',
    category: 'Festa',
    minPlayers: 3,
    maxPlayers: 12,
    averageDurationMinutes: 7,
    difficulty: 'easy',
    status: 'comingSoon',
    requiredPlan: 'free',
    tags: ['Novo', 'Em breve'],
    colors: ['#7d4dff', '#ffc603'],
    icon: 'bolt',
    isNew: true
  },
  {
    slug: 'estrategia-caos',
    name: 'Estrategia do Caos',
    shortDescription: 'Aliancas, escolhas escondidas e reviravoltas para quem quer pensar um pouco mais.',
    category: 'Estrategia',
    minPlayers: 4,
    maxPlayers: 8,
    averageDurationMinutes: 25,
    difficulty: 'hard',
    status: 'comingSoon',
    requiredPlan: 'premium',
    tags: ['Premium', 'Em breve'],
    colors: ['#06112f', '#0441f2'],
    icon: 'target'
  },
  {
    slug: 'eu-nunca',
    name: 'Eu Nunca',
    shortDescription: 'Historias, confissoes leves e muita risada para descobrir causos do grupo.',
    category: 'Quebra-Gelo',
    minPlayers: 3,
    maxPlayers: 14,
    averageDurationMinutes: 12,
    difficulty: 'easy',
    status: 'comingSoon',
    requiredPlan: 'free',
    tags: ['Popular', 'Em breve'],
    colors: ['#ff4faa', '#0441f2'],
    icon: 'cards'
  },
  {
    slug: 'modo-festa',
    name: 'Modo Festa',
    shortDescription: 'Experiencia grande com times, rodadas variadas e energia de evento.',
    category: 'Festa',
    minPlayers: 6,
    maxPlayers: 20,
    averageDurationMinutes: 30,
    difficulty: 'medium',
    status: 'comingSoon',
    requiredPlan: 'premium',
    tags: ['Premium', 'Grupo', 'Em breve'],
    colors: ['#ffc603', '#ff4faa'],
    icon: 'party'
  },
  {
    slug: 'date-rapido',
    name: 'Date Rapido',
    shortDescription: 'Perguntas boas para sair do basico sem transformar o encontro em entrevista.',
    category: 'Casal',
    minPlayers: 2,
    maxPlayers: 2,
    averageDurationMinutes: 10,
    difficulty: 'easy',
    status: 'comingSoon',
    requiredPlan: 'free',
    tags: ['Novo', 'Em breve'],
    colors: ['#ff4faa', '#7d4dff'],
    icon: 'heart'
  }
] satisfies Prisma.GameCreateInput[]

async function main() {
  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { code: plan.code },
      create: plan,
      update: plan
    })
  }

  for (const game of games) {
    const gameData = { ...game, publishedAt: PUBLISHED_AT }
    const storedGame = await prisma.game.upsert({
      where: { slug: game.slug },
      create: gameData,
      update: gameData
    })

    if (game.status === 'available') {
      const payload = protectedGameContent[game.slug] ?? {}
      await prisma.gameContent.upsert({
        where: { gameId: storedGame.id },
        create: { gameId: storedGame.id, payload },
        update: { payload, active: true }
      })
    }
  }
}

try {
  await main()
} finally {
  await prisma.$disconnect()
}
