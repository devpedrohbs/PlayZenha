import type { GameRules } from './components/GameRulesCard'

export const GAME_RULES: Readonly<Record<string, GameRules>> = {
  impostor: {
    gameName: 'Impostor',
    summary: 'Todo mundo recebe a mesma palavra secreta, menos o Impostor. Ele precisa blefar; o grupo precisa descobrir quem esta fingindo.',
    rules: [
      'Cadastre de 3 a 16 jogadores e escolha o tempo de discussao.',
      'Passe o celular: cada pessoa ve seu papel em segredo. Os Cidadaos veem a palavra; o Impostor nao.',
      'Durante a discussao, deem pistas sem falar a palavra diretamente. O Impostor tenta acompanhar o assunto.',
      'No fim, o grupo vota em um suspeito. Os Cidadaos vencem se encontrarem o Impostor; caso contrario, ele vence.'
    ],
    tip: 'Pistas obvias demais entregam a palavra. Pistas vagas demais fazem voce parecer o Impostor.',
    accent: '#0441F2'
  },
  'quem-esta-mentindo': {
    gameName: 'Quem Está Mentindo?',
    summary: 'Todos respondem à mesma pergunta, mas uma pessoa recebe a missão de mentir. Escute as respostas e descubra quem está blefando.',
    rules: [
      'Cadastre de 3 a 12 jogadores e configure as rodadas, perguntas e tempo de discussão.',
      'Passe o celular: cada pessoa descobre em segredo se deve falar a verdade ou inventar uma resposta.',
      'Todos respondem oralmente. Depois, o grupo questiona detalhes e procura contradições.',
      'O celular passa novamente para votos secretos. Quem acertar marca ponto; os mentirosos pontuam se escaparem.'
    ],
    tip: 'Peça detalhes concretos. Uma história inventada costuma ficar frágil quando precisa voltar a um detalhe antigo.',
    accent: '#FF7A45'
  },
  contato: {
    gameName: 'Contato',
    summary: 'Um juiz conhece a palavra secreta. Os outros dois jogadores tentam descobri-la conforme novas letras aparecem.',
    rules: [
      'Cadastre exatamente 3 jogadores e escolha se o juiz muda a cada rodada.',
      'O jogo sorteia o juiz. Somente ele olha a palavra secreta antes de devolver o celular.',
      'Os adivinhadores conversam e tentam descobrir a palavra. O juiz libera uma nova letra quando o grupo precisar.',
      'A rodada termina quando a palavra inteira aparece. Tentem resolver usando menos letras e no menor tempo.'
    ],
    tip: 'Os dois adivinhadores podem pensar em voz alta. Uma associacao inesperada costuma criar o melhor contato.',
    accent: '#27D982'
  },
  'quem-sou-eu': {
    gameName: 'Quem Sou Eu',
    summary: 'Cada pessoa escreve um personagem para outra. Na sua vez, coloque o celular na testa e tente descobrir quem voce e pelas pistas da galera.',
    rules: [
      'Cadastre de 2 a 10 jogadores. Cada pessoa recebera outra em segredo para escolher um personagem.',
      'Passe o celular e escreva um personagem ou celebridade para a pessoa indicada, sem contar para ninguem.',
      'Na rodada de adivinhacao, o jogador coloca o celular na testa enquanto o grupo da pistas sem dizer o nome.',
      'Marque Acertou ou Desistiu. Depois que todos jogarem, o placar destaca quem acertou mais rapido.'
    ],
    tip: 'Escolha personagens conhecidos pelo grupo. O desafio deve render risada, nao deixar alguem sem chance.',
    accent: '#E2A900'
  },
  'ultima-noite': {
    gameName: 'Ultima Noite',
    summary: 'Lobos se escondem entre os Cidadaos. A cada noite, os papeis agem em segredo; de dia, todos discutem e votam em quem eliminar.',
    rules: [
      'Cadastre pelo menos 6 jogadores, escolha o Mediador e configure Lobos, Anjo, Detetive e tempo de discussao.',
      'Passe o celular para cada pessoa descobrir seu papel. O Mediador conduz as etapas sem participar das acoes secretas.',
      'A noite acontece em segredo: o Lobo escolhe uma vitima, o Anjo tenta salvar alguem e o Detetive investiga um jogador.',
      'De dia, o grupo discute e vota. Os Cidadaos vencem ao eliminar todos os Lobos; os Lobos vencem quando igualam o numero dos demais vivos.'
    ],
    tip: 'O Mediador deve manter expressao neutra e garantir que ninguem veja a tela durante a acao de outro papel.',
    accent: '#7D4DFF'
  }
}

export const getGameRules = (slug: string) => GAME_RULES[slug]
