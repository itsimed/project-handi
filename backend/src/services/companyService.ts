import prisma from '../config/prisma';

/**
 * Crée une nouvelle entreprise en base de données
 */
export async function createCompany
(data :
{ 
    name: string; 
    description?: string; 
      location: string; 
    logo?: string; 
      website?: string 
}
)

{
    return prisma.company.create(
    {
        data
    });
}

/**
 * Récupère toutes les entreprises avec le compte de leurs offres
 */
export async function getAllCompanies()
{
  return prisma.company.findMany(
  {
    include: {
      _count: {
        select: { offers: true }
      }
    }
  });
}

/**
 * Récupère une entreprise spécifique par son identifiant
 */
export async function getCompanyById(id: number)
{
  return prisma.company.findUnique({
    where: { id },
    include: { 
      offers: true
    }
  });
}