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
    requiredPlan: 'free',
    tags: ['Grupo', 'Papeis secretos', 'Disponivel'],
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
    requiredPlan: 'free',
    tags: ['Palavra secreta', 'Disponivel'],
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
    requiredPlan: 'free',
    tags: ['Adivinhacao', 'Disponivel'],
    colors: ['#06112f', '#ffc603'],
    icon: 'brain'
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
    await prisma.game.upsert({
      where: { slug: game.slug },
      create: game,
      update: game
    })
  }
}

try {
  await main()
} finally {
  await prisma.$disconnect()
}
