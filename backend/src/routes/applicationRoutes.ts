import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware';
import { 
    createApplication, 
    getRecruiterApplications, 
    updateApplicationStatus,
    getMyApplications,
    getApplicationById,
    getApplicationsByOffer
} from '../controllers/applicationController';

const router = Router();

/**
 * @route   GET /api/v1/applications/me
 * @desc    Récupère les candidatures de l'utilisateur connecté (Candidat)
 * @access  Privé (Rôle: APPLICANT)
 */
router.get(
    '/me',
    authenticateToken,
    authorizeRole(['APPLICANT']),
    getMyApplications
);

/**
 * @route   POST /api/v1/applications
 * @desc    Permet à un candidat de postuler à une offre
 * @access  Privé (Rôle: APPLICANT)
 * @body    { "offerId": number }
 */
router.post(
    '/', 
    authenticateToken, 
    authorizeRole(['APPLICANT']), 
    createApplication
);

/**
 * @route   GET /api/v1/applications/recruiter
 * @desc    Permet à un recruteur de voir les candidatures reçues pour son entreprise
 * @access  Privé (Rôle: RECRUITER, ADMIN)
 */
router.get(
    '/recruiter', 
    authenticateToken, 
    authorizeRole(['RECRUITER', 'ADMIN']), 
    getRecruiterApplications
);

/**
 * @route   GET /api/v1/applications/offer/:offerId
 * @desc    Récupère toutes les candidatures d'une offre spécifique
 * @access  Privé (Rôle: RECRUITER, ADMIN)
 */
router.get(
    '/offer/:offerId',
    authenticateToken,
    authorizeRole(['RECRUITER', 'ADMIN']),
    getApplicationsByOffer
);

/**
 * @route   GET /api/v1/applications/:id
 * @desc    Récupère les détails d'une candidature spécifique (Candidat/Recruteur)
 * @access  Privé (Rôle: APPLICANT, RECRUITER, ADMIN)
 */
router.get(
    '/:id',
    authenticateToken,
    authorizeRole(['APPLICANT', 'RECRUITER', 'ADMIN']),
    getApplicationById
);

/**
 * @route   PUT /api/v1/applications/:id/status
 * @desc    Permet à un recruteur de modifier le statut d'une candidature (VIEWED/NOT_VIEWED)
 * @access  Privé (Rôle: RECRUITER, ADMIN)
 */
router.put(
    '/:id/status', 
    authenticateToken, 
    authorizeRole(['RECRUITER', 'ADMIN']), 
    updateApplicationStatus
);

// L'export par défaut que ton fichier routes/index.ts attend
export default router;