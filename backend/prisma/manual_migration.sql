-- Migration sécurisée pour changer les statuts de PENDING/ACCEPTED/REJECTED vers NOT_VIEWED/VIEWED
-- Étape 1: Ajouter une colonne temporaire
ALTER TABLE "Application" ADD COLUMN "status_temp" TEXT;

-- Étape 2: Mapper les anciennes valeurs vers les nouvelles
UPDATE "Application" 
SET "status_temp" = CASE 
    WHEN status::text = 'PENDING' THEN 'NOT_VIEWED'
    WHEN status::text = 'ACCEPTED' THEN 'VIEWED'
    WHEN status::text = 'REJECTED' THEN 'VIEWED'
    ELSE 'NOT_VIEWED'
END;

-- Étape 3: Supprimer l'ancienne colonne
ALTER TABLE "Application" DROP COLUMN "status";

-- Étape 4: Renommer la colonne temporaire
ALTER TABLE "Application" RENAME COLUMN "status_temp" TO "status";

-- Étape 5: Supprimer l'ancien enum
DROP TYPE IF EXISTS "ApplicationStatus";

-- Étape 6: Créer le nouvel enum
CREATE TYPE "ApplicationStatus" AS ENUM ('NOT_VIEWED', 'VIEWED');

-- Étape 7: Convertir la colonne en enum
ALTER TABLE "Application" ALTER COLUMN "status" TYPE "ApplicationStatus" USING status::text::"ApplicationStatus";

-- Étape 8: Définir la valeur par défaut
ALTER TABLE "Application" ALTER COLUMN "status" SET DEFAULT 'NOT_VIEWED'::"ApplicationStatus";
