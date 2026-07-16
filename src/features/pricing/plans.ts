import type { PricingPlanCard } from './types'

export const PRICING_PLAN_CARDS: PricingPlanCard[] = [
  {
    planCode: 'free',
    description: 'Para testar o Playzenha em uma resenha real antes de decidir.',
    cta: 'Jogar Impostor gratis',
    variant: 'ghost',
    label: '1 jogo disponivel agora. Sem cartao.',
    sections: [
      {
        title: 'Beneficios',
        items: [
          { text: 'Impostor para 3 a 16 jogadores' },
          { text: 'Partidas direto no navegador' },
          { text: 'Conta e perfil do jogador' },
          { text: 'Acesso gratuito sem prazo' }
        ]
      },
      {
        title: 'Limitacoes',
        items: [
          { text: 'Ultima Noite, Contato e Quem Sou Eu', tone: 'excluded' }
        ]
      }
    ]
  },
  {
    planCode: 'premium',
    description: 'Para a galera que quer variar o jogo sem trocar de aplicativo.',
    cta: 'Desbloquear 4 jogos',
    variant: 'primary',
    badge: 'Mais Popular',
    label: 'Os 4 jogos disponiveis agora em uma assinatura.',
    featured: true,
    sections: [
      {
        title: 'Beneficios',
        items: [
          { text: 'Impostor, Ultima Noite, Contato e Quem Sou Eu' },
          { text: 'Uma conta libera a partida para o grupo' },
          { text: 'Jogos de 2 a 16 jogadores' },
          { text: 'Acesso antecipado aos proximos lancamentos' },
          { text: 'Experiencia sem anuncios' }
        ]
      },
      {
        title: 'Em desenvolvimento',
        items: [
          { text: 'Modos adultos e para casais', tone: 'note' }
        ]
      }
    ]
  },
  {
    planCode: 'ultimate',
    description: 'Para acompanhar os futuros modos adultos, para casais e eventos especiais.',
    cta: 'Conhecer o Ultimate',
    variant: 'blue',
    badge: 'Para quem quer tudo',
    label: 'Inclui o Premium e os proximos modos especiais.',
    sections: [
      {
        title: 'Beneficios',
        items: [
          { text: 'Tudo do plano Premium' },
          { text: 'Acesso aos futuros jogos Ultimate quando forem publicados' },
          { text: 'Prioridade nos proximos lancamentos' },
          { text: 'Uma conta libera a partida para o grupo' }
        ]
      }
    ]
  }
]
