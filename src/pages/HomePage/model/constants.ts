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
  { number: '01', title: 'Crie sua conta', text: 'Sao apenas 3 campos e nenhum cartao para comecar no plano gratis.' },
  { number: '02', title: 'Abra o Impostor', text: 'Escolha a quantidade de jogadores e deixe o celular guiar a rodada.' },
  { number: '03', title: 'Passe o celular', text: 'Cada pessoa ve seu papel em segredo e a resenha comeca de verdade.' }
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
  { title: 'Uma conta por grupo', text: 'Quem puxa a partida abre o jogo e passa o celular.' },
  { title: 'De 2 a 16 pessoas', text: 'Escolha o jogo que cabe no tamanho da sua galera.' },
  { title: 'Rodadas sem manual', text: 'A propria tela conduz cada passo da partida.' },
  { title: 'Teste antes de assinar', text: 'O Impostor fica liberado no plano gratis.' },
  { title: 'Premium para variar', text: 'Desbloqueie os quatro jogos disponiveis quando quiser.' }
]

export const DEFAULT_TOAST_MESSAGE = 'Link de jogo pronto para a galera.'
export const TOAST_DURATION_MS = 2200
export const NAVIGATION_OFFSET_PX = 74
export const REVEAL_THRESHOLD = 0.18
