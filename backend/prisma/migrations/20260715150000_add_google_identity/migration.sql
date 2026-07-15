-- Allow accounts created exclusively through an external identity provider.
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP NOT NULL;

CREATE TYPE "IdentityProvider" AS ENUM ('google');

CREATE TABLE "ExternalIdentity" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "provider" "IdentityProvider" NOT NULL,
    "providerSubject" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalIdentity_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ExternalIdentity_provider_providerSubject_key"
ON "ExternalIdentity"("provider", "providerSubject");

CREATE UNIQUE INDEX "ExternalIdentity_userId_provider_key"
ON "ExternalIdentity"("userId", "provider");

CREATE INDEX "ExternalIdentity_email_idx" ON "ExternalIdentity"("email");

ALTER TABLE "ExternalIdentity"
ADD CONSTRAINT "ExternalIdentity_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
