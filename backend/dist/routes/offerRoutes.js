"use strict";
// project-handi/backend/src/routes/offerRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const offerController_1 = require("../controllers/offerController");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/v1/offers
 * @desc    Récupère la liste de toutes les offres d'emploi (ACTIVE uniquement)
 * @access  Public (Tous les utilisateurs)
 * @return  {Array} Liste des offres avec les détails de l'entreprise et du recruteur
 */
router.get('/', offerController_1.getOffers);
/**
 * @route   GET /api/v1/offers/recruiter
 * @desc    Récupère toutes les offres du recruteur connecté (ACTIVE et PAUSED)
 * @access  Privé (Token requis + Rôle RECRUITER, ADMIN)
 * @header  Authorization: Bearer <token_jwt>
 * @return  {Array} Liste des offres du recruteur avec les détails de l'entreprise
 */
router.get('/recruiter', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['RECRUITER', 'ADMIN']), offerController_1.getRecruiterOffers);
/**
 * @route   PUT /api/v1/offers/:id
 * @desc    Met à jour une offre d'emploi existante
 * @access  Privé (Token requis + Rôle RECRUITER, ADMIN)
 * @body    { title, description, location, contract, experience, remote, disabilityCompatible, status, ... }
 * @header  Authorization: Bearer <token_jwt>
 * IMPORTANT: Cette route doit être définie AVANT GET /:id pour éviter les conflits de routage
 */
router.put('/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['RECRUITER', 'ADMIN']), offerController_1.updateOffer);
/**
 * @route   DELETE /api/v1/offers/:id
 * @desc    Supprime une offre d'emploi
 * @access  Privé (Token requis + Rôle RECRUITER, ADMIN)
 * @header  Authorization: Bearer <token_jwt>
 * IMPORTANT: Cette route doit être définie AVANT GET /:id pour éviter les conflits de routage
 */
router.delete('/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['RECRUITER', 'ADMIN']), offerController_1.deleteOffer);
/**
 * @route   GET /api/v1/offers/:id
 * @desc    Récupère une offre spécifique par son ID
 * @access  Public (Tous les utilisateurs)
 * @return  {Object} Détails complets de l'offre avec entreprise et recruteur
 */
router.get('/:id', offerController_1.getOfferById);
/**
 * @route   POST /api/v1/offers
 * @desc    Crée une nouvelle offre d'emploi
 * @access  Privé (Token requis + Rôle RECRUITER)
 * @body    { title, description, location, contract, experience, remote, disabilityCompatible, companyId }
 * @header  Authorization: Bearer <token_jwt>
 */
router.post('/', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['RECRUITER', 'ADMIN']), offerController_1.createOffer);
exports.default = router;
