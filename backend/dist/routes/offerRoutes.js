"use strict";
// project-handi/backend/src/routes/offerRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const offerController_1 = require("../controllers/offerController");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/v1/offers
 * @desc    Récupère la liste de toutes les offres d'emploi
 * @access  Public (Tous les utilisateurs)
 * @return  {Array} Liste des offres avec les détails de l'entreprise et du recruteur
 */
router.get('/', offerController_1.getOffers);
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
