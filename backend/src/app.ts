// project-handi/backend/src/app.ts

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import allRoutes from './routes'; 

// 1. Configuration
dotenv.config();
const app = express();

// 2. Middlewares Globaux
app.use( cors({ origin: '*' }) );

app.use( express.json({ limit: '10mb' }) );

app.use( express.urlencoded({ extended: true }) );

// 3. Définition des Routes
app.use( '/api/v1', allRoutes );

/**
 * Route de santé (Healthcheck) pour vérifier que l'API répond.
 */
app.get
( 
  '/', (req, res) => 
  {
    res.status(200).json
    (
      { 
        status: 'Online', 
        message: 'API Project Handi Backend' 
      }
    );
  }
);

// 4. Démarrage du Serveur
// Note: Le port 5000 est souvent utilisé par AirPlay sur macOS
const PORT = process.env.PORT || 4000;

app.listen
(
    PORT, () => 
    {
        console.log(`🚀 Server is flying on port ${PORT}`);
        console.log(`📡 Base URL: http://localhost:${PORT}/api/v1`);
    }
);