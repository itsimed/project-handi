-- Migration: Retirer INVISIBLE de l'enum DisabilityCategory (correction)
-- 
-- Cette migration retire la valeur 'INVISIBLE' de l'enum DisabilityCategory
-- car elle n'est plus utilisée dans les formulaires de création/modification d'offres.

-- Étape 1: Nettoyer les données existantes qui utilisent INVISIBLE
-- Si des offres utilisent INVISIBLE dans disabilityCompatible (array), on les retire
UPDATE "Offer"
SET "disabilityCompatible" = (
  SELECT ARRAY_AGG(elem::text::"DisabilityCategory")
  FROM UNNEST("disabilityCompatible") AS elem
  WHERE elem::text != 'INVISIBLE'
)
WHERE 'INVISIBLE' = ANY("disabilityCompatible");

-- Si des adaptations utilisent INVISIBLE, on les supprime
DELETE FROM "Adaptation" WHERE category = 'INVISIBLE';

-- Étape 2: Créer un nouvel enum sans INVISIBLE
CREATE TYPE "DisabilityCategory_new" AS ENUM (
  'MOTEUR',
  'VISUEL',
  'AUDITIF',
  'PSYCHIQUE',
  'COGNITIF',
  'NO_COMPENSATION'
);

-- Étape 3: Mettre à jour la colonne Adaptation.category
ALTER TABLE "Adaptation" 
  ALTER COLUMN category TYPE "DisabilityCategory_new" 
  USING category::text::"DisabilityCategory_new";

-- Étape 4: Mettre à jour la colonne Offer.disabilityCompatible (array)
-- Créer une colonne temporaire, migrer les données, puis remplacer
ALTER TABLE "Offer" ADD COLUMN "disabilityCompatible_temp" "DisabilityCategory_new"[];

-- Migrer les données en filtrant INVISIBLE
UPDATE "Offer"
SET "disabilityCompatible_temp" = (
  SELECT ARRAY_AGG(elem::text::"DisabilityCategory_new")
  FROM UNNEST("disabilityCompatible") AS elem
  WHERE elem::text != 'INVISIBLE'
);

-- Supprimer l'ancienne colonne et renommer la nouvelle
ALTER TABLE "Offer" DROP COLUMN "disabilityCompatible";
ALTER TABLE "Offer" RENAME COLUMN "disabilityCompatible_temp" TO "disabilityCompatible";

-- Étape 5: Supprimer l'ancien enum et renommer le nouveau
DROP TYPE "DisabilityCategory";
ALTER TYPE "DisabilityCategory_new" RENAME TO "DisabilityCategory";
