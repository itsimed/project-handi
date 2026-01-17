"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecruiterStats = exports.getAllStats = exports.getTotalApplicants = exports.getTotalApplications = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
/**
 * GET /api/v1/stats/applications
 * Récupère le nombre total de candidatures
 */
const getTotalApplications = async (req, res) => {
    try {
        const totalApplications = await prisma_1.default.application.count();
        res.status(200).json({
            totalApplications
        });
    }
    catch (error) {
        console.error("Error in getTotalApplications:", error);
        res.status(500).json({
            error: "Erreur lors de la récupération du nombre de candidatures",
            message: error.message
        });
    }
};
exports.getTotalApplications = getTotalApplications;
/**
 * GET /api/v1/stats/applicants
 * Récupère le nombre total de candidats inscrits (utilisateurs avec rôle APPLICANT)
 */
const getTotalApplicants = async (req, res) => {
    try {
        const totalApplicants = await prisma_1.default.user.count({
            where: {
                role: 'APPLICANT'
            }
        });
        res.status(200).json({
            totalApplicants
        });
    }
    catch (error) {
        console.error("Error in getTotalApplicants:", error);
        res.status(500).json({
            error: "Erreur lors de la récupération du nombre de candidats",
            message: error.message
        });
    }
};
exports.getTotalApplicants = getTotalApplicants;
/**
 * GET /api/v1/stats
 * Récupère toutes les statistiques en une seule requête
 */
const getAllStats = async (req, res) => {
    try {
        const [totalApplications, totalApplicants, totalOffers, totalCompanies] = await Promise.all([
            prisma_1.default.application.count(),
            prisma_1.default.user.count({ where: { role: 'APPLICANT' } }),
            prisma_1.default.offer.count(),
            prisma_1.default.company.count()
        ]);
        res.status(200).json({
            totalApplications,
            totalApplicants,
            totalOffers,
            totalCompanies
        });
    }
    catch (error) {
        console.error("Error in getAllStats:", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des statistiques",
            message: error.message
        });
    }
};
exports.getAllStats = getAllStats;
/**
 * GET /api/v1/stats/recruiter
 * Récupère les statistiques du recruteur connecté (ses offres et candidatures reçues)
 * @access  Privé (Rôle: RECRUITER, ADMIN)
 */
const getRecruiterStats = async (req, res) => {
    try {
        const recruiterId = req.user?.userId;
        if (!recruiterId) {
            return res.status(401).json({ error: "Utilisateur non identifié." });
        }
        // Compter les offres du recruteur
        const totalOffers = await prisma_1.default.offer.count({
            where: { recruiterId }
        });
        // Compter les candidatures reçues pour les offres du recruteur
        const totalApplications = await prisma_1.default.application.count({
            where: {
                offer: {
                    recruiterId
                }
            }
        });
        // Compter les candidatures non consultées
        const pendingApplications = await prisma_1.default.application.count({
            where: {
                offer: {
                    recruiterId
                },
                status: 'NOT_VIEWED'
            }
        });
        // Compter les candidatures consultées
        const viewedApplications = await prisma_1.default.application.count({
            where: {
                offer: {
                    recruiterId
                },
                status: 'VIEWED'
            }
        });
        res.status(200).json({
            totalOffers,
            totalApplications,
            pendingApplications,
            viewedApplications
        });
    }
    catch (error) {
        console.error("Error in getRecruiterStats:", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des statistiques recruteur",
            message: error.message
        });
    }
};
exports.getRecruiterStats = getRecruiterStats;
