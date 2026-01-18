# 🚨 Fix Railway - Migration Échouée

## Problème
La migration `20260117215637_remove_invisible_category` a échoué sur Railway et bloque tous les déploiements.

```
Error: P3009
migrate found failed migrations in the target database
The `20260117215637_remove_invisible_category` migration started at 2026-01-17 20:58:50.993560 UTC failed
```

## Solution 1: Via Railway Dashboard (RECOMMANDÉ)

### Étape 1: Accéder à la base de données
1. Aller sur Railway Dashboard
2. Sélectionner le projet `project-handi`
3. Cliquer sur la base de données PostgreSQL
4. Ouvrir l'onglet "Query"

### Étape 2: Exécuter le SQL de réparation
Coller et exécuter ce SQL :

```sql
-- Supprimer les entrées de migrations problématiques
DELETE FROM "_prisma_migrations"
WHERE migration_name IN (
  '20260117215637_remove_invisible_category',
  '20260117220000_fix_remove_invisible_category'
);

-- Vérifier que c'est bien supprimé
SELECT migration_name, started_at, finished_at
FROM "_prisma_migrations"
ORDER BY started_at DESC
LIMIT 5;
```

### Étape 3: Redéployer
1. Aller dans l'onglet "Deployments"
2. Cliquer sur "Deploy Latest Commit"
3. Les migrations restantes s'appliqueront correctement

## Solution 2: Via Railway CLI

### Prérequis
```bash
npm install -g @railway/cli
railway login
railway link
```

### Exécution
```bash
cd backend
railway run npx prisma migrate resolve --rolled-back 20260117215637_remove_invisible_category
railway run npx prisma migrate deploy
```

## Solution 3: Reset complet (DANGER)

⚠️ **Utilisez uniquement si les solutions précédentes échouent et que vous avez un backup**

```bash
railway run npx prisma migrate reset --force
railway run npx prisma db seed
```

## Vérification

Après la correction, vérifier que Railway démarre :

```bash
railway logs
```

Vous devriez voir :
```
✓ Prisma Migrate applied successfully
🚀 Server is flying on port XXXX
```

## Pourquoi c'est arrivé ?

Les migrations `20260117215637_remove_invisible_category` et `20260117220000_fix_remove_invisible_category` ont été créées puis supprimées du code source, mais elles existent toujours dans la base Railway avec un statut "failed".

Prisma refuse d'appliquer de nouvelles migrations tant que cette migration échouée existe.

## État actuel du code

- ✅ Migrations problématiques supprimées du code
- ✅ Schema Prisma ne contient plus `INVISIBLE`  
- ✅ Migration `20260119000000_fix_additional_docs_json` prête à s'appliquer
- ⏳ Base Railway doit être nettoyée manuellement

## Migrations actuelles dans le code

```
20251120174548_init
20251215190613_create_core_tables
20260102163536_add_filters_and_relations
20260104194108_add_recruiter_optional
20260104194741_add_recruiter_required
20260105223703_temp_optional_company
20260105230827_optional_company
20260105232553_naming_company_relation
20260107173829_add_application_documents
20260108162619_contract_as_array
20260110161227_add_application_documents
20260115180000_change_status_to_viewed_not_viewed
20260117003556_change_application_status_to_viewed_not_viewed
20260118000000_add_offer_status
20260118000001_add_no_compensation_category
20260119000000_fix_additional_docs_json
```

Total: 16 migrations (au lieu de 18 avec les problématiques)
