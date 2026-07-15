-- O Impostor e o único jogo disponível no plano Free.
-- Os demais jogos já publicados exigem a entitlement play_premium_games,
-- concedida pelos planos Premium e Ultimate.
UPDATE "Game"
SET "requiredPlan" = 'premium'
WHERE "status" = 'available'
  AND "slug" <> 'impostor';
