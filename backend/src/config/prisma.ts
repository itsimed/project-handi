// project-handi/backend/src/config/prisma.ts

import { PrismaClient } from '@prisma/client';

// Note: dotenv est déjà chargé dans app.ts AVANT l'import de ce fichier
// Ne pas recharger dotenv ici pour éviter les conflits

// Vérifier que DATABASE_URL est défini
if (!process.env.DATABASE_URL) {
  console.error('❌ ERREUR: DATABASE_URL n\'est pas défini dans les variables d\'environnement');
  console.error('Assurez-vous que dotenv.config() est appelé AVANT l\'import de ce fichier');
  throw new Error('DATABASE_URL is not defined');
}

// Instancier le client une seule fois
let prisma: PrismaClient;

try {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
  console.log('✅ PrismaClient instancié avec succès');
} catch (error: any) {
  console.error('❌ Erreur lors de l\'instanciation de PrismaClient:', error.message);
  throw error;
}

// Tester la connexion au démarrage (optionnel, peut être commenté en production)
if (process.env.NODE_ENV === 'development') {
  prisma.$connect()
    .then(() => {
      console.log('✅ Connexion Prisma à la base de données réussie');
    })
    .catch((error: any) => {
      console.error('❌ Erreur de connexion Prisma:', error.message);
    });
}

// Exporter pour une utilisation globale dans les services
export default prisma;