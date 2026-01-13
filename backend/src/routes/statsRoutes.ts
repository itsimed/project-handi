// project-handi/backend/src/routes/statsRoutes.ts
import { Router } from 'express';
import { 
    getTotalApplications, 
    getTotalApplicants,
    getAllStats 
} from '../controllers/statsController';

const router = Router();

/**
 * @route   GET /api/v1/stats
 * @desc    Récupère toutes les statistiques (candidatures, candidats, offres, entreprises)
 * @access  Public
 */
router.get('/', getAllStats);

/**
 * @route   GET /api/v1/stats/applications
 * @desc    Récupère le nombre total de candidatures
 * @access  Public
 */
router.get('/applications', getTotalApplications);

/**
 * @route   GET /api/v1/stats/applicants
 * @desc    Récupère le nombre total de candidats inscrits
 * @access  Public
 */
router.get('/applicants', getTotalApplicants);

export default router;
