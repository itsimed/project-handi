-- Migration: Ajouter stockage en base de données pour les fichiers
-- Permet de stocker les CV/lettres directement dans PostgreSQL (Railway compatible)

-- Ajouter la colonne fileData pour stocker les fichiers
ALTER TABLE "application_documents" ADD COLUMN "fileData" BYTEA;

-- Rendre storagePath nullable
ALTER TABLE "application_documents" ALTER COLUMN "storagePath" DROP NOT NULL;

-- Changer la valeur par défaut de storageType
ALTER TABLE "application_documents" ALTER COLUMN "storageType" SET DEFAULT 'database';
