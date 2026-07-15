UPDATE "User"
SET "nickname" = "name"
WHERE "nickname" IS NULL OR btrim("nickname") = '';

ALTER TABLE "User" ALTER COLUMN "nickname" SET NOT NULL;
ALTER TABLE "User" DROP COLUMN "name";
