"use strict";
// project-handi/backend/src/controllers/offerController.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOffer = exports.updateOffer = exports.getOfferById = exports.getRecruiterOffers = exports.getOffers = exports.createOffer = void 0;
const offerService = __importStar(require("../services/offerService"));
/**
 * Contrôleur pour la création d'une nouvelle offre d'emploi.
 * L'identifiant du recruteur est automatiquement extrait du token JWT authentifié.
 * @param req - Requête étendue contenant les données de l'offre et l'utilisateur authentifié.
 * @param res - Réponse HTTP (201 en cas de succès).
 */
const createOffer = async (req, res) => {
    try {
        const recruiterId = req.user?.userId;
        const { companyId, ...offerData } = req.body;
        if (!recruiterId) {
            return res.status(401)
                .json({ error: "Utilisateur non identifié." });
        }
        // Log pour debug
        console.log('📝 Données reçues pour création offre:', {
            contract: offerData.contract,
            contractType: typeof offerData.contract,
            disabilityCompatible: offerData.disabilityCompatible,
            disabilityType: typeof offerData.disabilityCompatible
        });
        const newOffer = await offerService.createNewOffer({
            ...offerData,
            companyId: Number(companyId),
            recruiterId: recruiterId
        });
        res.status(201)
            .json({
            message: "Offre publiée avec succès !",
            offer: newOffer
        });
    }
    catch (error) {
        console.error("Erreur création offre:", error);
        res.status(500)
            .json({
            error: "Erreur lors de la création de l'offre.",
            message: error.message
        });
    }
};
exports.createOffer = createOffer;
/**
 * Contrôleur pour la récupération et le filtrage des offres d'emploi (Job Board).
 * Extrait les paramètres de recherche depuis la query string de l'URL.
 * @param req - Requête HTTP contenant les query parameters (ex: ?contract=CDI).
 * @param res - Réponse HTTP contenant la liste des offres (200 OK).
 */
const getOffers = async (req, res) => {
    try {
        // Extraction et typage des filtres depuis l'URL
        const { contract, location, remote, disability, dateMin, title, experience } = req.query;
        // Gérer les paramètres multiples (tableaux)
        const contractArray = contract ? (Array.isArray(contract) ? contract : [contract]) : undefined;
        const remoteArray = remote ? (Array.isArray(remote) ? remote : [remote]) : undefined;
        const disabilityArray = disability ? (Array.isArray(disability) ? disability : [disability]) : undefined;
        const experienceArray = experience ? (Array.isArray(experience) ? experience : [experience]) : undefined;
        const filters = {
            contract: contractArray,
            location: location,
            remote: remoteArray,
            disability: disabilityArray,
            dateMin: dateMin,
            title: title,
            experience: experienceArray
        };
        const offers = await offerService.getAllOffers(filters);
        res.status(200)
            .json(offers);
    }
    catch (error) {
        console.error("Erreur récupération offres:", error);
        res.status(500)
            .json({
            error: "Erreur lors de la récupération des offres.",
            message: error.message
        });
    }
};
exports.getOffers = getOffers;
/**
 * Contrôleur pour récupérer toutes les offres du recruteur connecté (ACTIVE et PAUSED).
 * @param req - Requête authentifiée contenant l'utilisateur.
 * @param res - Réponse HTTP contenant la liste des offres du recruteur.
 */
const getRecruiterOffers = async (req, res) => {
    try {
        const recruiterId = req.user?.userId;
        if (!recruiterId) {
            return res.status(401).json({ error: "Utilisateur non identifié." });
        }
        const offers = await offerService.getRecruiterOffers(recruiterId);
        res.status(200).json(offers);
    }
    catch (error) {
        console.error("Erreur récupération offres recruteur:", error);
        res.status(500).json({
            error: "Erreur lors de la récupération de vos offres.",
            message: error.message
        });
    }
};
exports.getRecruiterOffers = getRecruiterOffers;
/**
 * Contrôleur pour récupérer une offre spécifique par son ID.
 * Les offres suspendues (PAUSED) ne sont accessibles que par le recruteur propriétaire.
 * @param req - Requête HTTP contenant l'ID de l'offre dans les paramètres. Peut contenir req.user si authentifié.
 * @param res - Réponse HTTP contenant les détails de l'offre (200 OK) ou une erreur 404.
 */
const getOfferById = async (req, res) => {
    try {
        const { id } = req.params;
        const offerId = parseInt(id, 10);
        if (isNaN(offerId)) {
            return res.status(400)
                .json({ error: "ID d'offre invalide." });
        }
        const offer = await offerService.getOfferById(offerId);
        if (!offer) {
            return res.status(404)
                .json({
                error: "Offre introuvable",
                message: "L'offre demandée n'existe pas."
            });
        }
        // Vérifier si l'offre est suspendue
        if (offer.status === 'PAUSED') {
            // Si l'utilisateur est authentifié et est le recruteur propriétaire, autoriser l'accès
            const authReq = req;
            const userId = authReq.user?.userId;
            if (!userId || offer.recruiterId !== userId) {
                // L'offre est suspendue et l'utilisateur n'est pas le propriétaire
                // Retourner 404 pour ne pas révéler l'existence de l'offre
                return res.status(404)
                    .json({
                    error: "Offre introuvable",
                    message: "L'offre demandée n'existe pas."
                });
            }
        }
        res.status(200)
            .json(offer);
    }
    catch (error) {
        console.error("Erreur récupération offre:", error);
        res.status(500)
            .json({
            error: "Erreur lors de la récupération de l'offre.",
            message: error.message
        });
    }
};
exports.getOfferById = getOfferById;
/**
 * Contrôleur pour mettre à jour une offre d'emploi existante.
 * Vérifie que l'offre appartient au recruteur connecté.
 * @param req - Requête étendue contenant l'ID de l'offre et les données à mettre à jour.
 * @param res - Réponse HTTP contenant l'offre mise à jour (200 OK) ou une erreur.
 */
const updateOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const recruiterId = req.user?.userId;
        const updateData = req.body;
        if (!recruiterId) {
            return res.status(401).json({ error: "Utilisateur non identifié." });
        }
        const offerId = parseInt(id, 10);
        if (isNaN(offerId)) {
            return res.status(400).json({ error: "ID d'offre invalide." });
        }
        // Vérifier que l'offre appartient au recruteur
        const existingOffer = await offerService.getOfferById(offerId);
        if (!existingOffer) {
            return res.status(404).json({ error: "Offre introuvable." });
        }
        if (existingOffer.recruiterId !== recruiterId) {
            return res.status(403).json({ error: "Vous n'avez pas le droit de modifier cette offre." });
        }
        const updatedOffer = await offerService.updateOffer(offerId, updateData);
        res.status(200).json(updatedOffer);
    }
    catch (error) {
        console.error("Erreur modification offre:", error);
        res.status(500).json({
            error: "Erreur lors de la modification de l'offre.",
            message: error.message
        });
    }
};
exports.updateOffer = updateOffer;
/**
 * Contrôleur pour supprimer une offre d'emploi.
 * Vérifie que l'offre appartient au recruteur connecté.
 * Les candidatures associées seront supprimées automatiquement via cascade Prisma.
 * @param req - Requête étendue contenant l'ID de l'offre à supprimer.
 * @param res - Réponse HTTP contenant un message de succès (200 OK) ou une erreur.
 */
const deleteOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const recruiterId = req.user?.userId;
        if (!recruiterId) {
            return res.status(401).json({ error: "Utilisateur non identifié." });
        }
        const offerId = parseInt(id, 10);
        if (isNaN(offerId)) {
            return res.status(400).json({ error: "ID d'offre invalide." });
        }
        // Vérifier que l'offre appartient au recruteur
        const existingOffer = await offerService.getOfferById(offerId);
        if (!existingOffer) {
            return res.status(404).json({ error: "Offre introuvable." });
        }
        if (existingOffer.recruiterId !== recruiterId) {
            return res.status(403).json({ error: "Vous n'avez pas le droit de supprimer cette offre." });
        }
        await offerService.deleteOffer(offerId);
        res.status(200).json({ message: "Offre supprimée avec succès" });
    }
    catch (error) {
        console.error("Erreur suppression offre:", error);
        res.status(500).json({
            error: "Erreur lors de la suppression de l'offre.",
            message: error.message
        });
    }
};
exports.deleteOffer = deleteOffer;
