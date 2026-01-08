// Test de la base de données et des candidatures
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Vérification de la base de données...\n');

    // 1. Compter les données
    const [usersCount, offersCount, applicationsCount] = await Promise.all([
      prisma.user.count(),
      prisma.offer.count(),
      prisma.application.count(),
    ]);

    console.log('📊 Statistiques:');
    console.log(`   Utilisateurs: ${usersCount}`);
    console.log(`   Offres: ${offersCount}`);
    console.log(`   Candidatures: ${applicationsCount}\n`);

    // 2. Lister les utilisateurs candidats
    const applicants = await prisma.user.findMany({
      where: { role: 'APPLICANT' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
      take: 5,
    });

    console.log('👥 Candidats:');
    applicants.forEach(user => {
      console.log(`   ${user.id} - ${user.email} (${user.firstName} ${user.lastName})`);
    });

    // 3. Lister quelques candidatures
    if (applicationsCount > 0) {
      const applications = await prisma.application.findMany({
        take: 5,
        include: {
          user: {
            select: { email: true, firstName: true, lastName: true }
          },
          offer: {
            select: { title: true, location: true }
          },
          company: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      console.log('\n📝 Candidatures récentes:');
      applications.forEach(app => {
        console.log(`   ${app.id} - ${app.user.firstName} ${app.user.lastName} → ${app.offer.title}`);
        console.log(`      Entreprise: ${app.company?.name || 'N/A'} | Statut: ${app.status}`);
      });
    } else {
      console.log('\n⚠️  Aucune candidature trouvée dans la base de données');
      console.log('   💡 Exécutez: npx prisma db seed');
    }

    console.log('\n✅ Test terminé');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
