// project-handi/backend/src/controllers/applicationController.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';
import * as applicationService from '../services/applicationService';
import prisma from '../config/prisma';

/**
 * Gère la création d'une nouvelle candidature.
 * Extrait l'ID de l'utilisateur depuis le token JWT.
 */
export const createApplication = async (req: AuthRequest, res: Response) =>
{
    try
    {
        const currentUserId = req.user?.userId;
        const { offerId } = req.body;

        if (!currentUserId)
        {
            return res.status(401).json({ error: "Utilisateur non identifié." });
        }

        const newApplication = await applicationService.applyToOffer
        (
            currentUserId, 
            Number(offerId)
        );

        res.status(201).json
        (
            {
                message: "Candidature envoyée avec succès !",
                application: newApplication
            }
        );
    }
    catch (error: any)
    {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Récupère toutes les candidatures destinées aux offres du recruteur connecté.
 */
export const getRecruiterApplications = async (req: AuthRequest, res: Response) =>
{
    try
    {
        const recruiterId = req.user?.userId;

        if (!recruiterId)
        {
            return res.status(401).json({ error: "Non identifié" });
        }

        const applications = await applicationService.getApplicationsForRecruiter(recruiterId);
        
        res.json(applications);
    }
    catch (error: any)
    {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Permet au recruteur de modifier le statut d'une candidature (Accepter/Refuser).
 */
export const updateApplicationStatus = async (req: AuthRequest, res: Response) =>
{
    try
    {
        const { id } = req.params;
        const { status } = req.body; 

        const updated = await applicationService.updateApplicationStatus
        (
            Number(id), 
            status
        );
    
        res.json
        (
            {
                message: "Statut mis à jour",
                application: updated
            }
        );
    }
    catch (error: any)
    {
        res.status(400).json({ error: error.message });
    }
};

/**
 * RÉCUPÉRER MES CANDIDATURES (Candidat)
 * GET /api/v1/applications/me
 */
export const getMyApplications = async (req: AuthRequest, res: Response) => {
    try {
        // req.user.userId est injecté par le middleware authenticateToken
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "Utilisateur non identifié." });
        }

        const applications = await prisma.application.findMany({
            where :
            { 
                userId: userId 
            },
            include :
            {
                // On récupère les infos de l'offre liée
                offer :
                {
                    select :
                    {
                        title : true,
                        location : true,
                        contract : true,
                    }
                },
                // On récupère les infos de l'entreprise liée
                company :
                {
                    select :
                    {
                        name: true,
                    }
                }
            },
            orderBy :
            {
                createdAt: 'desc' // Les plus récentes en haut de la liste
            }
        });

        // Si tout est ok, on renvoie le tableau (vide ou rempli)
        res.status(200).json(applications);
        
    } catch (error) {
        console.error("Error in getMyApplications:", error);
        res.status(500).json({ 
            message: "Erreur lors de la récupération de vos candidatures" 
        });
    }
};

/**
 * RÉCUPÉRER UNE CANDIDATURE SPÉCIFIQUE (Candidat)
 * GET /api/v1/applications/:id
 */
export const getApplicationById = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ error: "Utilisateur non identifié." });
        }

        const application = await applicationService.getApplicationById(
            Number(id),
            userId
        );

        if (!application) {
            return res.status(404).json({ 
                error: "Candidature introuvable",
                message: "Cette candidature n'existe pas ou ne vous appartient pas."
            });
        }

        res.status(200).json(application);
        
    } catch (error: any) {
        console.error("Error in getApplicationById:", error);
        res.status(500).json({ 
            error: "Erreur lors de la récupération de la candidature",
            message: error.message
        });
    }
};