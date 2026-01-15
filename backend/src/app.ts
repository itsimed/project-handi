// project-handi/backend/src/app.ts

// IMPORTANT: Charger dotenv en PREMIER, avant tous les autres imports
// qui pourraient utiliser des variables d'environnement (comme Prisma)
import dotenv from 'dotenv';
dotenv.config();

// Vérifier que les variables essentielles sont chargées
if (!process.env.DATABASE_URL) {
  console.error('❌ ERREUR CRITIQUE: DATABASE_URL n\'est pas défini');
  console.error('Vérifiez que le fichier .env existe et contient DATABASE_URL');
  process.exit(1);
}

import express from 'express';
import cors from 'cors';
import allRoutes from './routes';
import { logger } from './utils/logger';
import { setupSSHTunnel } from './tunnel';

// Initialiser le tunnel SSH si nécessaire
(async () => {
  if (process.env.SSH_PASSWORD) {
    console.log('🔗 Setting up SSH tunnel to Paris 8...');
    await setupSSHTunnel();
    console.log('✅ SSH tunnel ready');
  }

  // 1. Configuration
  const app = express();

  // 2. Middlewares Globaux
  app.use( cors({ origin: '*' }) );

  app.use( express.json({ limit: '10mb' }) );

  app.use( express.urlencoded({ extended: true }) );

  // Middleware de logging pour toutes les requêtes (APRÈS le parsing du body)
  app.use((req, res, next) => {
    // Ne logger que les requêtes importantes (pas les GET simples)
    if (req.method !== 'GET' || req.path.includes('/auth') || req.path.includes('/applications')) {
      logger.info(`${req.method} ${req.path}`, req.body && Object.keys(req.body).length > 0 ? req.body : undefined);
    }
    next();
  });

  // Middleware de gestion d'erreurs global (doit être avant les routes)
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('[GLOBAL ERROR HANDLER]', { message: err.message, stack: err.stack });
  
    res.status(500).json({ 
      error: "Erreur interne du serveur",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  // 3. Définition des Routes
  app.use( '/api/v1', allRoutes );

  /**
   * Route de santé (Healthcheck) pour vérifier que l'API répond.
   */
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'Online',
      message: 'API Project Handi Backend'
    });
  });

  // 4. Démarrage du Serveur
  // Note: Le port 5000 est souvent utilisé par AirPlay sur macOS
  const PORT = process.env.PORT || 4000;

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server is flying on port ${PORT}`);
    console.log(`📡 Base URL: http://localhost:${PORT}/api/v1`);
  });

  // Gestion propre de l'arrêt du serveur
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
})();