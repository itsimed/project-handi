-- Script de réparation pour Railway
-- Exécuter ce script depuis Railway CLI ou Dashboard pour marquer la migration comme résolue

-- 1. Marquer la migration échouée comme terminée
UPDATE "_prisma_migrations"
SET finished_at = started_at + INTERVAL '1 second',
    applied_steps_count = 1,
    logs = 'Manually resolved - migration was incomplete'
WHERE migration_name = '20260117215637_remove_invisible_category'
  AND finished_at IS NULL;

-- 2. Vérifier l'état
SELECT migration_name, started_at, finished_at, applied_steps_count, logs
FROM "_prisma_migrations"
WHERE migration_name LIKE '%remove_invisible%'
ORDER BY started_at DESC;
