#!/bin/bash

# Script de réparation de la base de données Railway
# À exécuter depuis Railway CLI: railway run bash railway_fix.sh

echo "🔧 Réparation de la migration échouée sur Railway..."

# Se connecter à la base et exécuter le SQL de réparation
railway run npx prisma db execute --stdin <<SQL
-- Marquer la migration échouée comme terminée
UPDATE "_prisma_migrations"
SET finished_at = started_at + INTERVAL '1 second',
    applied_steps_count = 1,
    logs = 'Manually resolved - migration was removed from codebase'
WHERE migration_name = '20260117215637_remove_invisible_category'
  AND finished_at IS NULL;

-- Supprimer l'entrée si elle pose encore problème
DELETE FROM "_prisma_migrations"
WHERE migration_name IN (
  '20260117215637_remove_invisible_category',
  '20260117220000_fix_remove_invisible_category'
);
SQL

echo "✅ Migration marquée comme résolue"
echo "🚀 Vous pouvez maintenant redéployer"
