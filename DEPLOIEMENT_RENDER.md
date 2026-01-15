# Déploiement Backend sur Render.com

## 1️⃣ Créer un compte Render.com

1. Aller sur https://render.com
2. Cliquer sur "Get Started"
3. S'inscrire avec GitHub (recommandé) ou email

## 2️⃣ Déployer le backend

### Configuration du service

1. Dans le dashboard Render, cliquer sur **"New +"** → **"Web Service"**
2. Connecter votre repository GitHub: `itsimed/project-handi`
3. Configurer le service :

| Paramètre | Valeur |
|-----------|--------|
| **Name** | `project-handi-backend` |
| **Region** | `Frankfurt (EU Central)` |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npx prisma generate && npm run build` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

### Variables d'environnement

Dans l'onglet "Environment", ajouter :

```bash
DATABASE_URL=mysql://imed:kotukvodrovbew2@handiman.univ-paris8.fr:3306/p27_imed
JWT_SECRET=ProjectHandi2026SecureSecret!Paris8
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://handiman.univ-paris8.fr/~imed
```

**⚠️ IMPORTANT** : Bien vérifier que l'URL de la base de données pointe vers le serveur Paris 8

## 3️⃣ Déployer la base de données

Une fois le service déployé, initialiser la base MySQL :

```bash
# Dans le shell Render (ou en local)
npx prisma db push
```

Ou utiliser phpMyAdmin sur Paris 8 pour exécuter le schéma SQL.

## 4️⃣ Récupérer l'URL du backend

Une fois déployé, Render vous donnera une URL comme :
```
https://project-handi-backend.onrender.com
```

## 5️⃣ Mettre à jour le frontend

Modifier `frontend/.env.production` :
```env
VITE_API_URL=https://project-handi-backend.onrender.com
```

Puis rebuilder et redéployer le frontend :
```bash
cd frontend
npm run build
scp -P 60022 -r dist/* imed@10.10.2.220:~/public_html/
```

## 🎯 URLs finales

- **Frontend**: https://handiman.univ-paris8.fr/~imed/
- **Backend**: https://project-handi-backend.onrender.com
- **Base de données**: MySQL sur handiman.univ-paris8.fr:3306

## ⚠️ Limitations du plan gratuit

- Le service se met en veille après 15 minutes d'inactivité
- Premier appel après inactivité = 30-60 secondes de délai
- 750 heures/mois (suffisant pour usage modéré)
- Base de données externe (Paris 8) donc pas de limite ici

## 🐛 Troubleshooting

### Erreur de connexion MySQL
- Vérifier que le serveur Paris 8 autorise les connexions externes
- Port MySQL (3306) doit être ouvert
- Credentials corrects dans DATABASE_URL

### Service ne démarre pas
- Vérifier les logs dans Render Dashboard
- S'assurer que `npm start` exécute `node dist/app.js`
- Vérifier que toutes les variables d'environnement sont définies
