CREATE TYPE "AccountStatus" AS ENUM ('active', 'suspended', 'disabled');
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'trialing', 'pastDue', 'canceled', 'expired');
CREATE TYPE "AccessGrantType" AS ENUM ('allGames');
CREATE TYPE "PrivilegedAuditAction" AS ENUM ('accessGrantCreated', 'accessGrantRevoked');

ALTER TABLE "Game" ADD COLUMN "publishedAt" TIMESTAMP(3);
UPDATE "Game" SET "publishedAt" = CURRENT_TIMESTAMP WHERE "status" <> 'disabled';

ALTER TABLE "User" ADD COLUMN "status" "AccountStatus" NOT NULL DEFAULT 'active';

ALTER TABLE "RefreshToken"
  ADD COLUMN "familyId" UUID,
  ADD COLUMN "revokedReason" TEXT;
UPDATE "RefreshToken" SET "familyId" = "id" WHERE "familyId" IS NULL;
ALTER TABLE "RefreshToken" ALTER COLUMN "familyId" SET NOT NULL;

CREATE TABLE "UserSubscription" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "planCode" "PlanCode" NOT NULL,
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'active',
  "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "currentPeriodEnd" TIMESTAMP(3),
  "canceledAt" TIMESTAMP(3),
  "provider" TEXT,
  "providerSubscriptionId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "UserSubscription_period_check" CHECK (
    "currentPeriodEnd" IS NULL OR "currentPeriodEnd" > "startsAt"
  )
);

INSERT INTO "UserSubscription" (
  "id", "userId", "planCode", "status", "startsAt", "createdAt", "updatedAt"
)
SELECT "id", "id", "planCode", 'active', "createdAt", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "User";

CREATE TABLE "AccessGrant" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "type" "AccessGrantType" NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3),
  "revokedAt" TIMESTAMP(3),
  "reason" TEXT NOT NULL,
  "grantedByUserId" UUID NOT NULL,
  "revokedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AccessGrant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AccessGrant_period_check" CHECK (
    "expiresAt" IS NULL OR "expiresAt" > "startsAt"
  ),
  CONSTRAINT "AccessGrant_reason_check" CHECK (length(btrim("reason")) > 0),
  CONSTRAINT "AccessGrant_revocation_check" CHECK (
    ("revokedAt" IS NULL AND "revokedByUserId" IS NULL)
    OR ("revokedAt" IS NOT NULL AND "revokedByUserId" IS NOT NULL)
  )
);

CREATE TABLE "PrivilegedAuditLog" (
  "id" UUID NOT NULL,
  "actorUserId" UUID NOT NULL,
  "targetUserId" UUID,
  "action" "PrivilegedAuditAction" NOT NULL,
  "resourceType" TEXT NOT NULL,
  "resourceId" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PrivilegedAuditLog_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PrivilegedAuditLog_reason_check" CHECK (length(btrim("reason")) > 0)
);

CREATE TABLE "GameContent" (
  "id" UUID NOT NULL,
  "gameId" UUID NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "payload" JSONB NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GameContent_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "GameContent_version_check" CHECK ("version" > 0)
);

INSERT INTO "GameContent" ("id", "gameId", "payload", "createdAt", "updatedAt")
SELECT "id", "id",
  CASE "slug"
    WHEN 'impostor' THEN jsonb_build_object(
      'themes', to_jsonb(ARRAY[
        'Lua','Copa do Mundo','Praia','Netflix','Pizza','Carnaval','Black Friday',
        'Festa Junina','Aniversario','Trabalho','Escola','Hospital','Shopping','Igreja',
        'Cinema','Uber','Instagram','TikTok','WhatsApp','Padaria','Churrasco','Barbearia',
        'Salao de Beleza','Farmacia','Rodoviaria','Metro','Elevador','Formatura','Natal',
        'Ano Novo','Halloween','Videogame','YouTube','Spotify','Bicicleta','Feira','Pet Shop',
        'Supermercado','Academia','Aeroporto','Acampamento','Parque de Diversoes','Museu',
        'Teatro','Restaurante','Lanchonete','Sorveteria','Cafeteria','Biblioteca','Delegacia',
        'Tribunal','Banco','Correios','Posto de Gasolina','Oficina','Condominio','Hotel',
        'Pousada','Cruzeiro','Praca','Floresta','Montanha','Deserto','Ilha','Cachoeira',
        'Piquenique','Parque Aquatico','Karaoke','Show','Festival','Casamento','Reuniao',
        'Home Office','Delivery','Loja de Roupas','Transito'
      ]::TEXT[])
    )
    WHEN 'contato' THEN jsonb_build_object(
      'words', to_jsonb(ARRAY[
        'BACIA','ABACAXI','PIPOCA','CADEIRA','GIRAFA','BICICLETA','CHUVEIRO','ESTOJO',
        'TOMATE','SORVETE','FUTEBOL','LANTERNA','CACHORRO','JANELA','VIOLAO','PANELA',
        'TRAVESSEIRO','MELANCIA','PIRULITO','LIVRARIA'
      ]::TEXT[])
    )
    ELSE '{}'::jsonb
  END,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Game"
WHERE "status" = 'available';

CREATE UNIQUE INDEX "UserSubscription_userId_key" ON "UserSubscription"("userId");
CREATE UNIQUE INDEX "UserSubscription_providerSubscriptionId_key" ON "UserSubscription"("providerSubscriptionId");
CREATE INDEX "UserSubscription_status_currentPeriodEnd_idx" ON "UserSubscription"("status", "currentPeriodEnd");
CREATE INDEX "UserSubscription_planCode_idx" ON "UserSubscription"("planCode");
CREATE INDEX "User_status_idx" ON "User"("status");
CREATE INDEX "RefreshToken_familyId_idx" ON "RefreshToken"("familyId");
CREATE INDEX "AccessGrant_userId_type_startsAt_expiresAt_revokedAt_idx" ON "AccessGrant"("userId", "type", "startsAt", "expiresAt", "revokedAt");
CREATE INDEX "AccessGrant_grantedByUserId_idx" ON "AccessGrant"("grantedByUserId");
CREATE INDEX "AccessGrant_revokedByUserId_idx" ON "AccessGrant"("revokedByUserId");
CREATE INDEX "PrivilegedAuditLog_actorUserId_createdAt_idx" ON "PrivilegedAuditLog"("actorUserId", "createdAt");
CREATE INDEX "PrivilegedAuditLog_targetUserId_createdAt_idx" ON "PrivilegedAuditLog"("targetUserId", "createdAt");
CREATE INDEX "PrivilegedAuditLog_resourceType_resourceId_idx" ON "PrivilegedAuditLog"("resourceType", "resourceId");
CREATE UNIQUE INDEX "GameContent_gameId_key" ON "GameContent"("gameId");

ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_planCode_fkey"
  FOREIGN KEY ("planCode") REFERENCES "SubscriptionPlan"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AccessGrant" ADD CONSTRAINT "AccessGrant_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AccessGrant" ADD CONSTRAINT "AccessGrant_grantedByUserId_fkey"
  FOREIGN KEY ("grantedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AccessGrant" ADD CONSTRAINT "AccessGrant_revokedByUserId_fkey"
  FOREIGN KEY ("revokedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PrivilegedAuditLog" ADD CONSTRAINT "PrivilegedAuditLog_actorUserId_fkey"
  FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PrivilegedAuditLog" ADD CONSTRAINT "PrivilegedAuditLog_targetUserId_fkey"
  FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "GameContent" ADD CONSTRAINT "GameContent_gameId_fkey"
  FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

DROP INDEX "User_planCode_idx";
ALTER TABLE "User" DROP COLUMN "planCode";
