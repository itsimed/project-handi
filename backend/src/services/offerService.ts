// project-handi/backend/src/services/offerService.ts

import { ContractType, RemotePolicy, DisabilityCategory, ExperienceLevel } from '@prisma/client';
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
 * @returns Une promesse contenant le tableau des offres avec les relations entreprise et recruteur.
 */
export async function getAllOffers(filters?: OfferFilters)
{
  return prisma.offer.findMany
  (
    {
      where :
      {
        // Filtre contract : accepte une valeur unique ou un tableau, vérifie si au moins un contrat correspond
        contract: filters?.contract
          ? Array.isArray(filters.contract)
            ? { hasSome: filters.contract }
            : { has: filters.contract }
          : undefined,
        
        // Filtre title : recherche partielle insensible à la casse
        title: filters?.title 
          ? { contains: filters.title, mode: 'insensitive' } 
          : undefined,
        
        // Filtre location : recherche partielle insensible à la casse
        location: filters?.location 
          ? { contains: filters.location, mode: 'insensitive' } 
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
        
        // Filtre disability : vérifie si au moins une valeur du tableau est présente
        disabilityCompatible: filters?.disability 
          ? Array.isArray(filters.disability)
            ? { hasSome: filters.disability }
            : { has: filters.disability }
          : undefined,
        
        // Filtre date minimum
        createdAt: filters?.dateMin 
          ? { gte: new Date(filters.dateMin) } 
          : undefined,
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
}

/**
 * Enregistre une nouvelle offre d'emploi dans la base de données.
 * @param offerData - Les données de l'offre (titre, description, IDs, etc.)
 */
export async function createNewOffer(offerData: any)
{
  return prisma.offer.create
  (
    {
      data :
      {
        title: offerData.title,
        description: offerData.description,
        location: offerData.location,
        contract: offerData.contract,
        experience: offerData.experience,
        remote: offerData.remote,
        disabilityCompatible: offerData.disabilityCompatible,
        companyId: offerData.companyId,
        recruiterId: offerData.recruiterId,
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
  return prisma.offer.update
  (
    {
      where: { id },
      data: updateData,
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