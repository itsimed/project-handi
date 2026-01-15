"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicationById = exports.getMyApplications = exports.updateApplicationStatus = exports.getRecruiterApplications = exports.createApplication = exports.getApplicationsByOffer = void 0;
const applicationService = __importStar(require("../services/applicationService"));
const prisma_1 = __importDefault(require("../config/prisma"));
/**
 * Récupère toutes les candidatures pour une offre spécifique
 * GET /api/v1/applications/offer/:offerId
 */
const getApplicationsByOffer = async (req, res) => {
    try {
        const recruiterId = req.user?.userId;
        const { offerId } = req.params;
        if (!recruiterId) {
            return res.status(401).json({ error: "Non identifié" });
        }
        // Vérifier que l'offre appartient bien au recruteur
        const offer = await prisma_1.default.offer.findUnique({
            where: { id: Number(offerId) }
        });
        if (!offer || offer.recruiterId !== recruiterId) {
            return res.status(403).json({ error: "Vous n'avez pas accès à cette offre" });
        }
        // Récupérer toutes les candidatures pour cette offre
        const applications = await prisma_1.default.application.findMany({
            where: {
                offerId: Number(offerId)
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                offer: {
                    select: {
                        title: true,
                        location: true,
                        contract: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json(applications);
    }
    catch (error) {
        console.error("Error in getApplicationsByOffer:", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des candidatures",
            message: error.message
        });
    }
};
exports.getApplicationsByOffer = getApplicationsByOffer;
/**
 * Gère la création d'une nouvelle candidature.
 * Extrait l'ID de l'utilisateur depuis le token JWT.
 */
const createApplication = async (req, res) => {
    try {
        const currentUserId = req.user?.userId;
        const { offerId } = req.body;
        if (!currentUserId) {
            return res.status(401).json({ error: "Utilisateur non identifié." });
        }
        const newApplication = await applicationService.applyToOffer(currentUserId, Number(offerId));
        res.status(201).json({
            message: "Candidature envoyée avec succès !",
            application: newApplication
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.createApplication = createApplication;
/**
 * Récupère toutes les candidatures destinées aux offres du recruteur connecté.
 */
const getRecruiterApplications = async (req, res) => {
    try {
        const recruiterId = req.user?.userId;
        if (!recruiterId) {
            return res.status(401).json({ error: "Non identifié" });
        }
        const applications = await applicationService.getApplicationsForRecruiter(recruiterId);
        res.json(applications);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getRecruiterApplications = getRecruiterApplications;
/**
 * Permet au recruteur de modifier le statut d'une candidature (Accepter/Refuser).
 */
const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await applicationService.updateApplicationStatus(Number(id), status);
        res.json({
            message: "Statut mis à jour",
            application: updated
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
/**
 * RÉCUPÉRER MES CANDIDATURES (Candidat)
 * GET /api/v1/applications/me
 */
const getMyApplications = async (req, res) => {
    try {
        // req.user.userId est injecté par le middleware authenticateToken
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "Utilisateur non identifié." });
        }
        const applications = await prisma_1.default.application.findMany({
            where: {
                userId: userId
            },
            include: {
                // On récupère les infos de l'offre liée
                offer: {
                    select: {
                        title: true,
                        location: true,
                        contract: true,
                    }
                },
                // On récupère les infos de l'entreprise liée
                company: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc' // Les plus récentes en haut de la liste
            }
        });
        // Si tout est ok, on renvoie le tableau (vide ou rempli)
        res.status(200).json(applications);
    }
    catch (error) {
        console.error("Error in getMyApplications:", error);
        res.status(500).json({
            message: "Erreur lors de la récupération de vos candidatures"
        });
    }
};
exports.getMyApplications = getMyApplications;
/**
 * RÉCUPÉRER UNE CANDIDATURE SPÉCIFIQUE (Candidat ou Recruteur)
 * GET /api/v1/applications/:id
 */
const getApplicationById = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ error: "Utilisateur non identifié." });
        }
        // Récupérer la candidature avec toutes les informations
        const application = await prisma_1.default.application.findUnique({
            where: { id: Number(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                offer: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        location: true,
                        contract: true,
                        experience: true,
                        remote: true,
                        recruiterId: true,
                        company: {
                            select: {
                                id: true,
                                name: true,
                                sector: true
                            }
                        }
                    }
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                        sector: true
                    }
                }
            }
        });
        if (!application) {
            return res.status(404).json({
                error: "Candidature introuvable"
            });
        }
        // Vérifier les droits d'accès
        // Un candidat ne peut voir que ses propres candidatures
        if (userRole === 'APPLICANT' && application.userId !== userId) {
            return res.status(403).json({
                error: "Accès refusé",
                message: "Vous ne pouvez consulter que vos propres candidatures."
            });
        }
        // Un recruteur ne peut voir que les candidatures de ses offres
        if (userRole === 'RECRUITER' && application.offer?.recruiterId !== userId) {
            return res.status(403).json({
                error: "Accès refusé",
                message: "Cette candidature ne concerne pas vos offres."
            });
        }
        res.status(200).json(application);
    }
    catch (error) {
        console.error("Error in getApplicationById:", error);
        res.status(500).json({
            error: "Erreur lors de la récupération de la candidature",
            message: error.message
        });
    }
};
exports.getApplicationById = getApplicationById;
