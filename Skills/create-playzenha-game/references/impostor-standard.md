# Impostor como padrão PlayZenha

## Sumário

1. [Identidade no produto](#identidade-no-produto)
2. [Mapa do código de referência](#mapa-do-código-de-referência)
3. [Fluxo completo](#fluxo-completo)
4. [Anatomia visual das telas](#anatomia-visual-das-telas)
5. [Passagem e revelação](#passagem-e-revelação)
6. [Comportamento da rodada](#comportamento-da-rodada)
7. [Arquitetura de estado](#arquitetura-de-estado)
8. [Decisões que devem ser generalizadas](#decisões-que-devem-ser-generalizadas)

## Identidade no produto

O Impostor usa azul PlayZenha (`#0441F2`) como identidade funcional da partida:

- marca no header;
- kicker e avatares;
- botões principais;
- foco de inputs;
- nome destacado na passagem;
- timer em estado normal;
- card do cidadão e elementos de investigação;
- `GameRulesCard.accent`.

O amarelo é apoio/atenção. O vermelho representa o Impostor, suspeita e votação. O verde representa vitória dos cidadãos. O fundo é claro, com gradientes radiais suaves, cards brancos translúcidos, bordas frias e sombra azulada.

No catálogo, `GameArt` lê `colors[0]` e `colors[1]` do backend. Para jogos novos, manter esses valores coerentes com a cor funcional usada dentro da partida e no modal de regras. O Impostor atual possui legado de cores no seed; não copiar essa divergência.

As fontes têm papéis definidos:

- `Geist Pixel`: títulos, números grandes, labels de sistema;
- `Fredoka`: cards e conteúdo lúdico;
- `Inter`: corpo, controles e ações.

## Mapa do código de referência

Ler estes arquivos vivos antes de criar um jogo:

- `src/games/impostor/ImpostorGame.tsx`: anatomia visual de todas as fases;
- `src/games/impostor/impostor.css`: identidade, cards, timer, votação e responsividade;
- `src/games/impostor/domain/impostor.types.ts`: modelo de fases/estado;
- `src/games/impostor/domain/impostor.constants.ts`: limites, defaults e labels;
- `src/games/impostor/domain/impostor.rules.ts`: validação e regras puras;
- `src/games/impostor/domain/impostor.reducer.ts`: transições;
- `src/games/impostor/domain/impostor.selectors.ts`: derivados;
- `src/games/impostor/hooks/useImpostorGame.ts`: orquestração;
- `src/games/impostor/hooks/useGameTimer.ts`: efeito temporal;
- `src/games/impostor/domain/impostor.rules.test.ts`: invariantes testadas;
- `src/pages/GamesPage/ImpostorGamePage.tsx`: gate e conteúdo;
- `src/games/shared/game-rules.ts`: regras públicas do catálogo;
- `src/features/games-catalog/components/GameCard.tsx`: ordem Regras → Jogar;
- `src/features/landing/components/FeaturedGamesSection.tsx`: mesma regra na home;
- `backend/prisma/seed.ts`: catálogo e conteúdo protegido;
- `backend/src/modules/games/content/game-content.schemas.ts`: validação do payload.

## Fluxo completo

| Fase | Entrada | Conteúdo principal | Saída |
|---|---|---|---|
| `setup` | abrir jogo/reiniciar | jogadores, tempo, validação | criar rodada |
| `role-distribution-start` | jogador atual | passar celular sem segredo visível | revelar papel |
| `role-reveal` | toque explícito | papel ou tema secreto | esconder e avançar |
| `game-start` | todos revelados | instrução coletiva e dica | iniciar timer |
| `discussion` | timer iniciado | investigação, cronômetro, +1 minuto | votação manual ou automática |
| `voting-intro` | fim da discussão | alerta e instrução decisiva | abrir votação |
| `voting` | lista de jogadores | selecionar suspeito | confirmar voto |
| `voting-results` | voto confirmado | vencedor, impostor e tema | reiniciar ou catálogo |

Cada fase tem rótulo humano em `IMPOSTOR_PHASE_LABEL`, exibido no chip do header. A UI nunca deduz a fase a partir de combinações de booleanos.

## Anatomia visual das telas

### Shell e header

- `.impostor-game`: define tokens locais e fundo da página.
- `.impostor-shell`: centraliza a experiência em 480 px no mobile e 760 px no breakpoint maior.
- `.impostor-topbar`: três zonas equilibradas: Home, marca, fase.
- O header permanece visualmente leve; a fase orienta o grupo durante a passagem do aparelho.

### Setup

- Abre diretamente em “Quem vai jogar?”, sem outra landing dentro do jogo.
- Hero explica em uma frase o que ocorrerá depois.
- Começa com três slots vazios.
- Cada linha possui avatar derivado da inicial/posição, input e remoção.
- Remover acima do mínimo elimina o slot; no mínimo apenas limpa o nome.
- Limite de nome: 18 caracteres.
- Painel de opção usa stepper com limites e incremento definidos em constantes.
- CTA só habilita com jogadores suficientes; a validação completa ainda roda ao clicar.
- Feedback informa prontidão ou o erro específico.

### Passagem

- O nome é o maior elemento da tela.
- A ilustração de carta/segredo se move lentamente para manter a tela viva.
- Nenhum papel ou tema aparece.
- O CTA usa verbo inequívoco: “Revelar papel”.

### Revelação

- Card alto ocupa a maior parte da viewport.
- Variante `impostor`: gradiente vermelho/escuro, máscara e objetivo de blefe.
- Variante `citizen`: azul/escuro, tema em badge grande e objetivo de investigação.
- Rodapé do card lembra o jogador de esconder a informação.
- No último jogador, o texto muda de “Esconder e passar” para “Começar investigação”.

### Ação coletiva e timer

- `game-start` desacopla a última revelação da discussão; todos podem voltar a olhar.
- Título grande, regra da fase e dica curta evitam dúvida durante a troca social.
- Timer usa conic-gradient com progresso proporcional `timeLeft / discussionTime`.
- Nos 30 segundos finais, muda para vermelho e altera microcopy.
- O grupo pode adicionar um minuto ou votar imediatamente.
- Ao zerar, o hook leva automaticamente para a introdução da votação.

### Votação e resultado

- Uma tela introdutória marca a mudança de contexto.
- Cards de voto são grandes e selecionáveis; seleção muda borda, fundo e mostra ícone.
- Confirmar fica desabilitado sem escolha.
- Resultado usa verde quando cidadãos vencem e vermelho quando o Impostor vence.
- Fatos essenciais ficam em subcards: pessoa e tema.
- Ações finais preservam hierarquia: repetir primeiro, voltar ao catálogo depois.

## Passagem e revelação

O fluxo seguro depende de quatro campos:

- `revealOrder: string[]`: IDs embaralhados;
- `currentRevealStep: number`: posição atual;
- selector que encontra o jogador pelo ID;
- fases separadas para passagem e revelação.

`createRevealOrder` embaralha todos os IDs uma única vez. A passagem mostra o jogador encontrado pelo selector. Ao esconder:

- se houver próximo ID, incrementar o índice e voltar à passagem;
- se for o último, avançar para a fase coletiva.

Nunca avançar o índice na tela de passagem e nunca recalcular a ordem em cada render.

## Comportamento da rodada

O hook sorteia índice do papel e índice do conteúdo; a regra pura recebe esses valores. Isso permite testes determinísticos. `createImpostorRound`:

1. remove nomes vazios e apara espaços;
2. cria jogadores com IDs únicos;
3. atribui exatamente um papel secreto;
4. gera ordem completa de revelação;
5. seleciona o conteúdo da rodada.

O timer fica em hook dedicado com cleanup de `setInterval`. O reducer inicia `timeLeft`, aplica ticks, adiciona tempo e troca fases. A resolução do voto é pura e retorna o vencedor sem efeitos colaterais.

## Arquitetura de estado

Responsabilidades do padrão:

- `*.types.ts`: fases, papéis, jogador, estado, inputs/outputs das regras;
- `*.constants.ts`: limites, defaults, estado inicial e rótulos;
- `*.rules.ts`: normalização, validação, criação da rodada e vitória;
- `*.selectors.ts`: jogador atual, contagens e permissões derivadas;
- `*.reducer.ts`: todas as transições de estado;
- `hooks/use<Game>.ts`: sorteio, efeitos e API amigável para o componente;
- `hooks/useGameTimer.ts`: ciclo de vida do cronômetro;
- `<Game>Game.tsx`: somente composição visual e eventos expostos pelo hook;
- `<game>.css`: tokens locais e estados visuais;
- `*.rules.test.ts`: invariantes da mecânica.

## Decisões que devem ser generalizadas

Copiar o princípio, não nomes/classes específicos:

- uma cor identitária consistente;
- primeira tela operacional;
- orientação constante de fase;
- segredo protegido por passagem + revelação;
- cards que mudam de tratamento conforme o contexto;
- domínio testável separado de React;
- conteúdo protegido entregue após autorização;
- regras acessíveis antes de entrar no jogo;
- final com resultado explícito e próximos passos.

Não copiar peculiaridades que não pertencem ao novo jogo, como `isAlive`, voto coletivo único ou exatamente um papel secreto.
