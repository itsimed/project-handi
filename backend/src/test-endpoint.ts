// Test de l'endpoint /applications/me
import axios from 'axios';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'votre_secret_jwt_super_securise_changez_moi_en_production';
const BASE_URL = 'http://localhost:5000/api/v1';

async function testApplicationsEndpoint() {
  try {
    console.log('🧪 Test de l\'endpoint /applications/me\n');

    // 1. Créer un token pour l'utilisateur ID 1 (Marie Dupont - APPLICANT)
    const token = jwt.sign(
      { userId: 1, role: 'APPLICANT' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('🔑 Token généré pour userId: 1 (Marie Dupont)\n');

    // 2. Appeler l'endpoint
    const response = await axios.get(`${BASE_URL}/applications/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Requête réussie!');
    console.log(`📊 Nombre de candidatures: ${response.data.length}\n`);

    if (response.data.length > 0) {
      console.log('📝 Candidatures récupérées:');
      response.data.forEach((app: any, index: number) => {
        console.log(`\n   ${index + 1}. Candidature #${app.id}`);
        console.log(`      Offre: ${app.offer?.title || 'N/A'}`);
        console.log(`      Lieu: ${app.offer?.location || 'N/A'}`);
        console.log(`      Contrat: ${app.offer?.contract || 'N/A'}`);
        console.log(`      Entreprise: ${app.company?.name || 'N/A'}`);
        console.log(`      Statut: ${app.status}`);
        console.log(`      Date: ${new Date(app.createdAt).toLocaleDateString('fr-FR')}`);
      });
    }

    console.log('\n✅ L\'endpoint fonctionne correctement!');
    console.log('✅ Le backend est prêt pour la page "Mes candidatures"');

  } catch (error: any) {
    console.error('❌ Erreur lors du test:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message:`, error.response.data);
    } else {
      console.error(`   ${error.message}`);
    }
    console.log('\n⚠️  Vérifiez que le serveur backend est démarré sur le port 5000');
  }
}

testApplicationsEndpoint();
