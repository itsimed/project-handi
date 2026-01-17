"use strict";
// project-handi/backend/src/services/offerService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOffers = getAllOffers;
exports.createNewOffer = createNewOffer;
exports.getOfferById = getOfferById;
exports.updateOffer = updateOffer;
exports.deleteOffer = deleteOffer;
exports.getRecruiterOffers = getRecruiterOffers;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../config/prisma"));
/**
 * Récupère la liste des offres d'emploi en appliquant des filtres optionnels.
 * @param filters - Objet contenant les critères de recherche (contrat, ville, etc.)
 * @param includePaused - Si true, inclut les offres suspendues (par défaut: false, exclut les offres PAUSED)
 * @returns Une promesse contenant le tableau des offres avec les relations entreprise et recruteur.
 */
async function getAllOffers(filters, includePaused = false) {
    const offers = await prisma_1.default.offer.findMany({
        where: {
            // Note: Les filtres sur contract et disabilityCompatible (JSON) ne sont pas supportés directement par Prisma
            // Le filtrage sera fait côté application après récupération
            // Filtre title : recherche partielle (MySQL est case-insensitive par défaut)
            title: filters?.title
                ? { contains: filters.title }
                : undefined,
            // Filtre location : recherche partielle
            location: filters?.location
                ? { contains: filters.location }
                : undefined,
            // Filtre remote : accepte une valeur unique ou un tableau
            remote: filters?.remote
                ? Array.isArray(filters.remote)
                    ? { in: filters.remote }
                    : filters.remote
                : undefined,
            // Filtre experience : accepte une valeur unique ou un tableau
            experience: filters?.experience
                ? Array.isArray(filters.experience)
                    ? { in: filters.experience }
                    : filters.experience
                : undefined,
            // Note: Filtre disability non supporté avec JSON - filtrage côté application
            // Filtre date minimum
            createdAt: filters?.dateMin
                ? { gte: new Date(filters.dateMin) }
                : undefined,
            // Filtre status : exclure les offres suspendues sauf si includePaused est true
            status: includePaused ? undefined : client_1.OfferStatus.ACTIVE,
        },
        include: {
            company: {
                select: {
                    id: true,
                    name: true,
                    sector: true
                }
            },
            recruiter: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true
                }
            },
            // Ajouter le comptage des candidatures
            _count: {
                select: {
                    applications: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    // Filtrage côté application pour les champs JSON
    let filteredOffers = offers;
    if (filters?.contract) {
        const contractsToMatch = Array.isArray(filters.contract) ? filters.contract : [filters.contract];
        filteredOffers = filteredOffers.filter(offer => {
            const offerContracts = Array.isArray(offer.contract) ? offer.contract : [];
            return contractsToMatch.some(ct => offerContracts.includes(ct));
        });
    }
    if (filters?.disability) {
        const disabilitiesToMatch = Array.isArray(filters.disability) ? filters.disability : [filters.disability];
        filteredOffers = filteredOffers.filter(offer => {
            const offerDisabilities = Array.isArray(offer.disabilityCompatible) ? offer.disabilityCompatible : [];
            return disabilitiesToMatch.some(dis => offerDisabilities.includes(dis));
        });
    }
    return filteredOffers;
}
/**
 * Enregistre une nouvelle offre d'emploi dans la base de données.
 * @param offerData - Les données de l'offre (titre, description, IDs, etc.)
 */
async function createNewOffer(offerData) {
    return prisma_1.default.offer.create({
        data: {
            title: offerData.title,
            description: offerData.description,
            location: offerData.location,
            contract: offerData.contract,
            experience: offerData.experience,
            remote: offerData.remote,
            disabilityCompatible: offerData.disabilityCompatible,
            companyId: offerData.companyId,
            recruiterId: offerData.recruiterId,
            status: offerData.status || client_1.OfferStatus.ACTIVE, // Par défaut ACTIVE si non spécifié
        },
    });
}
/**
 * Récupère les détails complets d'une offre spécifique par son identifiant unique.
 * @param id - L'identifiant (ID) de l'offre.
 */
async function getOfferById(id) {
    return prisma_1.default.offer.findUnique({
        where: { id },
        include: {
            company: true,
            recruiter: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true
                }
            }
        }
    });
}
/**
 * Modifie les informations d'une offre existante.
 * @param id - L'identifiant de l'offre à modifier.
 * @param updateData - Un objet contenant les champs à mettre à jour.
 */
async function updateOffer(id, updateData) {
    return prisma_1.default.offer.update({
        where: { id },
        data: updateData,
    });
}
/**
 * Supprime définitivement une offre de la base de données.
 * @param id - L'identifiant de l'offre à supprimer.
 */
async function deleteOffer(id) {
    return prisma_1.default.offer.delete({
        where: { id },
    });
}
/**
 * Récupère toutes les offres d'un recruteur spécifique (ACTIVE et PAUSED).
 * @param recruiterId - L'identifiant du recruteur.
 * @returns Une promesse contenant le tableau des offres du recruteur.
 */
async function getRecruiterOffers(recruiterId) {
    return prisma_1.default.offer.findMany({
        where: {
            recruiterId: recruiterId,
            // Pas de filtre sur status : inclut ACTIVE et PAUSED
        },
        include: {
            company: {
                select: {
                    id: true,
                    name: true,
                    sector: true
                }
            },
            recruiter: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true
                }
            },
            _count: {
                select: {
                    applications: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}
