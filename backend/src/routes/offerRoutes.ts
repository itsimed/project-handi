// project-handi/backend/src/routes/offerRoutes.ts

import { Router } from 'express';

import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware';
import { getOffers, getOfferById, createOffer, updateOffer, deleteOffer, getRecruiterOffers } from '../controllers/offerController';

const router = Router();

/**
 * @route   GET /api/v1/offers
 * @desc    Récupère la liste de toutes les offres d'emploi (ACTIVE uniquement)
 * @access  Public (Tous les utilisateurs)
 * @return  {Array} Liste des offres avec les détails de l'entreprise et du recruteur
 */
router.get('/', getOffers);

/**
 * @route   GET /api/v1/offers/recruiter
 * @desc    Récupère toutes les offres du recruteur connecté (ACTIVE et PAUSED)
 * @access  Privé (Token requis + Rôle RECRUITER, ADMIN)
 * @header  Authorization: Bearer <token_jwt>
 * @return  {Array} Liste des offres du recruteur avec les détails de l'entreprise
 */
router.get('/recruiter', authenticateToken, authorizeRole(['RECRUITER', 'ADMIN']), getRecruiterOffers);

/**
 * @route   PUT /api/v1/offers/:id
 * @desc    Met à jour une offre d'emploi existante
 * @access  Privé (Token requis + Rôle RECRUITER, ADMIN)
 * @body    { title, description, location, contract, experience, remote, disabilityCompatible, status, ... }
 * @header  Authorization: Bearer <token_jwt>
 * IMPORTANT: Cette route doit être définie AVANT GET /:id pour éviter les conflits de routage
 */
router.put('/:id', authenticateToken, authorizeRole(['RECRUITER', 'ADMIN']), updateOffer);

/**
 * @route   DELETE /api/v1/offers/:id
 * @desc    Supprime une offre d'emploi
 * @access  Privé (Token requis + Rôle RECRUITER, ADMIN)
 * @header  Authorization: Bearer <token_jwt>
 * IMPORTANT: Cette route doit être définie AVANT GET /:id pour éviter les conflits de routage
 */
router.delete('/:id', authenticateToken, authorizeRole(['RECRUITER', 'ADMIN']), deleteOffer);

/**
 * @route   GET /api/v1/offers/:id
 * @desc    Récupère une offre spécifique par son ID
 * @access  Public (Tous les utilisateurs)
 * @return  {Object} Détails complets de l'offre avec entreprise et recruteur
 */
router.get('/:id', getOfferById);

/**
 * @route   POST /api/v1/offers
 * @desc    Crée une nouvelle offre d'emploi
 * @access  Privé (Token requis + Rôle RECRUITER)
 * @body    { title, description, location, contract, experience, remote, disabilityCompatible, companyId }
 * @header  Authorization: Bearer <token_jwt>
 */
router.post('/', authenticateToken, authorizeRole(['RECRUITER', 'ADMIN']), createOffer);

export default router;