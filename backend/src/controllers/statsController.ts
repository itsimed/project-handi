// project-handi/backend/src/controllers/statsController.ts
import { Request, Response } from 'express';
import prisma from '../config/prisma';

/**
 * GET /api/v1/stats/applications
 * Récupère le nombre total de candidatures
 */
export const getTotalApplications = async (req: Request, res: Response) => {
    try {
        const totalApplications = await prisma.application.count();

        res.status(200).json({ 
            totalApplications 
        });
    } catch (error: any) {
        console.error("Error in getTotalApplications:", error);
        res.status(500).json({ 
            error: "Erreur lors de la récupération du nombre de candidatures",
            message: error.message
        });
    }
};

/**
 * GET /api/v1/stats/applicants
 * Récupère le nombre total de candidats inscrits (utilisateurs avec rôle APPLICANT)
 */
export const getTotalApplicants = async (req: Request, res: Response) => {
    try {
        const totalApplicants = await prisma.user.count({
            where: {
                role: 'APPLICANT'
            }
        });

        res.status(200).json({ 
            totalApplicants 
        });
    } catch (error: any) {
        console.error("Error in getTotalApplicants:", error);
        res.status(500).json({ 
            error: "Erreur lors de la récupération du nombre de candidats",
            message: error.message
        });
    }
};

/**
 * GET /api/v1/stats
 * Récupère toutes les statistiques en une seule requête
 */
export const getAllStats = async (req: Request, res: Response) => {
    try {
        const [totalApplications, totalApplicants, totalOffers, totalCompanies] = await Promise.all([
            prisma.application.count(),
            prisma.user.count({ where: { role: 'APPLICANT' } }),
            prisma.offer.count(),
            prisma.company.count()
        ]);

        res.status(200).json({ 
            totalApplications,
            totalApplicants,
            totalOffers,
            totalCompanies
        });
    } catch (error: any) {
        console.error("Error in getAllStats:", error);
        res.status(500).json({ 
            error: "Erreur lors de la récupération des statistiques",
            message: error.message
        });
    }
};
