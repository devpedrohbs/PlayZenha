@echo off
setlocal

cd /d "%~dp0"

echo [1/6] Verificando requisitos...
where node >nul 2>&1 || (
  echo ERRO: Node.js nao foi encontrado. Instale o Node.js 20.19 ou superior.
  exit /b 1
)
where npm.cmd >nul 2>&1 || (
  echo ERRO: npm nao foi encontrado.
  exit /b 1
)
where docker >nul 2>&1 || (
  echo ERRO: Docker nao foi encontrado. Instale e inicie o Docker Desktop.
  exit /b 1
)
docker info >nul 2>&1 || (
  echo ERRO: Docker Desktop nao esta em execucao.
  exit /b 1
)

echo [2/6] Instalando dependencias do frontend...
call npm.cmd ci || exit /b 1

if not exist .env (
  echo Criando .env a partir de .env.example...
  copy /Y .env.example .env >nul || exit /b 1
)

echo [3/6] Instalando dependencias do backend...
pushd backend
call npm.cmd ci || (
  popd
  exit /b 1
)

if not exist .env (
  echo Criando backend\.env a partir de backend\.env.example...
  copy /Y .env.example .env >nul || (
    popd
    exit /b 1
  )
)

echo [4/6] Gerando o Prisma Client...
call npm.cmd run prisma:generate || (
  popd
  exit /b 1
)
popd

echo [5/6] Iniciando o PostgreSQL...
docker compose up -d postgres || exit /b 1

echo [6/6] Preparando o banco de dados...
pushd backend
call npm.cmd run prisma:migrate:deploy || (
  popd
  exit /b 1
)
call npm.cmd run prisma:seed || (
  popd
  exit /b 1
)
popd

echo.
echo Projeto preparado com sucesso.
echo Frontend: npm.cmd run dev
echo Backend:  cd backend ^&^& npm.cmd run start:dev

endlocal
