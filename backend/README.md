# PlayZenha API

API NestJS do PlayZenha. Esta primeira fatia publica o health check, o catalogo
de jogos e os planos de assinatura usando Prisma e PostgreSQL.

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
| GET | `/v1/games` | Catalogo de jogos |
| GET | `/v1/games/:slug` | Jogo por slug |
| GET | `/v1/subscriptions` | Planos ativos |

O frontend ainda nao chama estes endpoints.

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
