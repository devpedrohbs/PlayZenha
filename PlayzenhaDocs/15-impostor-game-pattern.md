# Padrao do jogo Impostor

Este documento descreve o padrao atual do jogo `Impostor` para servir como base de design, formatacao e implementacao dos proximos jogos do PlayZenha.

Arquivos de referencia:

- `src/components/ImpostorGame.tsx`
- `src/index.css`

## Objetivo visual

O `Impostor` e o modelo principal de experiencia dos jogos:

- interface mobile-first;
- visual claro, limpo e divertido;
- cor principal personalizada por jogo;
- cards grandes e bem separados;
- textos curtos;
- tela sempre preenchida na altura disponivel;
- acao principal sempre na parte de baixo;
- transicoes suaves entre fases;
- estado visual forte para segredo, timer, votacao e resultado.

Importante: o Impostor usa azul porque essa e a identidade dele. Os outros jogos nao devem copiar obrigatoriamente o azul. Cada jogo deve ter sua propria cor principal, mantendo a mesma estrutura visual.

Exemplos:

- Impostor: azul;
- Contato: verde;
- Quem Sou Eu: amarelo;
- Ultima Noite: roxo;
- futuros jogos: escolher uma cor primaria propria e documentar no componente/CSS.

## Tipografia

O padrao atual de fontes do PlayZenha e:

- Titulos principais: `Geist Pixel`
- Interface geral: `Inter`
- Cards, botoes e elementos divertidos: `Fredoka`

No CSS do Impostor isso aparece por tokens:

```css
--impostor-font-display: "Geist Pixel", "Inter", system-ui, sans-serif;
--impostor-font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
--impostor-font-mono: "Geist Pixel", "Inter", system-ui, sans-serif;
--impostor-font-fun: "Fredoka", "Inter", system-ui, sans-serif;
```

Regra de uso:

- `h1`, `h2`, `h3`: `--impostor-font-display`
- textos, inputs e UI comum: `--impostor-font-body`
- labels pequenos, chips e indicadores: `--impostor-font-mono`
- cards e botoes: `--impostor-font-fun`

## Cores

Tokens principais:

```css
--impostor-blue: #0441f2;
--impostor-yellow: #ffc603;
--impostor-danger: #ff335f;
--impostor-success: #27d982;
--impostor-ink: oklch(16% 0.035 263);
--impostor-muted: oklch(48% 0.025 260);
--impostor-bg: oklch(97% 0.015 255);
--impostor-border: oklch(89% 0.018 255);
```

Uso:

- Azul: cor principal do Impostor, botoes principais, avatares, badges fortes e timer.
- Amarelo: cor secundaria do Impostor, usada para contraste pontual.
- Vermelho: perigo, votacao e estado de impostor.
- Verde: sucesso e vitoria dos cidadaos.
- Branco/transparente: superficies de cards.
- `ink` e `muted`: textos principais e secundarios.

Para novos jogos, trocar os tokens para a identidade do jogo. O importante e manter o papel das cores:

- `primary`: cor principal do jogo;
- `secondary`: cor de contraste;
- `danger`: acao perigosa, eliminacao ou voto;
- `success`: acao concluida, acerto ou vitoria;
- `ink`: texto principal;
- `muted`: texto secundario;
- `border`: bordas suaves;
- `shadow`: sombra da interface.

Nao usar a cor do Impostor como padrao universal. Usar a arquitetura do Impostor como padrao universal.

## Estrutura do componente

O componente comeca com um wrapper exclusivo:

```tsx
<div className="impostor-game">
  <div className="impostor-shell">
    ...
  </div>
</div>
```

Esse wrapper isola o CSS do jogo e evita que estilos globais ou de outros jogos vazem para dentro.

Todo jogo novo deve ter um wrapper proprio, por exemplo:

```tsx
<div className="novo-jogo-game">
  <div className="novo-jogo-shell">
    ...
  </div>
</div>
```

## Layout base

Classes principais:

- `impostor-game`: escopo do jogo, tokens de cor e fonte.
- `impostor-shell`: largura maxima, altura minima e padding geral.
- `impostor-topbar`: barra superior com voltar, marca e fase atual.
- `impostor-screen`: tela/fase padrao.
- `impostor-screen-fill`: tela que deve ocupar a altura disponivel.
- `impostor-spacer`: empurra a acao principal para baixo.
- `impostor-sticky-action`: mantem botao principal acessivel perto do fim.

O layout e pensado para celular primeiro:

```css
.impostor-shell {
  width: min(100%, 480px);
  min-height: 100vh;
  margin: 0 auto;
  padding: 18px 14px 24px;
}
```

Em telas maiores, ele aumenta ate `760px`.

## Regra de tela cheia

Todo jogo deve ocupar a tela inteira do celular e parecer uma experiencia completa, nao um bloco solto no topo.

Regras:

- o wrapper do jogo deve ter `min-height: 100vh`;
- o shell interno tambem deve ter `min-height: 100vh`;
- cada fase principal deve usar uma classe equivalente a `impostor-screen`;
- a tela deve distribuir conteudo verticalmente;
- a acao principal deve ficar no fim da tela;
- quando houver pouco conteudo, usar um spacer para preencher o espaco;
- quando houver muito conteudo, a area central pode rolar, mas o CTA deve continuar facil de acessar.

Padrao esperado:

```tsx
<motion.section className="impostor-screen">
  <div className="impostor-hero-card">...</div>
  <div className="conteudo-da-fase">...</div>
  <div className="impostor-spacer" />
  <div className="impostor-sticky-action">
    <ImpostorButton>Continuar</ImpostorButton>
  </div>
</motion.section>
```

Regra pratica: nenhuma fase deve terminar visualmente no meio da tela se ela tiver uma acao de continuar. A acao deve descer para a parte inferior.

## Botao principal no rodape

Todos os jogos devem ter o botao principal da fase na parte de baixo.

Exemplos de botoes principais:

- `Comecar rodada`;
- `Continuar`;
- `Revelar papel`;
- `Entendi, passar celular`;
- `Confirmar escolha`;
- `Proxima rodada`;
- `Ver resultado`;
- `Jogar novamente`.

Padrao visual:

- largura total;
- altura minima de `56px`;
- cor principal do jogo;
- texto branco ou escuro conforme contraste;
- radius consistente;
- sombra da cor principal;
- estado disabled com opacidade menor;
- sempre perto do polegar em telas mobile.

No Impostor:

```tsx
<div className="impostor-spacer" />
<div className="impostor-sticky-action">
  <ImpostorButton className="impostor-start-button">
    Comecar rodada
  </ImpostorButton>
</div>
```

CSS:

```css
.impostor-spacer {
  flex: 1;
}

.impostor-sticky-action {
  position: sticky;
  bottom: 14px;
  z-index: 5;
  padding-top: 6px;
}
```

Para outros jogos, criar classes equivalentes:

```css
.novo-jogo-spacer {
  flex: 1;
}

.novo-jogo-sticky-action {
  position: sticky;
  bottom: 14px;
  z-index: 5;
  padding-top: 6px;
}
```

Se a fase tiver botoes secundarios, o botao principal ainda deve ficar mais forte e mais proximo do rodape.

## Barra superior

Estrutura:

- botao voltar;
- marca Playzenha;
- chip da fase atual.

No componente:

```tsx
<header className="impostor-topbar">
  <button className="impostor-home-link">Home</button>
  <div className="impostor-brand">
    <span className="impostor-brand-mark"><Icon name="mask" /></span>
    Playzenha
  </div>
  <span className="impostor-round-chip">{phaseLabel[phase]}</span>
</header>
```

Padrao para novos jogos:

- manter uma topbar curta;
- usar chip de fase;
- nao ocupar muito espaco vertical;
- botao voltar sempre visivel quando fizer sentido.

## Fases do jogo

O `Impostor` usa uma maquina de fases simples com `useState`.

Fases atuais:

```ts
type Phase =
  | 'setup'
  | 'role-distribution-start'
  | 'role-reveal'
  | 'game-start'
  | 'discussion'
  | 'voting-intro'
  | 'voting'
  | 'voting-results'
```

Cada fase renderiza um bloco dentro de:

```tsx
<AnimatePresence mode="wait">
  {phase === 'setup' && (...)}
  {phase === 'role-reveal' && (...)}
</AnimatePresence>
```

Padrao para novos jogos:

- cada fase deve ter uma key propria;
- usar `motion.section` ou `motion.div`;
- animacoes simples: `opacity`, `y`, `scale`;
- evitar varias telas misturadas em uma fase.

## Cards

Cards principais:

- `impostor-hero-card`
- `impostor-secret-card`
- `impostor-panel`
- `impostor-player-card`
- `impostor-vote-card`

Padrao visual:

- borda sutil;
- fundo branco translucido;
- radius grande;
- sombra azul suave;
- fonte divertida em areas de card.

Base:

```css
.impostor-hero-card,
.impostor-secret-card,
.impostor-panel,
.impostor-player-card,
.impostor-vote-card {
  border: 1px solid var(--impostor-border);
  background: rgba(255, 255, 255, 0.86);
  border-radius: 28px;
  box-shadow: var(--impostor-shadow);
  backdrop-filter: blur(20px);
  font-family: var(--impostor-font-fun);
}
```

## Tela de setup

Elementos:

- hero card explicando o jogo;
- lista de jogadores;
- input compacto para nome;
- avatar com inicial;
- botao de remover;
- botao de adicionar;
- painel de configuracao do tempo;
- hint de validacao;
- botao principal para iniciar.

Classes importantes:

- `impostor-setup-grid`
- `impostor-player-list`
- `impostor-player-card`
- `impostor-avatar`
- `impostor-name-input compact`
- `impostor-remove-button`
- `impostor-time-card`
- `impostor-stepper`
- `impostor-hint`
- `impostor-hint error`
- `impostor-start-button`

Regra de validacao:

```tsx
disabled={playerNames.filter((name) => name.trim()).length < 3}
```

Quando o botao esta desabilitado, ele recebe a classe `disabled` e fica com opacidade menor.

## Inputs

Padrao:

```css
.impostor-name-input {
  width: 100%;
  min-height: 52px;
  border: 1px solid var(--impostor-border);
  border-radius: 18px;
  padding: 0 14px;
  color: var(--impostor-ink);
  background: rgba(255, 255, 255, 0.92);
  outline: none;
}
```

Regras:

- fundo claro;
- texto escuro;
- placeholder suave;
- foco com borda e halo;
- nao usar input transparente em tela clara.

## Botoes

O Impostor tem um botao local:

```tsx
const ImpostorButton: React.FC<ImpostorButtonProps> = ({
  children,
  variant = 'primary',
  disabled,
  onClick,
  className = ''
}) => (
  <button
    className={`impostor-game-button ${variant} ${disabled ? 'disabled' : ''} ${className}`}
    disabled={disabled}
    onClick={onClick}
    type="button"
  >
    {children}
  </button>
)
```

Variantes:

- `primary`: azul, texto branco.
- `blue`: atualmente usada como secundaria amarela no Impostor.
- `danger`: vermelho, texto branco.
- `ghost`: fundo branco, texto escuro.
- `success`: verde, texto escuro.

Padrao CSS:

```css
.impostor-game-button {
  width: 100%;
  min-height: 56px;
  border: 0;
  border-radius: 19px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 18px;
  font-weight: 820;
}
```

Botao iniciar rodada:

```tsx
<ImpostorButton
  className="impostor-start-button"
  disabled={playerNames.filter((name) => name.trim()).length < 3}
  onClick={startGameSetup}
>
  Comecar rodada
</ImpostorButton>
```

Para novos jogos:

- o `primary` deve usar a cor principal daquele jogo;
- nao deixar botao primario branco;
- nao usar texto branco em fundo claro;
- se o jogo for roxo, botao primario roxo;
- se o jogo for verde, botao primario verde;
- se o jogo for amarelo, texto deve ser escuro para contraste;
- se o jogo for azul, texto branco.

Exemplo abstrato:

```css
.novo-jogo-button.primary {
  color: white;
  background: var(--novo-jogo-primary);
  box-shadow: 0 20px 44px color-mix(in srgb, var(--novo-jogo-primary) 32%, transparent);
}
```

O botao de continuar nunca deve ficar visualmente perdido. Ele deve ser o elemento mais acionavel da tela.

## Estados desabilitados

```css
.impostor-game-button.disabled {
  opacity: 0.46;
  cursor: not-allowed;
  box-shadow: none;
}
```

Quando um botao parecer claro, verificar primeiro se ele esta `disabled`.

## Telas de segredo

Classes:

- `impostor-secret-card`
- `impostor-secret-card impostor`
- `impostor-secret-card citizen`
- `impostor-big-icon`
- `impostor-theme-badge`
- `impostor-secret-copy`

Uso:

- fundo escuro e forte para informacoes secretas;
- texto branco;
- icone grande no topo;
- mensagem curta;
- hint de seguranca no rodape do card.

Padrao:

```tsx
<div className={`impostor-secret-card ${role === 'Impostor' ? 'impostor' : 'citizen'}`}>
  ...
</div>
```

## Timer

Classes:

- `impostor-timer-wrap`
- `impostor-timer-ring`
- `impostor-timer-value`

O timer usa `conic-gradient` com variavel CSS:

```tsx
style={{
  '--progress': Math.max(0, timeLeft / discussionTime),
  '--ring-color': timeLeft <= 30 ? 'var(--impostor-danger)' : 'var(--impostor-blue)'
} as React.CSSProperties}
```

Regra:

- cor normal: azul;
- ultimos segundos: vermelho;
- numero grande no centro.

## Votacao

Classes:

- `impostor-vote-grid`
- `impostor-vote-card`
- `impostor-vote-card selected`

Padrao:

- cada jogador vira um card clicavel;
- avatar a esquerda;
- nome no centro;
- icone/alerta a direita quando selecionado;
- selecionado tem fundo vermelho suave e borda vermelha.

## Resultado

Classes:

- `impostor-result-card`
- `impostor-result-card citizens`
- `impostor-result-card impostor-win`
- `impostor-facts`
- `impostor-fact`
- `impostor-result-actions`

Padrao:

- card grande;
- icone forte;
- titulo curto;
- resumo do vencedor;
- fatos da partida em cards menores;
- acoes no final.

## Icones

O Impostor usa um componente local `Icon` com SVG inline:

```tsx
<Icon name="mask" />
<Icon name="plus" />
<Icon name="eye" />
```

Para novos jogos, preferir:

- `lucide-react`, se o projeto ja estiver usando;
- ou componente local simples se o jogo precisar de icones muito especificos.

Manter todos os icones com:

```css
stroke: currentColor;
stroke-width: 1.8;
fill: none;
stroke-linecap: round;
stroke-linejoin: round;
```

## Motion e transicoes

O padrao usa `framer-motion`:

```tsx
<motion.section
  key="setup"
  className="impostor-screen"
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
>
```

Boas praticas:

- transicoes curtas;
- nao exagerar em animacoes de escala;
- animar entrada/saida de fase;
- usar `layout` em listas quando jogadores mudam.

## Regras de responsividade

Mobile-first:

- largura base: `480px`;
- tela cheia em altura;
- cada fase com `min-height` calculado;
- botoes com `min-height: 56px`;
- botao principal na parte de baixo;
- cards grandes o suficiente para toque;
- grids viram duas colunas apenas em telas maiores.

Media query:

```css
@media (min-width: 760px) {
  .impostor-shell {
    width: min(100%, 760px);
    padding: 28px;
  }

  .impostor-setup-grid {
    grid-template-columns: 1fr 0.86fr;
  }

  .impostor-vote-grid {
    grid-template-columns: 1fr 1fr;
  }
}
```

## Convencao de nomes

Usar prefixo do jogo em todas as classes:

```text
impostor-*
contato-*
quem-sou-eu-*
ultima-noite-*
```

Evitar classes globais para jogo novo, exceto quando for uma camada compartilhada proposital.

## Como replicar para novos jogos

Checklist:

1. Criar componente em `src/components/NovoJogoGame.tsx`.
2. Criar `type Phase` com as fases do jogo.
3. Criar `phaseLabel` para o chip da topbar.
4. Criar wrapper principal `novo-jogo-game`.
5. Criar shell `novo-jogo-shell`.
6. Criar topbar com voltar, marca e fase.
7. Criar uma tela por fase usando `AnimatePresence`.
8. Reutilizar o padrao visual:
   - hero card;
   - panel;
   - player card;
   - secret/result card;
   - sticky action;
   - hint;
   - vote grid, quando houver votacao.
9. Definir tokens de cor personalizados do jogo.
10. Garantir que a tela de cada fase preenche a altura disponivel.
11. Garantir que o botao principal fica na parte de baixo.
12. Definir botoes locais ou adaptar `GameButton`.
13. Garantir estado disabled claro.
14. Rodar:

```bash
npm.cmd run typecheck
npm.cmd run build
```

## Template CSS base para novo jogo

```css
.novo-jogo-game {
  --novo-jogo-primary: #7d4dff;
  --novo-jogo-secondary: #ffc603;
  --novo-jogo-danger: #ff335f;
  --novo-jogo-success: #27d982;
  --novo-jogo-ink: oklch(16% 0.035 263);
  --novo-jogo-muted: oklch(48% 0.025 260);
  --novo-jogo-bg: oklch(97% 0.015 255);
  --novo-jogo-border: oklch(89% 0.018 255);
  --novo-jogo-shadow: 0 22px 70px rgba(4, 22, 86, 0.16);
  --novo-jogo-font-display: "Geist Pixel", "Inter", system-ui, sans-serif;
  --novo-jogo-font-body: "Inter", system-ui, sans-serif;
  --novo-jogo-font-fun: "Fredoka", "Inter", system-ui, sans-serif;

  min-height: 100vh;
  color: var(--novo-jogo-ink);
  font-family: var(--novo-jogo-font-body);
  background:
    radial-gradient(circle at 12% 0%, color-mix(in oklch, var(--novo-jogo-primary) 24%, transparent), transparent 21rem),
    linear-gradient(180deg, oklch(98% 0.018 255), oklch(94% 0.026 255));
}

.novo-jogo-shell {
  width: min(100%, 480px);
  min-height: 100vh;
  margin: 0 auto;
  padding: 18px 14px 24px;
}

.novo-jogo-screen {
  min-height: calc(100vh - 96px);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.novo-jogo-card {
  border: 1px solid var(--novo-jogo-border);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: var(--novo-jogo-shadow);
  font-family: var(--novo-jogo-font-fun);
}

.novo-jogo-button {
  width: 100%;
  min-height: 56px;
  border: 0;
  border-radius: 19px;
  color: white;
  background: var(--novo-jogo-primary);
  font-family: var(--novo-jogo-font-fun);
  font-weight: 820;
}

.novo-jogo-spacer {
  flex: 1;
}

.novo-jogo-sticky-action {
  position: sticky;
  bottom: 14px;
  z-index: 5;
  padding-top: 6px;
}
```

## Observacoes importantes

- O padrao do Impostor nao significa copiar a cor azul para todos os jogos.
- Cada jogo deve ter uma cor principal propria.
- O padrao a copiar e: estrutura, hierarquia, cards, botoes, tipografia, espacamento, telas cheias, CTA no rodape e estados.
- Evitar telas escuras antigas com inputs transparentes.
- Evitar botoes brancos com texto branco.
- Manter sempre contraste forte entre fundo, botao e texto.
- Toda fase que avanca o fluxo deve ter um botao claro de continuar na parte de baixo.
