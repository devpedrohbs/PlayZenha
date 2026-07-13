export type GameCategory = 'all' | 'quebra-gelo' | 'desafio' | 'festa'

export interface LandingStep {
  number: string
  title: string
  text: string
}

export interface UseCase {
  icon: string
  title: string
}

export interface Benefit {
  title: string
  text: string
}
