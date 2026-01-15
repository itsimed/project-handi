// Script de migration pour changer les statuts ApplicationStatus
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateStatuses() {
  console.log('🔄 Début de la migration des statuts...');

  try {
    // Exécuter les requêtes SQL brutes pour migrer les statuts
    await prisma.$executeRawUnsafe(`
      -- Étape 1: Ajouter une colonne temporaire
      ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "status_new" TEXT;
    `);

    await prisma.$executeRawUnsafe(`
      -- Étape 2: Convertir les valeurs
      UPDATE "Application" 
      SET "status_new" = CASE 
          WHEN status::text = 'PENDING' THEN 'NOT_VIEWED'
          WHEN status::text = 'ACCEPTED' THEN 'VIEWED'
          WHEN status::text = 'REJECTED' THEN 'VIEWED'
          ELSE 'NOT_VIEWED'
      END
      WHERE "status_new" IS NULL;
    `);

    console.log('✅ Données converties');

    await prisma.$executeRawUnsafe(`
      -- Étape 3: Supprimer l'ancienne colonne
      ALTER TABLE "Application" DROP COLUMN IF EXISTS "status";
    `);

    await prisma.$executeRawUnsafe(`
      -- Étape 4: Renommer la colonne
      ALTER TABLE "Application" RENAME COLUMN "status_new" TO "status";
    `);

    await prisma.$executeRawUnsafe(`
      -- Étape 5: Drop old enum
      DROP TYPE IF EXISTS "ApplicationStatus";
    `);

    await prisma.$executeRawUnsafe(`
      -- Étape 6: Create new enum
      CREATE TYPE "ApplicationStatus" AS ENUM ('NOT_VIEWED', 'VIEWED');
    `);

    await prisma.$executeRawUnsafe(`
      -- Étape 7: Convert column type
      ALTER TABLE "Application" 
      ALTER COLUMN "status" TYPE "ApplicationStatus" 
      USING status::text::"ApplicationStatus";
    `);

    await prisma.$executeRawUnsafe(`
      -- Étape 8: Set default
      ALTER TABLE "Application" 
      ALTER COLUMN "status" SET DEFAULT 'NOT_VIEWED'::"ApplicationStatus";
    `);

    console.log('✅ Migration terminée avec succès!');
    console.log('📊 Les statuts ont été convertis:');
    console.log('   - PENDING → NOT_VIEWED');
    console.log('   - ACCEPTED → VIEWED');
    console.log('   - REJECTED → VIEWED');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateStatuses()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
