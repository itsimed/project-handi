// project-handi/backend/src/routes/statsRoutes.ts
import { Router } from 'express';
import { 
    getTotalApplications, 
    getTotalApplicants,
    getAllStats,
    getRecruiterStats
} from '../controllers/statsController';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware';

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

/**
 * @route   GET /api/v1/stats/recruiter
 * @desc    Récupère les statistiques du recruteur connecté (ses offres et candidatures reçues)
 * @access  Privé (Rôle: RECRUITER, ADMIN)
 */
router.get('/recruiter', authenticateToken, authorizeRole(['RECRUITER', 'ADMIN']), getRecruiterStats);

export default router;
