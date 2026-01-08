// Script pour associer les recruteurs aux entreprises
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixRecruiterCompanies() {
  try {
    // Récupérer tous les recruteurs sans companyId
    const recruitersWithoutCompany = await prisma.user.findMany({
      where: {
        role: 'RECRUITER',
        companyId: null,
      },
    });

    console.log(`Trouvé ${recruitersWithoutCompany.length} recruteurs sans entreprise`);

    // Récupérer toutes les entreprises
    const companies = await prisma.company.findMany();
    console.log(`${companies.length} entreprises disponibles`);

    // Si aucune entreprise n'existe, en créer une par défaut
    let defaultCompany;
    if (companies.length === 0) {
      console.log("Création d'une entreprise par défaut...");
      defaultCompany = await prisma.company.create({
        data: {
          name: 'Entreprise par défaut',
          sector: 'TECH',
        },
      });
      console.log(`Entreprise créée: ${defaultCompany.name} (ID: ${defaultCompany.id})`);
    } else {
      defaultCompany = companies[0];
      console.log(`Utilisation de l'entreprise existante: ${defaultCompany.name} (ID: ${defaultCompany.id})`);
    }

    // Associer tous les recruteurs à l'entreprise
    for (const recruiter of recruitersWithoutCompany) {
      await prisma.user.update({
        where: { id: recruiter.id },
        data: { companyId: defaultCompany.id },
      });
      console.log(`✓ Recruteur ${recruiter.email} associé à ${defaultCompany.name}`);
    }

    console.log('\n✅ Tous les recruteurs ont été associés à une entreprise!');
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixRecruiterCompanies();
