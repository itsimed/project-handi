# 🚀 Guide d'installation - Project Handi

## ✅ Installation Simplifiée (Base Neon Cloud)

La base de données PostgreSQL est hébergée sur **Neon Cloud** et partagée entre tous les membres de l'équipe.

### 📋 Prérequis

- **Node.js 18+** → [Télécharger](https://nodejs.org/)
- **Git** → [Télécharger](https://git-scm.com/)
- ⚠️ **Pas besoin de Docker** (la base est en ligne !)

---

## 🔧 Installation en 4 étapes

### 1️⃣ Cloner le repository

```bash
git clone <URL_DU_REPO>
cd project-handi
```

### 2️⃣ Installer les dépendances

**Backend :**
```bash
cd backend
npm install
```

**Frontend :**
```bash
cd ../frontend
npm install
```

### 3️⃣ Configurer les variables d'environnement

```bash
# Dans le dossier backend
cd backend
cp .env.example .env
```

Le fichier `.env` contient déjà la connexion à la base Neon partagée :
```env
DATABASE_URL="postgresql://neondb_owner:npg_YFK6GIAk7QMo@ep-raspy-hat-agzz8hcf-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="votre_secret_jwt_super_securise_changez_moi_en_production"
PORT=5000
```

⚠️ **Ne modifiez RIEN dans ce fichier** (sauf si l'administrateur vous le demande)

### 4️⃣ Générer le client Prisma

```bash
# Toujours dans backend/
npx prisma generate
```

⚠️ **Pas besoin de `npx prisma db seed`** : La base Neon est déjà peuplée avec des données de test ! 🎉

---

## 🎯 Lancer l'application

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```
✅ Backend accessible : http://localhost:5000/api/v1

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```
✅ Frontend accessible : http://localhost:5173

---

## 🧪 Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Candidat** | marie.dupont@example.com | password123 |
| **Recruteur** | recruiter@techinclusion.com | password123 |

---

## 🛠️ Commandes utiles

### Visualiser la base de données
```bash
cd backend
npx prisma studio
```
Ouvre une interface graphique : http://localhost:5555

### Mettre à jour le schéma Prisma
```bash
cd backend
npx prisma generate
```

### Synchroniser avec les nouvelles migrations
```bash
cd backend
npx prisma migrate deploy
```

---

## 🐛 Résolution de problèmes

### ❌ "Cannot reach database server"
→ Vérifiez votre connexion Internet (la base est sur le cloud)

### ❌ "Module not found"
→ Réinstallez les dépendances
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### ❌ Erreurs TypeScript Prisma
→ Régénérez le client
```bash
cd backend
npx prisma generate
```

### ❌ "Port 5000 already in use"
→ Un autre processus utilise le port
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

---

## ⚠️ Règles importantes

### 🔒 Sécurité
- ✅ Ne committez **JAMAIS** le fichier `.env`
- ✅ Ne partagez **JAMAIS** l'URL de la base de données publiquement
- ✅ Utilisez les comptes de test (pas de vraies données personnelles)

### 🤝 Travail en équipe
- ⚠️ **Attention** : Vous partagez la même base de données
- ⚠️ Si vous supprimez une offre, elle disparaît pour tout le monde
- ✅ Testez dans des comptes différents pour éviter les conflits
- ✅ Communiquez avant de modifier massivement les données
- ✅ **Les données existent déjà** : 10 offres, 6 utilisateurs, 5 entreprises

### 📊 Base de données partagée
```
PC Membre 1    PC Membre 2    PC Membre 3
    ↓              ↓              ↓
    └──────────────┼──────────────┘
                   ↓
          ☁️ Base Neon Cloud
        (MÊMES DONNÉES POUR TOUS)
```

**Ce que ça signifie :**
- Si Marie crée une offre → Jean la voit instantanément
- Si Sophie candidate → Le recruteur reçoit la candidature en temps réel
- Si quelqu'un supprime des données → Elles disparaissent pour tous

---

## 📁 Structure du projet

```
project-handi/
├── frontend/              # Application React
│   ├── src/
│   │   ├── pages/        # Pages
│   │   ├── components/   # Composants
│   │   └── api/          # Appels API
│   └── package.json
│
├── backend/              # API Node.js + Express
│   ├── src/
│   │   ├── controllers/  # Logique métier
│   │   ├── routes/       # Routes API
│   │   └── services/     # Services
│   ├── prisma/
│   │   └── schema.prisma # Schéma BDD
│   └── .env              # Config (NE PAS COMMIT)
│
└── INSTALLATION.md       # Ce fichier
```

---

## 🚀 Workflow quotidien

```bash
# 1. Ouvrir 2 terminaux

# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev

# 3. Développer ! 🎨
```

---

## 📞 Support

En cas de problème :
1. Vérifiez ce guide
2. Consultez les issues GitHub
3. Contactez l'administrateur du projet

---

**Bon développement ! 🦽💪**
