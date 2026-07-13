import type {
  Benefit,
  GameCategory,
  LandingStep,
  UseCase
} from './models'

export const GAME_FILTERS: ReadonlyArray<{ value: GameCategory; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'quebra-gelo', label: 'Quebra-gelo' },
  { value: 'desafio', label: 'Desafio' },
  { value: 'festa', label: 'Festa' }
]

export const STEPS: LandingStep[] = [
  { number: '01', title: 'Abra no celular', text: 'Nada de instalacao. O link abre rapido e ja coloca o grupo no clima.' },
  { number: '02', title: 'Escolha o jogo', text: 'Verdade, desafio, quiz ou modo festa conforme a energia do momento.' },
  { number: '03', title: 'Comece a resenha', text: 'As rodadas sao curtas, faceis de entender e feitas para gerar assunto.' }
]

export const USE_CASES: UseCase[] = [
  { icon: 'party', title: 'Festa com amigos' },
  { icon: 'grill', title: 'Churrasco' },
  { icon: 'gift', title: 'Aniversario' },
  { icon: 'home', title: 'Resenha em casa' },
  { icon: 'trip', title: 'Viagem' },
  { icon: 'drink', title: 'Pre-role' },
  { icon: 'group', title: 'Encontro em grupo' }
]

export const BENEFITS: Benefit[] = [
  { title: 'Sem baixar nada', text: 'Abriu o link, escolheu o jogo e pronto.' },
  { title: 'Direto no celular', text: 'Interface pensada para polegar, toque e mesa cheia.' },
  { title: 'Jogos rapidos', text: 'Rodadas curtas para manter o grupo junto.' },
  { title: 'Facil de explicar', text: 'Qualquer pessoa entende a primeira rodada.' },
  { title: 'Quebra o gelo', text: 'Perfeito quando o grupo ainda nao se soltou.' },
  { title: 'Grupo mais animado', text: 'Ideal para festas, churrascos e resenhas.' }
]

export const DEFAULT_TOAST_MESSAGE = 'Link de jogo pronto para a galera.'
export const TOAST_DURATION_MS = 2200
export const NAVIGATION_OFFSET_PX = 74
export const REVEAL_THRESHOLD = 0.18
