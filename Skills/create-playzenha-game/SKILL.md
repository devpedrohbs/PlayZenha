---
name: create-playzenha-game
description: Criar, implementar, integrar ou revisar jogos de festa locais no repositório PlayZenha seguindo o padrão completo do Impostor. Usar quando Codex receber a ideia de um novo jogo, precisar transformar regras em uma máquina de estados React, adicionar pass-and-play com segredos, cadastrar um jogo no catálogo/backend, aplicar identidade visual por cor, incluir regras antes do botão Jogar ou auditar se um jogo existente respeita o padrão PlayZenha.
---

# Criar jogo PlayZenha

Construir o jogo como uma feature completa do produto. Não limitar o trabalho ao componente React: integrar catálogo, regras, rota protegida, conteúdo do backend, identidade visual, domínio e testes.

## Ler antes de implementar

1. Ler [references/impostor-standard.md](references/impostor-standard.md) para entender o comportamento e o design de referência.
2. Ler [references/repository-contract.md](references/repository-contract.md) para conhecer arquivos, integrações e validações obrigatórias.
3. Inspecionar os arquivos atuais citados nessas referências. Tratar o código vivo como fonte final quando ele tiver evoluído desde a criação desta skill.

## Transformar a ideia em contrato de jogo

Extrair ou decidir, sem inventar mecânicas incompatíveis com o pedido:

- nome, slug em kebab-case e frase curta;
- cor primária, cor escura de apoio e ícone do catálogo;
- mínimo, ideal e máximo de jogadores;
- duração, categoria, dificuldade, plano e status;
- sequência exata de fases;
- dados públicos e conteúdo protegido;
- papéis, segredos, ordem de revelação, condições de vitória e pontuação;
- configurações da partida e limites de cada opção;
- regras do modal do catálogo: resumo, quatro passos e uma dica.

Fazer uma suposição razoável quando faltar um detalhe pequeno. Pedir decisão apenas se a ausência alterar materialmente a mecânica, monetização ou público do jogo.

## Preservar a experiência padrão

### Entrada e catálogo

- Fazer a primeira tela da partida ser a configuração/cadastro de jogadores. Não criar uma landing page redundante dentro do jogo.
- Cadastrar as regras em `src/games/shared/game-rules.ts`. Isso faz o botão `Regras` aparecer no card do catálogo e na home, antes de `Jogar`.
- Usar `GameRulesCard`; não criar outro modal de regras.
- Manter o botão de regras à esquerda e o botão de jogar à direita quando ambos estiverem presentes.
- Garantir que nome, jogadores, duração, categoria, tags, ícone e cores venham do registro do backend.

### Identidade visual

- Escolher uma cor primária exclusiva do jogo e aplicá-la de ponta a ponta: arte do catálogo, `GameRulesCard.accent`, marca do header, avatares, foco, botões principais, timer e destaques.
- Derivar uma cor escura complementar para gradientes e cards secretos.
- Reservar vermelho para perigo, acusação, eliminação ou derrota; verde para sucesso/vitória; amarelo PlayZenha para apoio e atenção.
- Usar os tokens globais e os componentes compartilhados antes de criar equivalentes locais.
- Usar prefixo CSS próprio baseado no slug para impedir vazamento entre jogos.
- Projetar mobile-first, com alvos de toque de pelo menos 42 px, texto crucial grande e layout útil em 360 px. Expandir para no máximo aproximadamente 760 px em desktop.

### Estado e fases

- Modelar telas com uma união `Phase`; nunca controlar telas principais com vários booleanos.
- Usar `useReducer` para transições de estado não triviais.
- Manter funções de regra puras em `domain/<game>.rules.ts`, estado/transições no reducer, valores derivados nos selectors e efeitos/orquestração no hook.
- Renderizar uma fase por vez dentro de `<AnimatePresence mode="wait">` com `key` estável e animação curta.
- Exibir no header: voltar para Home, marca do jogo/PlayZenha e chip com o nome humano da fase.
- Colocar a ação principal no final da tela; usar spacer/sticky action para permanecer alcançável sem sobrepor conteúdo.

### Segredos e passagem do celular

Quando qualquer jogador receber informação privada, implementar duas fases separadas:

1. `*-pass`/`*-distribution-start`: mostrar apenas “Passe o celular para {nome}”, aviso para ninguém olhar e botão `Revelar`.
2. `*-reveal`: mostrar papel/segredo apenas depois da ação explícita; incluir instrução para esconder a tela e botão `Esconder e passar`.

Gerar a ordem com IDs únicos embaralhados, guardar o índice atual e localizar o jogador por ID. Nunca mostrar papel, palavra, alvo ou pergunta secreta na tela de passagem. Após a última revelação, trocar o CTA por uma ação que nomeie a próxima etapa.

### Cards ao longo da partida

- Setup: hero claro + painel de jogadores + painel de opções + feedback de validação.
- Passagem: hero claro com o nome do jogador como elemento dominante e ilustração de segredo.
- Revelação: card alto, imersivo e variante por papel/resultado; informação privada ocupa o centro visual.
- Ação coletiva: card instrucional com título forte, descrição curta e dica contextual.
- Timer: anel/progresso grande; alterar texto e cor nos segundos finais; oferecer avanço manual quando fizer sentido.
- Votação/escolha: cards de jogadores com avatar, nome, seleção evidente e confirmação separada.
- Resultado: card de vitória/derrota, fatos essenciais da rodada e ações `Jogar de novo` + `Voltar aos jogos`.

## Implementar na ordem correta

1. Definir tipos, constantes, estado inicial e mapa de rótulos das fases.
2. Implementar e testar regras puras: validação, criação da rodada, aleatoriedade injetável/forçável e resolução do resultado.
3. Implementar reducer e selectors.
4. Implementar hook de orquestração e timers com cleanup.
5. Implementar todas as telas no componente principal.
6. Criar CSS próprio e conectar a identidade do jogo aos tokens compartilhados.
7. Adicionar tipo do conteúdo, `GameAccessGate`, página e rota protegida.
8. Registrar regras, catálogo, payload protegido e schema Zod do backend.
9. Importar o CSS global do jogo e atualizar ícones/tipos se necessário.
10. Aplicar o seed local quando o banco em escopo estiver disponível.
11. Executar a matriz de verificação descrita na referência técnica.

## Regras de qualidade

- Validar nomes vazios, duplicados sem diferenciar maiúsculas/minúsculas, mínimo e máximo de jogadores.
- Desabilitar ações inválidas visual e semanticamente.
- Não usar índice de array como identidade persistente do jogador após iniciar a rodada.
- Não colocar bancos extensos de palavras/perguntas protegidas no bundle público.
- Não usar `Math.random()` diretamente em regras que precisam de teste determinístico; receber índices/ordem ou encapsular o sorteio no hook.
- Não misturar chamadas HTTP, temporizadores ou navegação nas regras de domínio.
- Preservar nomes/configuração ao reiniciar quando isso melhora o fluxo, mas limpar papéis, votos, segredo, vencedor e índices da rodada.
- Manter conteúdo em português consistente e revisar acentos/encoding UTF-8.

## Entrega

Informar:

- jogo e rota criados;
- fluxo de fases implementado;
- integrações de catálogo, regras, acesso e backend;
- testes/verificações executados;
- qualquer comando ainda necessário, como seed ou reinício do backend.

Não declarar o jogo disponível no site se o registro ainda não estiver no banco ou se a API não o retornar.
