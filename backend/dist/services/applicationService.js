"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyToOffer = applyToOffer;
exports.getApplicationsByUserId = getApplicationsByUserId;
exports.getApplicationsForRecruiter = getApplicationsForRecruiter;
exports.getApplicationById = getApplicationById;
exports.getApplicationsByOfferId = getApplicationsByOfferId;
exports.updateApplicationStatus = updateApplicationStatus;
// project-handi/backend/src/services/applicationService.ts
const prisma_1 = __importDefault(require("../config/prisma"));
/**
 * Enregistre une candidature après avoir vérifié que le candidat n'a pas déjà postulé.
 * @param userId - ID du candidat.
 * @param offerId - ID de l'offre d'emploi.
 * @throws Error si une candidature existe déjà pour ce couple utilisateur/offre.
 */
async function applyToOffer(userId, offerId) {
    // Vérifier que l'offre existe
    const offer = await prisma_1.default.offer.findUnique({ where: { id: offerId } });
    if (!offer) {
        throw new Error("Offre introuvable ou supprimée.");
    }
    // Empêcher un recruteur de postuler à sa propre offre
    if (offer.recruiterId === userId) {
        throw new Error("Vous ne pouvez pas postuler à votre propre offre.");
    }
    const existingApplication = await prisma_1.default.application.findFirst({
        where: {
            userId,
            offerId
        }
    });
    if (existingApplication) {
        throw new Error("Vous avez déjà postulé à cette offre.");
    }
    return prisma_1.default.application.create({
        data: {
            userId,
            offerId,
            companyId: offer.companyId, // Lier à l'entreprise de l'offre
            status: 'NOT_VIEWED',
            additionalDocs: [], // Passer un tableau vide explicitement
        },
        include: {
            offer: {
                select: {
                    title: true
                }
            }
        }
    });
}
/**
 * Récupère la liste des candidatures effectuées par un utilisateur spécifique.
 * @param userId - ID du candidat.
 */
async function getApplicationsByUserId(userId) {
    return prisma_1.default.application.findMany({
        where: {
            userId
        },
        include: {
            offer: {
                include: {
                    company: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}
/**
 * Récupère toutes les candidatures reçues pour les offres publiées par un recruteur.
 * @param recruiterId - ID du recruteur propriétaire des offres.
 */
async function getApplicationsForRecruiter(recruiterId) {
    return prisma_1.default.application.findMany({
        where: {
            offer: {
                recruiterId: recruiterId
            }
        },
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true
                }
            },
            offer: {
                select: {
                    title: true,
                    location: true
                }
            },
            documents: true // Inclure les documents (CV et lettre de motivation)
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}
/**
 * Récupère les détails complets d'une candidature spécifique par son ID.
 * @param applicationId - ID unique de la candidature.
 * @param userId - ID de l'utilisateur (pour vérifier qu'il est bien le propriétaire).
 */
async function getApplicationById(applicationId, userId) {
    return prisma_1.default.application.findFirst({
        where: {
            id: applicationId,
            userId: userId // Sécurité : on vérifie que l'application appartient bien à l'utilisateur
        },
        include: {
            offer: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    location: true,
                    contract: true,
                    experience: true,
                    remote: true,
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
}
/**
 * Récupère toutes les candidatures pour une offre spécifique.
 * @param offerId - ID de l'offre.
 */
async function getApplicationsByOfferId(offerId) {
    return prisma_1.default.application.findMany({
        where: {
            offerId: offerId
        },
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true
                }
            },
            offer: {
                select: {
                    title: true,
                    location: true
                }
            },
            documents: {
                select: {
                    id: true,
                    documentType: true,
                    fileName: true,
                    mimeType: true
                },
                orderBy: {
                    uploadedAt: 'desc'
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}
/**
 * Met à jour le statut d'une candidature existante.
 * @param applicationId - ID unique de la candidature.
 * @param status - Nouveau statut (VIEWED ou NOT_VIEWED).
 */
async function updateApplicationStatus(applicationId, status) {
    return prisma_1.default.application.update({
        where: {
            id: applicationId
        },
        data: {
            status
        }
    });
}
