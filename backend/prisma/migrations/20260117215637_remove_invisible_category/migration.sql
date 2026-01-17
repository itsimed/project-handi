-- Migration: Retirer INVISIBLE de l'enum DisabilityCategory
-- 
-- Cette migration retire la valeur 'INVISIBLE' de l'enum DisabilityCategory
-- car elle n'est plus utilisée dans les formulaires de création/modification d'offres.

-- Étape 1: Nettoyer les données existantes qui utilisent INVISIBLE
-- Si des offres utilisent INVISIBLE dans disabilityCompatible (JSON), on les retire
UPDATE "Offer"
SET "disabilityCompatible" = (
  SELECT jsonb_agg(elem)
  FROM jsonb_array_elements_text("disabilityCompatible"::jsonb) AS elem
  WHERE elem != 'INVISIBLE'
)
WHERE "disabilityCompatible"::text LIKE '%INVISIBLE%';

-- Si des adaptations utilisent INVISIBLE, on les supprime ou on les met à jour
-- (Optionnel: supprimer les adaptations avec INVISIBLE si elles existent)
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

-- Étape 4: Supprimer l'ancien enum et renommer le nouveau
DROP TYPE "DisabilityCategory";
ALTER TYPE "DisabilityCategory_new" RENAME TO "DisabilityCategory";
