"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const applicationController_1 = require("../controllers/applicationController");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/v1/applications/me
 * @desc    Récupère les candidatures de l'utilisateur connecté (Candidat)
 * @access  Privé (Rôle: APPLICANT)
 */
router.get('/me', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['APPLICANT']), applicationController_1.getMyApplications);
/**
 * @route   POST /api/v1/applications
 * @desc    Permet à un candidat de postuler à une offre
 * @access  Privé (Rôle: APPLICANT)
 * @body    { "offerId": number }
 */
router.post('/', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['APPLICANT']), applicationController_1.createApplication);
/**
 * @route   GET /api/v1/applications/recruiter
 * @desc    Permet à un recruteur de voir les candidatures reçues pour son entreprise
 * @access  Privé (Rôle: RECRUITER, ADMIN)
 */
router.get('/recruiter', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['RECRUITER', 'ADMIN']), applicationController_1.getRecruiterApplications);
/**
 * @route   GET /api/v1/applications/offer/:offerId
 * @desc    Récupère toutes les candidatures d'une offre spécifique
 * @access  Privé (Rôle: RECRUITER, ADMIN)
 */
router.get('/offer/:offerId', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['RECRUITER', 'ADMIN']), applicationController_1.getApplicationsByOffer);
/**
 * @route   GET /api/v1/applications/:id
 * @desc    Récupère les détails d'une candidature spécifique (Candidat/Recruteur)
 * @access  Privé (Rôle: APPLICANT, RECRUITER, ADMIN)
 */
router.get('/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['APPLICANT', 'RECRUITER', 'ADMIN']), applicationController_1.getApplicationById);
/**
 * @route   PUT /api/v1/applications/:id/status
 * @desc    Permet à un recruteur de modifier le statut d'une candidature (VIEWED/NOT_VIEWED)
 * @access  Privé (Rôle: RECRUITER, ADMIN)
 */
router.put('/:id/status', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['RECRUITER', 'ADMIN']), applicationController_1.updateApplicationStatus);
// L'export par défaut que ton fichier routes/index.ts attend
exports.default = router;
