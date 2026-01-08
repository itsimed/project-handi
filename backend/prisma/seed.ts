import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // ==========================================
  // 1. NETTOYAGE (optionnel - décommenter si besoin)
  // ==========================================
  // await prisma.application.deleteMany();
  // await prisma.offer.deleteMany();
  // await prisma.user.deleteMany();
  // await prisma.company.deleteMany();
  // await prisma.adaptation.deleteMany();
  // await prisma.skill.deleteMany();
  // console.log('✅ Base de données nettoyée');

  // ==========================================
  // 2. ADAPTATIONS
  // ==========================================
  const pmpParking = await prisma.adaptation.upsert({
    where: { label: 'Parking PMR' },
    update: {},
    create: { label: 'Parking PMR', category: 'MOTEUR' },
  });

  const screenReader = await prisma.adaptation.upsert({
    where: { label: "Logiciel lecteur d'écran" },
    update: {},
    create: { label: "Logiciel lecteur d'écran", category: 'VISUEL' },
  });

  const signLanguage = await prisma.adaptation.upsert({
    where: { label: 'Interprète LSF' },
    update: {},
    create: { label: 'Interprète LSF', category: 'AUDITIF' },
  });

  const flexibleHours = await prisma.adaptation.upsert({
    where: { label: 'Horaires flexibles' },
    update: {},
    create: { label: 'Horaires flexibles', category: 'PSYCHIQUE' },
  });

  console.log('✅ Adaptations créées');

  // ==========================================
  // 3. COMPÉTENCES
  // ==========================================
  const reactSkill = await prisma.skill.upsert({
    where: { name: 'React' },
    update: {},
    create: { name: 'React' },
  });

  const nodeSkill = await prisma.skill.upsert({
    where: { name: 'Node.js' },
    update: {},
    create: { name: 'Node.js' },
  });

  const pythonSkill = await prisma.skill.upsert({
    where: { name: 'Python' },
    update: {},
    create: { name: 'Python' },
  });

  const designSkill = await prisma.skill.upsert({
    where: { name: 'UI/UX Design' },
    update: {},
    create: { name: 'UI/UX Design' },
  });

  console.log('✅ Compétences créées');

  // ==========================================
  // 4. ENTREPRISES (sans description)
  // ==========================================
  const techInclusion = await prisma.company.upsert({
    where: { name: 'TechInclusion' },
    update: {},
    create: {
      name: 'TechInclusion',
      sector: 'Technologie & Innovation',
    },
  });

  const greenEnergy = await prisma.company.upsert({
    where: { name: 'GreenEnergy Corp' },
    update: {},
    create: {
      name: 'GreenEnergy Corp',
      sector: 'Énergies renouvelables',
    },
  });

  const healthPlus = await prisma.company.upsert({
    where: { name: 'HealthPlus' },
    update: {},
    create: {
      name: 'HealthPlus',
      sector: 'Santé & Bien-être',
    },
  });

  const eduTech = await prisma.company.upsert({
    where: { name: 'EduTech Solutions' },
    update: {},
    create: {
      name: 'EduTech Solutions',
      sector: 'Éducation',
    },
  });

  const financeAccess = await prisma.company.upsert({
    where: { name: 'FinanceAccess' },
    update: {},
    create: {
      name: 'FinanceAccess',
      sector: 'Services financiers',
    },
  });

  console.log('✅ Entreprises créées');

  // ==========================================
  // 5. UTILISATEURS (role: APPLICANT au lieu de CANDIDATE)
  // ==========================================
  const password = await bcrypt.hash('password123', 10);

  // Candidats (sans disabilityCategory car pas dans le modèle)
  const candidate1 = await prisma.user.upsert({
    where: { email: 'marie.dupont@example.com' },
    update: {},
    create: {
      email: 'marie.dupont@example.com',
      password,
      firstName: 'Marie',
      lastName: 'Dupont',
      role: 'APPLICANT',
    },
  });

  const candidate2 = await prisma.user.upsert({
    where: { email: 'jean.martin@example.com' },
    update: {},
    create: {
      email: 'jean.martin@example.com',
      password,
      firstName: 'Jean',
      lastName: 'Martin',
      role: 'APPLICANT',
    },
  });

  const candidate3 = await prisma.user.upsert({
    where: { email: 'sophie.bernard@example.com' },
    update: {},
    create: {
      email: 'sophie.bernard@example.com',
      password,
      firstName: 'Sophie',
      lastName: 'Bernard',
      role: 'APPLICANT',
    },
  });

  // Recruteurs
  const recruiter1 = await prisma.user.upsert({
    where: { email: 'recruiter@techinclusion.com' },
    update: {},
    create: {
      email: 'recruiter@techinclusion.com',
      password,
      firstName: 'Pierre',
      lastName: 'Leroy',
      role: 'RECRUITER',
      companyId: techInclusion.id,
    },
  });

  const recruiter2 = await prisma.user.upsert({
    where: { email: 'hr@greenenergy.com' },
    update: {},
    create: {
      email: 'hr@greenenergy.com',
      password,
      firstName: 'Claire',
      lastName: 'Dubois',
      role: 'RECRUITER',
      companyId: greenEnergy.id,
    },
  });

  const recruiter3 = await prisma.user.upsert({
    where: { email: 'rh@healthplus.com' },
    update: {},
    create: {
      email: 'rh@healthplus.com',
      password,
      firstName: 'Thomas',
      lastName: 'Moreau',
      role: 'RECRUITER',
      companyId: healthPlus.id,
    },
  });

  console.log('✅ Utilisateurs créés');

  // ==========================================
  // 6. OFFRES D'EMPLOI (experience: CONFIRME au lieu de CONFIRMED, JUNIOR au lieu de ENTRY)
  // ==========================================
  
  const offer1 = await prisma.offer.create({
    data: {
      title: 'Développeur Fullstack React/Node.js',
      description: 'Rejoignez notre équipe technique pour développer des applications web accessibles.\n\nMissions principales :\n- Développement frontend avec React\n- Développement backend avec Node.js\n- Tests et déploiement continu\n- Respect des normes WCAG\n\nProfil recherché :\n- Expérience en développement web\n- Maîtrise de JavaScript/TypeScript\n- Sensibilité à l\'accessibilité numérique',
      location: 'Paris',
      contract: ['CDI'],
      experience: 'JUNIOR',
      remote: 'HYBRID',
      companyId: techInclusion.id,
      recruiterId: recruiter1.id,
      disabilityCompatible: ['MOTEUR', 'VISUEL', 'AUDITIF'],
      adaptations: {
        connect: [{ id: pmpParking.id }, { id: screenReader.id }],
      },
      skills: {
        connect: [{ id: reactSkill.id }, { id: nodeSkill.id }],
      },
    },
  });

  const offer2 = await prisma.offer.create({
    data: {
      title: 'Data Analyst Python',
      description: 'Analysez les données énergétiques pour optimiser la production d\'énergies renouvelables.\n\nMissions :\n- Collecte et analyse de données\n- Création de dashboards\n- Modélisation prédictive\n\nCompétences requises :\n- Python (Pandas, NumPy)\n- SQL\n- Visualisation de données',
      location: 'Lyon',
      contract: ['CDI'],
      experience: 'CONFIRME',
      remote: 'FULL_REMOTE',
      companyId: greenEnergy.id,
      recruiterId: recruiter2.id,
      disabilityCompatible: ['MOTEUR', 'VISUEL', 'PSYCHIQUE'],
      adaptations: {
        connect: [{ id: screenReader.id }, { id: flexibleHours.id }],
      },
      skills: {
        connect: [{ id: pythonSkill.id }],
      },
    },
  });

  const offer3 = await prisma.offer.create({
    data: {
      title: 'Designer UX/UI Junior',
      description: 'Créez des interfaces accessibles et esthétiques pour nos applications de santé.\n\nVotre rôle :\n- Conception d\'interfaces utilisateur\n- Prototypage Figma\n- Tests utilisateurs\n- Collaboration avec les développeurs',
      location: 'Marseille',
      contract: ['CDD'],
      experience: 'JUNIOR',
      remote: 'HYBRID',
      companyId: healthPlus.id,
      recruiterId: recruiter3.id,
      disabilityCompatible: ['MOTEUR', 'AUDITIF', 'COGNITIF'],
      adaptations: {
        connect: [{ id: pmpParking.id }],
      },
      skills: {
        connect: [{ id: designSkill.id }],
      },
    },
  });

  const offer4 = await prisma.offer.create({
    data: {
      title: 'Développeur Backend Node.js Senior',
      description: 'Architecture et développement de nos APIs REST sécurisées.\n\nResponsabilités :\n- Design d\'architecture\n- Développement d\'APIs\n- Optimisation des performances\n- Mentorat d\'équipe',
      location: 'Toulouse',
      contract: ['CDI'],
      experience: 'SENIOR',
      remote: 'FULL_REMOTE',
      companyId: financeAccess.id,
      recruiterId: recruiter1.id,
      disabilityCompatible: ['MOTEUR', 'VISUEL', 'AUDITIF', 'PSYCHIQUE'],
      skills: {
        connect: [{ id: nodeSkill.id }],
      },
    },
  });

  const offer5 = await prisma.offer.create({
    data: {
      title: 'Chef de projet EdTech',
      description: 'Pilotez des projets de transformation digitale dans l\'éducation.\n\nVos missions :\n- Gestion de projets agiles\n- Coordination d\'équipes\n- Suivi budgétaire\n- Relation client',
      location: 'Bordeaux',
      contract: ['CDI', 'CDD'],
      experience: 'CONFIRME',
      remote: 'HYBRID',
      companyId: eduTech.id,
      recruiterId: recruiter2.id,
      disabilityCompatible: ['MOTEUR', 'INVISIBLE'],
    },
  });

  const offer6 = await prisma.offer.create({
    data: {
      title: 'Stage Développement Web',
      description: 'Stage de 6 mois pour découvrir le développement web dans une équipe bienveillante.\n\nCe que vous apprendrez :\n- HTML/CSS/JavaScript\n- Framework React\n- Méthodologies agiles\n- Accessibilité web',
      location: 'Paris',
      contract: ['STAGE'],
      experience: 'JUNIOR',
      remote: 'NO_REMOTE',
      companyId: techInclusion.id,
      recruiterId: recruiter1.id,
      disabilityCompatible: ['MOTEUR', 'VISUEL', 'AUDITIF', 'COGNITIF', 'PSYCHIQUE'],
      skills: {
        connect: [{ id: reactSkill.id }],
      },
    },
  });

  const offer7 = await prisma.offer.create({
    data: {
      title: 'Alternance Analyste Financier',
      description: 'Contrat d\'alternance (Master 1/2) en analyse financière.\n\nVous participerez à :\n- Analyse de risques\n- Reporting financier\n- Études de marché\n- Outils de modélisation',
      location: 'Nantes',
      contract: ['ALTERNANCE'],
      experience: 'JUNIOR',
      remote: 'HYBRID',
      companyId: financeAccess.id,
      recruiterId: recruiter1.id,
      disabilityCompatible: ['MOTEUR', 'AUDITIF'],
    },
  });

  const offer8 = await prisma.offer.create({
    data: {
      title: 'Technicien Support IT',
      description: 'Assistance technique niveau 1 et 2 pour nos clients.\n\nMissions :\n- Support téléphonique\n- Résolution d\'incidents\n- Documentation\n- Formation utilisateurs',
      location: 'Lille',
      contract: ['CDI'],
      experience: 'JUNIOR',
      remote: 'NO_REMOTE',
      companyId: eduTech.id,
      recruiterId: recruiter2.id,
      disabilityCompatible: ['MOTEUR', 'VISUEL'],
      adaptations: {
        connect: [{ id: pmpParking.id }, { id: screenReader.id }],
      },
    },
  });

  const offer9 = await prisma.offer.create({
    data: {
      title: 'Ingénieur DevOps',
      description: 'Automatisation et infrastructure cloud pour nos services de santé connectée.\n\nTechnologies :\n- Docker/Kubernetes\n- CI/CD (GitLab, Jenkins)\n- AWS/Azure\n- Terraform',
      location: 'Marseille',
      contract: ['CDI', 'INTERIM'],
      experience: 'CONFIRME',
      remote: 'FULL_REMOTE',
      companyId: healthPlus.id,
      recruiterId: recruiter3.id,
      disabilityCompatible: ['MOTEUR', 'VISUEL', 'AUDITIF', 'PSYCHIQUE', 'INVISIBLE'],
    },
  });

  const offer10 = await prisma.offer.create({
    data: {
      title: 'Mission Freelance React',
      description: 'Mission de 3 mois pour refonte d\'une interface client.\n\nLivrable :\n- Composants React réutilisables\n- Tests unitaires\n- Documentation technique\n- Formation de l\'équipe',
      location: 'Remote',
      contract: ['INTERIM'],
      experience: 'CONFIRME',
      remote: 'FULL_REMOTE',
      companyId: greenEnergy.id,
      recruiterId: recruiter2.id,
      disabilityCompatible: ['MOTEUR', 'VISUEL', 'AUDITIF', 'PSYCHIQUE', 'COGNITIF', 'INVISIBLE'],
      skills: {
        connect: [{ id: reactSkill.id }],
      },
    },
  });

  console.log('✅ Offres créées');

  // ==========================================
  // 7. CANDIDATURES
  // ==========================================
  
  // Marie postule à 3 offres
  await prisma.application.create({
    data: {
      userId: candidate1.id,
      offerId: offer1.id,
      companyId: techInclusion.id,
      status: 'PENDING',
    },
  });

  await prisma.application.create({
    data: {
      userId: candidate1.id,
      offerId: offer3.id,
      companyId: healthPlus.id,
      status: 'ACCEPTED',
    },
  });

  await prisma.application.create({
    data: {
      userId: candidate1.id,
      offerId: offer6.id,
      companyId: techInclusion.id,
      status: 'REJECTED',
    },
  });

  // Jean postule à 2 offres
  await prisma.application.create({
    data: {
      userId: candidate2.id,
      offerId: offer2.id,
      companyId: greenEnergy.id,
      status: 'PENDING',
    },
  });

  await prisma.application.create({
    data: {
      userId: candidate2.id,
      offerId: offer4.id,
      companyId: financeAccess.id,
      status: 'PENDING',
    },
  });

  console.log('✅ Candidatures créées');

  console.log('');
  console.log('🎉 SEEDING TERMINÉ AVEC SUCCÈS !');
  console.log('');
  console.log('📊 Résumé :');
  console.log('  - 4 adaptations');
  console.log('  - 4 compétences');
  console.log('  - 5 entreprises');
  console.log('  - 6 utilisateurs (3 candidats + 3 recruteurs)');
  console.log('  - 10 offres d\'emploi');
  console.log('  - 5 candidatures');
  console.log('');
  console.log('🔐 Identifiants de test :');
  console.log('  Candidat 1: marie.dupont@example.com / password123');
  console.log('  Candidat 2: jean.martin@example.com / password123');
  console.log('  Candidat 3: sophie.bernard@example.com / password123');
  console.log('  Recruteur 1: recruiter@techinclusion.com / password123');
  console.log('  Recruteur 2: hr@greenenergy.com / password123');
  console.log('  Recruteur 3: rh@healthplus.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
