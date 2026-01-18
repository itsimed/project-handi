// project-handi/backend/src/services/offerService.ts

import { ContractType, RemotePolicy, DisabilityCategory, ExperienceLevel, OfferStatus } from '@prisma/client';
import prisma from '../config/prisma';

/**
 * Interface définissant les critères de filtrage pour la recherche d'offres.
 */
export interface OfferFilters
{
  contract?: ContractType | ContractType[];
  location?: string;
  remote?: RemotePolicy | RemotePolicy[];
  disability?: DisabilityCategory | DisabilityCategory[];
  dateMin?: string;
  title?: string;
  experience?: ExperienceLevel | ExperienceLevel[];
}

/**
 * Récupère la liste des offres d'emploi en appliquant des filtres optionnels.
 * @param filters - Objet contenant les critères de recherche (contrat, ville, etc.)
 * @param includePaused - Si true, inclut les offres suspendues (par défaut: false, exclut les offres PAUSED)
 * @returns Une promesse contenant le tableau des offres avec les relations entreprise et recruteur.
 */
export async function getAllOffers(filters?: OfferFilters, includePaused: boolean = false)
{
  const offers = await prisma.offer.findMany
  (
    {
      where :
      {
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
        status: includePaused ? undefined : OfferStatus.ACTIVE,
      },

      include :
      {
        company:
        {
          select:
          {
            id: true,
            name: true,
            sector: true
          }
        },

        recruiter:
        {
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
      orderBy:
      {
        createdAt: 'desc'
      }
    }
  );

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
export async function createNewOffer(offerData: any)
{
  // Conversion en tableaux si nécessaire
  let contractArray = offerData.contract;
  if (typeof contractArray === 'string') {
    try {
      contractArray = JSON.parse(contractArray);
    } catch {
      contractArray = [contractArray];
    }
  }
  if (!Array.isArray(contractArray)) {
    contractArray = [contractArray];
  }

  let disabilityArray = offerData.disabilityCompatible;
  if (typeof disabilityArray === 'string') {
    try {
      disabilityArray = JSON.parse(disabilityArray);
    } catch {
      disabilityArray = [disabilityArray];
    }
  }
  if (!Array.isArray(disabilityArray)) {
    disabilityArray = [disabilityArray];
  }

  // Avec PostgreSQL arrays natifs, on passe directement les tableaux
  return prisma.offer.create
  (
    {
      data :
      {
        title: offerData.title,
        description: offerData.description,
        location: offerData.location,
        contract: contractArray as any,
        experience: offerData.experience,
        remote: offerData.remote,
        disabilityCompatible: disabilityArray as any,
        companyId: offerData.companyId,
        recruiterId: offerData.recruiterId,
        status: offerData.status || OfferStatus.ACTIVE,
      },
    }
  );
}

/**
 * Récupère les détails complets d'une offre spécifique par son identifiant unique.
 * @param id - L'identifiant (ID) de l'offre.
 */
export async function getOfferById(id: number)
{
  return prisma.offer.findUnique
  (
    {
      where: { id },
      include :
      {
        company: true,
        recruiter :
        {
          select :
          {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    }
  );
}

/**
 * Modifie les informations d'une offre existante.
 * @param id - L'identifiant de l'offre à modifier.
 * @param updateData - Un objet contenant les champs à mettre à jour.
 */
export async function updateOffer(id: number, updateData: any)
{
  // Conversion et validation des champs array si présents
  const processedData = { ...updateData };

  if (updateData.contract) {
    let contractArray = updateData.contract;
    if (typeof contractArray === 'string') {
      try {
        contractArray = JSON.parse(contractArray);
      } catch {
        contractArray = [contractArray];
      }
    }
    if (!Array.isArray(contractArray)) {
      contractArray = [contractArray];
    }
    processedData.contract = contractArray as any;
  }

  if (updateData.disabilityCompatible) {
    let disabilityArray = updateData.disabilityCompatible;
    if (typeof disabilityArray === 'string') {
      try {
        disabilityArray = JSON.parse(disabilityArray);
      } catch {
        disabilityArray = [disabilityArray];
      }
    }
    if (!Array.isArray(disabilityArray)) {
      disabilityArray = [disabilityArray];
    }
    processedData.disabilityCompatible = disabilityArray as any;
  }

  return prisma.offer.update
  (
    {
      where: { id },
      data: processedData,
    }
  );
}

/**
 * Supprime définitivement une offre de la base de données.
 * @param id - L'identifiant de l'offre à supprimer.
 */
export async function deleteOffer(id: number)
{
  return prisma.offer.delete
  (
    {
      where: { id },
    }
  );
}

/**
 * Récupère toutes les offres d'un recruteur spécifique (ACTIVE et PAUSED).
 * @param recruiterId - L'identifiant du recruteur.
 * @returns Une promesse contenant le tableau des offres du recruteur.
 */
export async function getRecruiterOffers(recruiterId: number)
{
  return prisma.offer.findMany
  (
    {
      where: {
        recruiterId: recruiterId,
        // Pas de filtre sur status : inclut ACTIVE et PAUSED
      },
      include:
      {
        company:
        {
          select:
          {
            id: true,
            name: true,
            sector: true
          }
        },
        recruiter:
        {
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
      orderBy:
      {
        createdAt: 'desc'
      }
    }
  );
}