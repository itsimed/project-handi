-- Script SQL pour migration manuelle des statuts
-- À exécuter directement dans PostgreSQL

BEGIN;

-- Étape 1: Ajouter une colonne temporaire
ALTER TABLE "Application" ADD COLUMN "status_new" TEXT;

-- Étape 2: Convertir les valeurs
UPDATE "Application" 
SET "status_new" = CASE 
    WHEN status::text = 'PENDING' THEN 'NOT_VIEWED'
    WHEN status::text = 'ACCEPTED' THEN 'VIEWED'
    WHEN status::text = 'REJECTED' THEN 'VIEWED'
    ELSE 'NOT_VIEWED'
END;

-- Étape 3: Supprimer l'ancienne colonne status
ALTER TABLE "Application" DROP COLUMN "status";

-- Étape 4: Renommer status_new en status
ALTER TABLE "Application" RENAME COLUMN "status_new" TO "status";

-- Étape 5: Drop old enum
DROP TYPE "ApplicationStatus";

-- Étape 6: Create new enum
CREATE TYPE "ApplicationStatus" AS ENUM ('NOT_VIEWED', 'VIEWED');

-- Étape 7: Convert column to new enum type
ALTER TABLE "Application" 
ALTER COLUMN "status" TYPE "ApplicationStatus" 
USING status::text::"ApplicationStatus";

-- Étape 8: Set default
ALTER TABLE "Application" 
ALTER COLUMN "status" SET DEFAULT 'NOT_VIEWED'::"ApplicationStatus";

COMMIT;
