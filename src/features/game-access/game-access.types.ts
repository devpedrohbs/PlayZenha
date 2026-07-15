export interface AuthorizedGame<TContent> {
  source: 'subscription' | 'administrator' | 'allGamesGrant'
  game: {
    id: string
    slug: string
    name: string
    requiredPlan: 'free' | 'premium' | 'ultimate'
  }
  content: TContent
  contentVersion: number
}

export interface ImpostorContent {
  themes: string[]
}

export interface ContatoContent {
  words: string[]
}
