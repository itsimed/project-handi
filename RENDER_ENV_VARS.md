# Variables d'environnement Render.com

## ⚠️ CONFIGURATION OBLIGATOIRE

Allez dans **Render Dashboard** → Votre service `yojob` → **Environment**

Ajoutez ces variables :

```bash
# Base de données MySQL Paris 8
DATABASE_URL=mysql://imed:kotukvodrovbew2@handiman.univ-paris8.fr:3306/p27_imed

# JWT Secret
JWT_SECRET=ProjectHandi2026SecureSecret!Paris8

# Node Environment
NODE_ENV=production

# Port (déjà configuré automatiquement par Render)
PORT=10000

# Frontend URL (pour CORS si nécessaire)
FRONTEND_URL=https://handiman.univ-paris8.fr/~imed
```

## ⚡ Important

Après avoir ajouté ces variables, Render va **redéployer automatiquement** le service.

## 🔍 Test de connexion

Une fois redéployé, testez l'API :
- **Health check** : https://yojob.onrender.com/api/v1/
- **Auth** : https://yojob.onrender.com/api/v1/auth/login

## 🌐 URLs complètes

- **Frontend** : https://handiman.univ-paris8.fr/~imed/
- **Backend** : https://yojob.onrender.com/api/v1
- **Database** : MySQL sur handiman.univ-paris8.fr:3306
