import type { Plan } from './types'

export const PRICING_PLANS: Plan[] = [
  {
    name: 'PlayZenha Free',
    description: 'Perfeito para quem esta comecando e quer experimentar o PlayZenha com os amigos.',
    price: 'R$ 0',
    cta: 'Comecar Gratuitamente',
    variant: 'ghost',
    label: 'Para conhecer a diversao.',
    sections: [
      {
        title: 'Beneficios',
        items: [
          { text: 'Jogos gratuitos' },
          { text: 'Ate 3 partidas por dia' },
          { text: 'Ranking Global' },
          { text: 'Perfil do jogador' },
          { text: 'Favoritar jogos' },
          { text: 'Atualizacoes gratuitas' }
        ]
      },
      {
        title: 'Limitacoes',
        items: [
          { text: 'Jogos Premium', tone: 'excluded' },
          { text: 'Jogos After Party', tone: 'excluded' },
          { text: 'IA personalizada', tone: 'excluded' },
          { text: 'Estatisticas avancadas', tone: 'excluded' },
          { text: 'Exibicao de anuncios', tone: 'note' }
        ]
      }
    ]
  },
  {
    name: 'PlayZenha Premium',
    description: 'Ideal para quem joga frequentemente e quer acesso completo aos jogos do PlayZenha.',
    price: 'R$ 24,90/mes',
    cta: 'Assinar Premium',
    variant: 'primary',
    badge: 'Mais Popular',
    label: 'Toda a biblioteca de jogos para qualquer resenha.',
    featured: true,
    sections: [
      {
        title: 'Beneficios',
        items: [
          { text: 'Todos os jogos' },
          { text: 'Todos os temas' },
          { text: 'Jogos lancados primeiro' },
          { text: 'IA para criar temas personalizados' },
          { text: 'IA para gerar perguntas e desafios' },
          { text: 'Sem anuncios' },
          { text: 'Estatisticas completas' },
          { text: 'Perfil Premium' },
          { text: 'Ranking Premium' }
        ]
      },
      {
        title: 'Nao inclui',
        items: [
          { text: 'Jogos exclusivos After Party', tone: 'excluded' }
        ]
      }
    ]
  },
  {
    name: 'PlayZenha Ultimate',
    description: 'Aproximadamente R$ 3 por pessoa em uma mesa com 10 amigos.',
    price: 'R$ 34,90/mes',
    cta: 'Assinar Ultimate',
    variant: 'blue',
    badge: 'Melhor plano para resenha',
    label: 'Uma assinatura libera toda a diversao para a sua resenha.',
    highlighted: true,
    sections: [
      {
        title: 'Beneficios',
        items: [
          { text: 'Jogos com bebidas' },
          { text: 'Jogos +18' },
          { text: 'Jogos para casais' },
          { text: 'Eventos exclusivos' },
          { text: 'IA ilimitada (uso justo)' },
          { text: 'Campeonatos privados' },
          { text: 'Pacotes Premium' },
          { text: 'Acesso antecipado a novidades' },
          { text: 'Todos que participarem da sua partida aproveitam os recursos Premium durante a sessao.' }
        ]
      }
    ]
  }
]
