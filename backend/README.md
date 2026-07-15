# PlayZenha API

API NestJS do PlayZenha. Ela publica health check, autenticacao, catalogo de
jogos e planos de assinatura usando Prisma e PostgreSQL.

## Requisitos

- Node.js 20.19 ou superior (Node.js 22 recomendado)
- npm
- PostgreSQL compativel, local ou gerenciado
- Docker apenas para executar o PostgreSQL local sugerido

## Inicio local

Na raiz do repositorio, inicie o banco:

```bash
docker compose up -d postgres
```

Depois, dentro de `backend/`:

```bash
npm install
cp .env.example .env
npm run prisma:migrate:deploy
npm run prisma:seed
npm run start:dev
```

A API fica em `http://localhost:3000` e o Swagger em
`http://localhost:3000/docs`.

## Endpoints

| Metodo | Caminho | Descricao |
| --- | --- | --- |
| GET | `/health` | Estado da API |
| POST | `/v1/auth/register` | Cadastro com e-mail e senha |
| POST | `/v1/auth/login` | Login com e-mail e senha |
| POST | `/v1/auth/refresh` | Rotacao do refresh token |
| POST | `/v1/auth/logout` | Logout e revogacao do refresh token |
| POST | `/v1/auth/forgot-password` | Solicita recuperacao de senha |
| POST | `/v1/auth/reset-password` | Redefine a senha com token |
| GET | `/v1/me` | Perfil do usuario autenticado |
| GET | `/v1/games` | Catalogo de jogos |
| GET | `/v1/games/:slug` | Jogo por slug |
| POST | `/v1/games/:slug/start` | Autoriza e entrega o conteudo protegido do jogo |
| GET | `/v1/subscriptions` | Planos ativos |
| POST | `/v1/admin/access-grants` | Concede `ALL_GAMES` (permissao administrativa) |
| DELETE | `/v1/admin/access-grants/:id` | Revoga concessao e registra auditoria |

O frontend consome autenticacao, catalogo e planos por meio de `VITE_API_URL`,
com estados de carregamento, erro, tentativa novamente e resposta vazia.

O access token identifica somente o usuario. Papel, estado da conta, assinatura,
plano e concessoes sao consultados no banco a cada decisao de acesso. O refresh
token fica em cookie `HttpOnly`, passa por rotacao e tem reutilizacao detectada.
O catalogo publico nao inclui o conteudo necessario para executar jogos.

## Banco e Prisma

O Prisma 7 usa `prisma.config.ts`, o generator `prisma-client` e o adapter
PostgreSQL em tempo de execucao. O client gerado fica em
`src/generated/prisma/` e nao e versionado.

- `DATABASE_URL`: connection string PostgreSQL usada pela aplicacao.
- `DIRECT_URL`: opcional, usada por comandos de migration quando
  `DATABASE_URL` aponta para um pooler.

Migrations e seed ficam em `prisma/` e sao versionados. Para criar uma migration
durante o desenvolvimento, use
`npm run prisma:migrate:dev -- --name nome_da_mudanca`.

## Portabilidade

Supabase, quando adotado, sera apenas um provedor PostgreSQL. A API nao usa
`supabase-js`, Edge Functions, `auth.uid()`, tabelas internas, RLS como regra de
negocio ou chaves de service role.

Para trocar Supabase por PostgreSQL local, Railway, Neon, AWS RDS ou outro
PostgreSQL compativel:

1. Altere `DATABASE_URL` para uma connection string PostgreSQL padrao.
2. Configure `DIRECT_URL` somente se o provedor recomendar uma conexao direta
   separada para migrations.
3. Execute `npm run prisma:migrate:deploy` e `npm run prisma:seed` no novo banco.

As variaveis de runtime sao validadas na inicializacao e acessadas pela
aplicacao somente por `AppConfigService`:

- `PORT` aceita a porta injetada pelo Railway.
- `CORS_ORIGINS` aceita uma ou mais origens HTTP separadas por virgula.
- `SWAGGER_ENABLED` aceita somente `true` ou `false`.
- `LOG_LEVEL` aceita `error`, `warn`, `log`, `debug` ou `verbose`.
- `AUTH_JWT_SECRET` assina access tokens e hashes de tokens opacos. Troque em
  producao e mantenha fora do Git.
- `AUTH_JWT_ISSUER` e `AUTH_JWT_AUDIENCE` restringem onde o token e valido.
- `AUTH_REFRESH_COOKIE_NAME` define o cookie `HttpOnly` de renovacao da sessao.
- `AUTH_ACCESS_TOKEN_TTL_SECONDS`, `AUTH_REFRESH_TOKEN_TTL_SECONDS` e
  `AUTH_PASSWORD_RESET_TTL_SECONDS` controlam expiracao de sessoes e
  recuperacao de senha.

Controllers e services nao conhecem o provedor nem o Prisma. Services dependem
de interfaces de repository; somente as implementacoes em `infrastructure/`
usam `PrismaService`.

## Validacao

```bash
npm run prisma:validate
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run test:integration
npm run build
```

O teste de integracao pressupoe um banco migrado e populado pela seed.

## Variaveis e segredos

Nunca versione `.env`. `DATABASE_URL` e qualquer credencial futura devem existir
somente no ambiente da API ou no secret manager da hospedagem. Nenhuma variavel
de backend deve usar o prefixo publico `VITE_`.
