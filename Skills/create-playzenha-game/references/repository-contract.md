# Contrato técnico para um jogo PlayZenha

## Sumário

1. [Estrutura mínima](#estrutura-mínima)
2. [Arquivos e responsabilidades](#arquivos-e-responsabilidades)
3. [Integração do catálogo e regras](#integração-do-catálogo-e-regras)
4. [Acesso e conteúdo protegido](#acesso-e-conteúdo-protegido)
5. [CSS e componentes compartilhados](#css-e-componentes-compartilhados)
6. [Testes obrigatórios](#testes-obrigatórios)
7. [Checklist de publicação](#checklist-de-publicação)

## Estrutura mínima

```text
src/games/<slug>/
├── <GameName>Game.tsx
├── <slug>.css
├── domain/
│   ├── <camel>.types.ts
│   ├── <camel>.constants.ts
│   ├── <camel>.rules.ts
│   ├── <camel>.rules.test.ts
│   ├── <camel>.selectors.ts
│   └── <camel>.reducer.ts
└── hooks/
    ├── use<GameName>Game.ts
    └── useGameTimer.ts          # somente se houver timer

src/pages/GamesPage/<GameName>GamePage.tsx
```

Integrações fora da pasta:

```text
src/app/router.tsx
src/main.tsx
src/games/shared/game-rules.ts
src/features/game-access/game-access.types.ts
src/features/games-catalog/games.types.ts
src/features/games-catalog/components/GameArt.tsx
backend/prisma/seed.ts
backend/src/modules/games/content/game-content.schemas.ts
scripts/check-protected-content.mjs
```

## Arquivos e responsabilidades

### Componente

Receber navegação e conteúdo por props. Exemplo conceitual:

```tsx
interface GameProps {
  onBackToHome: () => void
  onBackToGames: () => void
  prompts: string[]
}
```

Consumir um único hook de jogo. Renderizar fases via `AnimatePresence`. Evitar regras, sorteios e mutações complexas diretamente no JSX.

### Tipos

Definir explicitamente:

- `GamePhase` como união de strings;
- papéis/resultado;
- `Player` com `id: string`;
- `GameState` completo;
- contratos de criação da rodada.

### Constantes

Centralizar mínimos, máximos, incrementos, defaults, array inicial de nomes, estado inicial e `Record<GamePhase, string>` para o header.

Não compartilhar arrays mutáveis do estado inicial entre resets. Quando necessário, recriar/copiar.

### Rules

Manter funções puras para:

- trim/normalização de nomes;
- mínimo, máximo e duplicidade case-insensitive;
- criação de jogadores e atribuição de papéis;
- geração/validação de ordem;
- pontuação, vitória ou resultado;
- reset de dados por rodada.

Aceitar índices, IDs ou ordem forçada para tornar aleatoriedade testável.

### Reducer

Definir união discriminada de actions. Cada action deve representar uma transição de domínio, não um detalhe visual arbitrário. Limitar steppers no reducer ou rule, limpar feedback após edição e limpar dados secretos no restart.

### Selectors

Calcular dados derivados sem duplicá-los no estado: jogador da vez, contagem preenchida, `canStart`, placar ordenado e progresso.

### Hook

Conectar reducer, selectors memoizados, timer, sorteios e handlers de alto nível. Retornar estado e comandos prontos para a UI. Usar callbacks estáveis em efeitos temporizados.

## Integração do catálogo e regras

### Seed

Adicionar em `games`:

```ts
{
  slug: '<slug>',
  name: '<Nome>',
  shortDescription: '<frase curta>',
  category: '<categoria>',
  minPlayers: 3,
  maxPlayers: 12,
  averageDurationMinutes: 15,
  difficulty: 'easy' | 'medium' | 'hard',
  status: 'available',
  requiredPlan: 'free' | 'premium' | 'ultimate',
  tags: ['...'],
  colors: ['<cor escura>', '<cor primária>'],
  icon: '<GameIconName>',
  featured: true,
  isNew: true
}
```

Usar `comingSoon` no seed Prisma quando o enum exigir esse nome de input; a API o mapeia para `coming-soon`.

Executar `npm.cmd run prisma:seed` em `backend` para aparecer no site local. Editar o seed sem aplicá-lo não atualiza o catálogo já persistido.

### Regras antes de jogar

Adicionar uma entrada em `GAME_RULES` usando exatamente o slug do backend:

```ts
'<slug>': {
  gameName: '<Nome>',
  summary: '<explicação em 1–2 frases>',
  rules: ['passo 1', 'passo 2', 'passo 3', 'condição final'],
  tip: '<dica prática>',
  accent: '<cor primária>'
}
```

`GameCard` e `FeaturedGamesSection` chamam `getGameRules(slug)`. Se a entrada existir e o jogo estiver disponível, eles inserem `GameRulesCard` antes do botão de jogar. Não editar cada card individualmente.

O modal compartilhado já oferece portal, fechamento por Escape/clique externo, bloqueio de scroll, ARIA, animação e layout mobile.

### Ícones

Reutilizar um `GameIconName` existente quando for semanticamente adequado. Se criar outro:

1. adicionar à união em `games.types.ts`;
2. importar ícone Lucide e mapear em `GameArt.tsx`;
3. usar o mesmo nome no seed.

## Acesso e conteúdo protegido

Criar `<GameName>GamePage.tsx` com `GameAccessGate<ContentType>` e slug idêntico ao seed. Passar `content` ao componente e navegação para `/` e `/jogos`.

Adicionar rota:

```tsx
<Route
  path="/jogos/<slug>"
  element={<ProtectedRoute><GameNameGamePage /></ProtectedRoute>}
/>
```

Se houver conteúdo de jogo:

1. definir interface em `game-access.types.ts`;
2. adicionar payload em `protectedGameContent` no seed;
3. criar schema Zod específico em `game-content.schemas.ts`;
4. rotear o slug em `parseGameContent`;
5. fornecer pelo `GameAccessGate`, nunca por constante importada no componente;
6. adicionar sentinelas representativas ao script de segurança.

O backend autoriza plano/admin/grant antes de devolver o payload. Jogos disponíveis precisam de `GameContent` ativo; payload `{}` só é aceitável quando não há banco protegido e o schema genérico é intencional.

## CSS e componentes compartilhados

Preferir:

- `GameActionButton` para começar, continuar, confirmar, reiniciar e voltar;
- `GameButton` para ações específicas;
- `GameIconButton` para navegação compacta;
- `GameRulesCard` para regras;
- `game-shell.css` para shell, setup e modal compartilhados;
- tokens de `src/styles/tokens.css`.

Importar o CSS específico em `src/main.tsx`. Usar raiz `.playzenha-game.playzenha-game-<slug>` ou shell isolado equivalente e variáveis:

```css
.playzenha-game-<slug> {
  --game-accent: <cor primária>;
  --game-accent-ink: <cor de texto com contraste>;
  --game-accent-shadow: <cor primária translúcida>;
}
```

Criar classes próprias apenas para elementos únicos: card secreto, timer, votação, placar e ilustração. Manter estados `selected`, `danger`, `success`, `disabled` evidentes sem depender só de cor.

## Testes obrigatórios

### Domínio

Cobrir no mínimo:

- abaixo do mínimo e acima do máximo;
- nomes duplicados variando caixa/espaços;
- entrada válida;
- quantidade e unicidade de IDs;
- distribuição exata dos papéis;
- ordem contém cada jogador uma vez;
- cada condição de vitória/pontuação;
- reset entre rodadas, quando houver.

### Integração visual

Adicionar/atualizar teste para confirmar:

- botão `Regras` existe antes de `Jogar`;
- modal abre com o nome e as regras corretas;
- rota protegida renderiza a página ou é reconhecida pelo teste do router;
- ação principal permanece desabilitada em estado inválido.

### Comandos

Executar na raiz:

```powershell
npm.cmd run typecheck
npm.cmd run test:run
npm.cmd run build
npm.cmd run security:bundle
git diff --check
```

Executar em `backend` quando houver mudanças:

```powershell
npm.cmd run typecheck
npm.cmd test -- --runInBand
npm.cmd run prisma:validate
```

Se build/test falhar por bloqueio de sandbox ao esbuild ler acima do workspace, registrar claramente a limitação; não apresentar isso como falha do código.

## Checklist de publicação

- [ ] Slug idêntico em pasta, seed, regras, gate e rota.
- [ ] Primeira tela é setup/jogadores.
- [ ] Regras aparecem no card antes de jogar.
- [ ] Cor do card, regras e partida é coerente.
- [ ] Todas as fases têm rótulo e transição definida.
- [ ] Segredos usam passagem e revelação separadas.
- [ ] Nenhum segredo aparece no bundle público.
- [ ] Domínio está separado e testado.
- [ ] CSS está isolado e importado.
- [ ] Jogo está no seed com plano/status corretos.
- [ ] Conteúdo possui schema de backend.
- [ ] Página usa `GameAccessGate` e rota usa `ProtectedRoute`.
- [ ] Seed foi aplicado e API retorna o jogo.
- [ ] Layout foi conferido em mobile e desktop.
- [ ] Typecheck, testes, build, segurança e diff check foram executados.
