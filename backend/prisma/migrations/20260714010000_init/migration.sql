CREATE TYPE "PlanCode" AS ENUM ('free', 'premium', 'ultimate');
CREATE TYPE "BillingInterval" AS ENUM ('month', 'year');
CREATE TYPE "Currency" AS ENUM ('BRL');
CREATE TYPE "Entitlement" AS ENUM (
  'play_free_games',
  'play_premium_games',
  'play_adult_games',
  'remove_ads',
  'use_ai',
  'advanced_statistics',
  'early_access'
);
CREATE TYPE "GameDifficulty" AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE "GameStatus" AS ENUM ('available', 'coming-soon', 'disabled');

CREATE TABLE "Game" (
  "id" UUID NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "shortDescription" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "minPlayers" INTEGER NOT NULL,
  "maxPlayers" INTEGER NOT NULL,
  "averageDurationMinutes" INTEGER NOT NULL,
  "difficulty" "GameDifficulty" NOT NULL,
  "status" "GameStatus" NOT NULL,
  "requiredPlan" "PlanCode" NOT NULL,
  "tags" TEXT[] NOT NULL,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "isNew" BOOLEAN NOT NULL DEFAULT false,
  "icon" TEXT,
  "colors" TEXT[] NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SubscriptionPlan" (
  "code" "PlanCode" NOT NULL,
  "name" TEXT NOT NULL,
  "priceCents" INTEGER NOT NULL,
  "currency" "Currency" NOT NULL DEFAULT 'BRL',
  "billingInterval" "BillingInterval" NOT NULL,
  "entitlements" "Entitlement"[] NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("code")
);

CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");
CREATE INDEX "Game_status_idx" ON "Game"("status");
CREATE INDEX "Game_requiredPlan_idx" ON "Game"("requiredPlan");
