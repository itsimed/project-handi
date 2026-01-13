// project-handi/backend/src/services/applicationService.ts
import prisma from '../config/prisma';

/**
 * Enregistre une candidature après avoir vérifié que le candidat n'a pas déjà postulé.
 * @param userId - ID du candidat.
 * @param offerId - ID de l'offre d'emploi.
 * @throws Error si une candidature existe déjà pour ce couple utilisateur/offre.
 */
export async function applyToOffer( userId: number, offerId: number ) 
{
    // Vérifier que l'offre existe
    const offer = await prisma.offer.findUnique({ where: { id: offerId } });

    if (!offer)
    {
        throw new Error("Offre introuvable ou supprimée.");
    }

    // Empêcher un recruteur de postuler à sa propre offre
    if (offer.recruiterId === userId)
    {
        throw new Error("Vous ne pouvez pas postuler à votre propre offre.");
    }

    const existingApplication = await prisma.application.findFirst
    (
        {
            where :
            { 
                userId, 
                offerId 
            }
        }
    );

    if (existingApplication) 
    {
        throw new Error
        (
            "Vous avez déjà postulé à cette offre."
        );
    }

    return prisma.application.create
    (
        {
            data :
            {
                userId,
                offerId,
                status: 'PENDING' 
            },

            include :
            {
                offer :
                {
                    select :
                    { 
                        title: true 
                    }
                }
            }
        }
    );
}

/**
 * Récupère la liste des candidatures effectuées par un utilisateur spécifique.
 * @param userId - ID du candidat.
 */
export async function getApplicationsByUserId( userId: number )
{
    return prisma.application.findMany
    (
        {
            where :
            { 
                userId 
            },

            include : 
            {
                offer : 
                {
                    include :
                    { 
                        company :
                        {
                            select :
                            { 
                                name : true
                            }
                        }
                    }
                }
            },

            orderBy: 
            {
                createdAt: 'desc'
            }
        }
    );
}

/**
 * Récupère toutes les candidatures reçues pour les offres publiées par un recruteur.
 * @param recruiterId - ID du recruteur propriétaire des offres.
 */
export async function getApplicationsForRecruiter( recruiterId: number )
{
    return prisma.application.findMany
    (
        {
            where :
            {
                offer :
                {
                    recruiterId : recruiterId
                }
            },

            include :
            {
                user : 
                {
                    select : 
                    {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },

                offer : 
                {
                    select: 
                    {
                        title: true,
                        location: true
                    }
                }
            },

            orderBy : 
            {
                createdAt: 'desc'
            }
        }
    );
}

/**
 * Récupère les détails complets d'une candidature spécifique par son ID.
 * @param applicationId - ID unique de la candidature.
 * @param userId - ID de l'utilisateur (pour vérifier qu'il est bien le propriétaire).
 */
export async function getApplicationById( applicationId: number, userId: number )
{
    return prisma.application.findFirst
    (
        {
            where :
            { 
                id: applicationId,
                userId: userId  // Sécurité : on vérifie que l'application appartient bien à l'utilisateur
            },

            include :
            {
                offer :
                {
                    select :
                    {
                        id: true,
                        title: true,
                        description: true,
                        location: true,
                        contract: true,
                        experience: true,
                        remote: true,
                        company :
                        {
                            select :
                            {
                                id: true,
                                name: true,
                                sector: true
                            }
                        }
                    }
                },
                company :
                {
                    select :
                    {
                        id: true,
                        name: true,
                        sector: true
                    }
                }
            }
        }
    );
}

/**
 * Met à jour le statut d'une candidature existante.
 * @param applicationId - ID unique de la candidature.
 * @param status - Nouveau statut (ACCEPTED ou REJECTED).
 */
export async function updateApplicationStatus( applicationId: number, status: 'ACCEPTED' | 'REJECTED' )
{
    return prisma.application.update
    (
        {
            where :
            { 
                id : applicationId 
            },

            data : 
            { 
                status 
            }
        }
    );
}