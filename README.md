# PlayZenha

PlayZenha é uma aplicação web de jogos sociais para jogar em grupo pelo celular. O catálogo inclui jogos como **Impostor**, **Última Noite**, **Contato** e **Quem Sou Eu**.

## Como o projeto funciona

- **Interface web** em React, TypeScript e Vite, com estilos em Tailwind CSS. A interface reúne o catálogo, as telas dos jogos e o fluxo de cadastro e login.
- **API** em NestJS para autenticação, catálogo de jogos e controle de acesso. A API verifica a permissão antes de entregar o conteúdo de uma partida.
- **Banco de dados** PostgreSQL com Prisma para acesso aos dados, migrações e carga inicial.

## Executar localmente

Use Node.js 22, npm e Docker com Docker Compose. Os comandos abaixo usam Bash ou Git Bash.

1. Na raiz do repositório, suba o PostgreSQL.

   ```bash
   docker compose up -d --wait postgres
   ```

2. No mesmo terminal, configure e inicie a API.

   ```bash
   cd backend
   npm ci
   cp .env.example .env
   npm run prisma:generate
   npm run prisma:migrate:deploy
   npm run prisma:seed
   npm run start:dev
   ```

3. Em outro terminal, a partir da raiz do repositório, configure e inicie a interface.

   ```bash
   npm ci
   cp .env.example .env
   npm run dev
   ```

Abra a [interface web](http://localhost:5173). A documentação interativa da API está no [Swagger](http://localhost:3000/docs). Para configurar o login com Google, use o mesmo ID de cliente OAuth do tipo Web nos dois arquivos `.env`. Consulte os exemplos de configuração do [frontend](.env.example) e do [backend](backend/.env.example).

## Verificações

Na raiz, execute `npm run typecheck` e `npm run test:run` para validar o frontend. Para os testes e detalhes de configuração da API, consulte a [documentação do backend](backend/README.md).
