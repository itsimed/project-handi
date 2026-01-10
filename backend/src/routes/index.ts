// project-handi/backend/src/routes/index.ts

import { Router } from 'express';
import authRoutes from './authRoutes';
import offerRoutes from './offerRoutes'; 
import userRoutes from './userRoutes'; 
import companyRoutes from './companyRoutes';
import applicationRoutes from './applicationRoutes';
import documentRoutes from './documentRoutes';

const router = Router();

/**
 * Note : Le préfixe /api/v1 est déjà défini dans app.ts.
 * On définit ici uniquement les sous-chemins.
 */

// --- Authentification ---
router.use('/auth', authRoutes);

// --- Entreprises ---
router.use('/companies', companyRoutes);

// --- Offres d'emploi ---
router.use('/offers', offerRoutes);

// --- Utilisateurs ---
router.use('/users', userRoutes);

// --- Candidatures ---
router.use('/applications', applicationRoutes);

// --- Documents ---
router.use('/documents', documentRoutes);

// Route de test (Health Check)
router.get('/', (req, res) =>
{
    res.status(200).json
    (
        { 
            status: 'success', 
            message: 'Project Handi API is online', 
            version: '1.0.0',
            timestamp: new Date().toISOString()
        }
    );
});

export default router;