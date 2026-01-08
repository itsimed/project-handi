// project-handi/backend/src/controllers/offerController.ts

import { Response, Request } from 'express';
import { ContractType, RemotePolicy, DisabilityCategory, ExperienceLevel } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';
import * as offerService from '../services/offerService';

/**
 * Contrôleur pour la création d'une nouvelle offre d'emploi.
 * L'identifiant du recruteur est automatiquement extrait du token JWT authentifié.
 * @param req - Requête étendue contenant les données de l'offre et l'utilisateur authentifié.
 * @param res - Réponse HTTP (201 en cas de succès).
 */
export const createOffer = async( req: AuthRequest, res: Response ) => 
{
    try 
    {
        const recruiterId = req.user?.userId;
        const { companyId, ...offerData } = req.body;

        if (!recruiterId) 
        {
            return res.status
            (
                401
            )
            .json
            (
                { error: "Utilisateur non identifié." }
            );
        }

        const newOffer = await offerService.createNewOffer
        (
            {
                ...offerData,
                companyId: Number
                (
                    companyId
                ),
                recruiterId: recruiterId
            }
        );

        res.status
        (
            201
        )
        .json
        (
            {
                message: "Offre publiée avec succès !",
                offer: newOffer
            }
        );
    } 
    catch (error: any) 
    {
        console.error
        (
            "Erreur création offre:", 
            error
        );

        res.status
        (
            500
        )
        .json
        (
            {
                error: "Erreur lors de la création de l'offre.",
                message: error.message
            }
        );
    }
};

/**
 * Contrôleur pour la récupération et le filtrage des offres d'emploi (Job Board).
 * Extrait les paramètres de recherche depuis la query string de l'URL.
 * @param req - Requête HTTP contenant les query parameters (ex: ?contract=CDI).
 * @param res - Réponse HTTP contenant la liste des offres (200 OK).
 */
export const getOffers = async( req: Request, res: Response ) => 
{
    try 
    {
        // Extraction et typage des filtres depuis l'URL
        const { contract, location, remote, disability, dateMin, title, experience } = req.query;

        // Gérer les paramètres multiples (tableaux)
        const contractArray = contract ? (Array.isArray(contract) ? contract : [contract]) : undefined;
        const remoteArray = remote ? (Array.isArray(remote) ? remote : [remote]) : undefined;
        const disabilityArray = disability ? (Array.isArray(disability) ? disability : [disability]) : undefined;
        const experienceArray = experience ? (Array.isArray(experience) ? experience : [experience]) : undefined;

        const filters: offerService.OfferFilters = 
        {
            contract: contractArray as ContractType[] | undefined,
            location: location as string,
            remote: remoteArray as RemotePolicy[] | undefined,
            disability: disabilityArray as DisabilityCategory[] | undefined,
            dateMin: dateMin as string,
            title: title as string,
            experience: experienceArray as ExperienceLevel[] | undefined
        };

        const offers = await offerService.getAllOffers
        (
            filters
        );

        res.status
        (
            200
        )
        .json
        (
            offers
        );
    } 
    catch (error: any) 
    {
        console.error
        (
            "Erreur récupération offres:", 
            error
        );

        res.status
        (
            500
        )
        .json
        (
            {
                error: "Erreur lors de la récupération des offres.",
                message: error.message
            }
        );
    }
};

/**
 * Contrôleur pour récupérer une offre spécifique par son ID.
 * @param req - Requête HTTP contenant l'ID de l'offre dans les paramètres.
 * @param res - Réponse HTTP contenant les détails de l'offre (200 OK) ou une erreur 404.
 */
export const getOfferById = async( req: Request, res: Response ) => 
{
    try 
    {
        const { id } = req.params;
        const offerId = parseInt(id, 10);

        if (isNaN(offerId)) 
        {
            return res.status
            (
                400
            )
            .json
            (
                { error: "ID d'offre invalide." }
            );
        }

        const offer = await offerService.getOfferById
        (
            offerId
        );

        if (!offer) 
        {
            return res.status
            (
                404
            )
            .json
            (
                { 
                    error: "Offre introuvable",
                    message: "L'offre demandée n'existe pas."
                }
            );
        }

        res.status
        (
            200
        )
        .json
        (
            offer
        );
    } 
    catch (error: any) 
    {
        console.error
        (
            "Erreur récupération offre:", 
            error
        );

        res.status
        (
            500
        )
        .json
        (
            {
                error: "Erreur lors de la récupération de l'offre.",
                message: error.message
            }
        );
    }
};