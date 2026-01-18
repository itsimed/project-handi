# Project Handi - Plateforme de Recrutement Inclusive

Plateforme web de recrutement accessible et inclusive, spécialement conçue pour faciliter l'insertion professionnelle des personnes en situation de handicap.

[![RGAA](https://img.shields.io/badge/RGAA-Conforme-green)](https://www.numerique.gouv.fr/publications/rgaa-accessibilite/)
[![WCAG 2.1](https://img.shields.io/badge/WCAG%202.1-AA-blue)](https://www.w3.org/WAI/WCAG21/quickref/)

## Installation rapide

### Pour les membres de l'équipe

**Consultez [INSTALLATION.md](INSTALLATION.md) pour le guide complet**

```bash
# 1. Cloner et installer
git clone <URL_DU_REPO>
cd project-handi
cd backend && npm install
cd ../frontend && npm install

# 2. Configurer (.env déjà prêt avec base Neon)
cd backend && cp .env.example .env
npx prisma generate

# 3. Lancer
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev
```

**Pas besoin de Docker** (base PostgreSQL Neon Cloud partagée)

### Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Candidat | marie.dupont@example.com | password123 |
| Recruteur | recruiter@techinclusion.com | password123 |

---

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Lancement du projet](#lancement-du-projet)
- [Structure du projet](#structure-du-projet)
- [API Endpoints](#api-endpoints)
- [Tests](#tests)
- [Accessibilité](#accessibilité)
- [Contribution](#contribution)

---

## Fonctionnalités

### Pour les Candidats
- **Recherche d'offres** : Barre de recherche avec filtres avancés (contrat, expérience, télétravail, handicap)
- **Filtrage par accessibilité** : Recherche d'offres compatibles avec différents types de handicap
- **Candidature en ligne** : Postulation simplifiée avec gestion des documents (CV, lettre de motivation)
- **Suivi des candidatures** : Tableau de bord pour suivre l'état de ses candidatures
- **Responsive** : Interface adaptée mobile, tablette et desktop

### Pour les Recruteurs
- **Création d'offres** : Publication d'offres avec précision sur l'accessibilité
- **Gestion des candidatures** : Consultation et gestion des candidatures reçues
- **Profil entreprise** : Mise en avant de la politique d'inclusion de l'entreprise

### Accessibilité (RGAA/WCAG AA)
- Navigation clavier complète
- Lecteurs d'écran compatibles
- Contrastes respectés (ratio 4.5:1 minimum)
- Focus visible sur tous les éléments interactifs
- HTML sémantique
- ARIA labels appropriés

---

## Technologies utilisées

### Frontend
- **React 18** avec TypeScript
- **Vite** - Build tool moderne et rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **React Router DOM** - Routing côté client
- **Axios** - Client HTTP

### Backend
- **Node.js** avec Express
- **TypeScript** - Typage statique
- **Prisma ORM** - Gestion de base de données
- **PostgreSQL** - Base de données relationnelle
- **JWT** - Authentification sécurisée
- **bcrypt** - Hashage des mots de passe

### DevOps
- **Neon Cloud** - Base de données PostgreSQL hébergée dans le cloud

---

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18 ou supérieure) - [Télécharger](https://nodejs.org/)
- **npm** (version 9 ou supérieure) - Inclus avec Node.js
- **Git** - [Télécharger](https://git-scm.com/)
- **Connexion Internet** - La base de données est hébergée sur Neon Cloud

Vérifiez vos versions :
```bash
node --version  # doit afficher v18.x.x ou supérieur
npm --version   # doit afficher 9.x.x ou supérieur
```

---

## Installation

### 1. Cloner le repository

```bash
git clone <URL_DU_REPO>
cd project-handi
```

### 2. Installation des dépendances

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

---

## Lancement du projet

### Méthode 1 : Lancement complet (Recommandé)

#### Étape 1 : Configurer le backend

```bash
cd backend

# Créer le fichier .env depuis .env.example (si pas déjà fait)
cp .env.example .env

# Le fichier .env contient déjà la connexion à la base Neon Cloud partagée
# Ne modifiez RIEN dans ce fichier (sauf si l'administrateur vous le demande)

# Générer le client Prisma
npx prisma generate

# Synchroniser avec la base de données Neon (migrations)
npx prisma migrate deploy
```

**Note** : La base de données Neon Cloud est déjà peuplée avec des données de test. Pas besoin de `npx prisma db seed`.

#### Étape 2 : Lancer le serveur backend

```bash
# Dans le dossier backend
npm run dev
```

Le backend démarre sur **http://localhost:5000**

#### Étape 3 : Lancer le serveur frontend

**Dans un nouveau terminal :**

```bash
cd frontend
npm run dev
```

Le frontend démarre sur **http://localhost:5173**

### Méthode 2 : Lancement séparé (développement)

Si vous préférez lancer chaque service manuellement :

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## Accès et test de l'application

### Accès à l'application

Une fois tout lancé, ouvrez votre navigateur sur :
- **Frontend** : http://localhost:5173
- **API Backend** : http://localhost:5000/api/v1

### Comptes de test

Le seed a créé des comptes de test que vous pouvez utiliser :

#### Candidats
```
Email: marie.dupont@example.com
Mot de passe: password123

Email: jean.martin@example.com
Mot de passe: password123

Email: sophie.bernard@example.com
Mot de passe: password123
```

#### Recruteurs
```
Email: recruiter@techinclusion.com
Mot de passe: password123

Email: hr@greenenergy.com
Mot de passe: password123

Email: rh@healthplus.com
Mot de passe: password123
```

### Données de test disponibles

Le seed a créé :
- 10 offres d'emploi variées (CDI, CDD, Stage, Alternance, Intérim)
- 5 entreprises dans différents secteurs
- 6 utilisateurs (3 candidats + 3 recruteurs)
- 5 candidatures existantes pour tester le suivi

---

## Structure du projet

```
project-handi/
├── backend/                    # Serveur Node.js/Express
│   ├── prisma/
│   │   ├── migrations/        # Migrations de la base de données
│   │   ├── schema.prisma      # Schéma de la base de données
│   │   └── seed.ts           # Données de test
│   ├── src/
│   │   ├── config/           # Configuration (Prisma, etc.)
│   │   ├── controllers/      # Contrôleurs Express
│   │   ├── middlewares/      # Middlewares (auth, etc.)
│   │   ├── routes/           # Routes de l'API
│   │   ├── services/         # Logique métier
│   │   └── app.ts            # Point d'entrée
│   └── package.json
│
├── frontend/                  # Application React
│   ├── src/
│   │   ├── api/              # Configuration Axios
│   │   ├── components/       # Composants réutilisables
│   │   │   ├── Icon.tsx      # Système d'icônes SVG
│   │   │   ├── FiltersPanel.tsx
│   │   │   ├── OfferCard.tsx
│   │   │   └── ...
│   │   ├── pages/            # Pages de l'application
│   │   │   ├── HomePage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── OfferDetailPage.tsx
│   │   │   ├── MyApplicationsPage.tsx
│   │   │   └── ApplicationDetailPage.tsx
│   │   ├── hooks/            # Custom React hooks
│   │   ├── types/            # Types TypeScript
│   │   ├── App.tsx           # Composant principal
│   │   └── main.tsx          # Point d'entrée
│   ├── DESIGN_SYSTEM.md      # Documentation du design system
│   └── package.json
│
├── RAPPORT_PROJET.md         # Rapport technique détaillé
└── README.md                 # Ce fichier
```

---

## API Endpoints

### Authentification
- `POST /api/v1/auth/register` - Inscription
- `POST /api/v1/auth/login` - Connexion

### Offres d'emploi
- `GET /api/v1/offers` - Liste des offres (avec filtres)
- `GET /api/v1/offers/:id` - Détail d'une offre
- `POST /api/v1/offers` - Créer une offre (recruteur uniquement)

### Candidatures
- `POST /api/v1/applications` - Postuler à une offre
- `GET /api/v1/applications/me` - Mes candidatures (candidat)
- `GET /api/v1/applications/:id` - Détail d'une candidature
- `GET /api/v1/applications/recruiter` - Candidatures reçues (recruteur)
- `PATCH /api/v1/applications/:id/status` - Modifier le statut (recruteur)

### Utilisateurs
- `GET /api/v1/users/me` - Profil de l'utilisateur connecté
- `PATCH /api/v1/users/me` - Modifier son profil

### Entreprises
- `GET /api/v1/companies` - Liste des entreprises
- `GET /api/v1/companies/:id` - Détail d'une entreprise

---

## Tests

```bash
# Backend (à venir)
cd backend
npm test

# Frontend (à venir)
cd frontend
npm test
```

---

## Accessibilité

Ce projet respecte les normes **RGAA** (Référentiel Général d'Amélioration de l'Accessibilité) et **WCAG 2.1 niveau AA**.

### Bonnes pratiques implémentées

- **HTML sémantique** : `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`
- **ARIA labels** : `aria-label`, `aria-labelledby`, `aria-live`, `role`
- **Navigation clavier** : Tab, Shift+Tab, Enter, Espace
- **Focus visible** : Anneaux de focus avec bon contraste
- **Textes alternatifs** : Toutes les icônes décoratives marquées `aria-hidden="true"`
- **Contrastes** : Ratio minimum 4.5:1 pour le texte normal, 7:1 pour certains éléments
- **Formulaires** : Labels associés, instructions claires, messages d'erreur explicites
- **Responsive** : Adaptable de 320px à 4K

### Tester l'accessibilité

- **Lecteur d'écran** : NVDA (Windows), VoiceOver (Mac), JAWS
- **Navigation clavier** : Testez en utilisant uniquement Tab/Shift+Tab et Enter
- **Outils** : Axe DevTools, Lighthouse, WAVE

---

## Commandes utiles

### Backend

```bash
# Lancer en mode développement
npm run dev

# Build pour production
npm run build

# Lancer en production
npm start

# Prisma
npx prisma studio              # Interface graphique de la BDD
npx prisma migrate dev         # Créer une migration
npx prisma db seed             # Peupler la BDD
npx prisma generate            # Générer le client Prisma
```

### Frontend

```bash
# Lancer en mode développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

### Base de données (Neon Cloud)

```bash
# Visualiser la base de données
cd backend
npx prisma studio              # Interface graphique : http://localhost:5555

# Synchroniser avec les migrations
npx prisma migrate deploy

# Générer le client Prisma après modification du schema
npx prisma generate
```

---

## Dépannage

### Problème : Le backend ne se connecte pas à la base de données

**Solution** :
1. Vérifiez votre connexion Internet (la base est sur Neon Cloud)
2. Vérifiez le fichier `.env` dans `backend/` (doit contenir l'URL Neon)
3. Vérifiez que l'URL de la base de données dans `.env` est correcte
4. Testez la connexion : `cd backend && npx prisma db pull`

### Problème : Port déjà utilisé

**Solution** :
```bash
# Trouver le processus qui utilise le port 5000
lsof -i :5000

# Tuer le processus
kill -9 <PID>
```

### Problème : Erreur de migration Prisma

**Solution** :
```bash
cd backend
npx prisma migrate reset  # Supprime toutes les données
npx prisma migrate dev
npx prisma db seed
```

### Problème : Le frontend ne communique pas avec le backend

**Solution** :
1. Vérifiez que le backend est bien lancé sur le port 5000
2. Vérifiez la configuration dans `frontend/src/api/apiClient.ts`
3. Vérifiez les CORS dans `backend/src/app.ts`

---

## Contribution

### Workflow Git

```bash
# Créer une branche pour votre fonctionnalité
git checkout -b feature/nom-de-la-fonctionnalite

# Faire vos modifications

# Commiter
git add .
git commit -m "feat: description de la fonctionnalité"

# Push
git push origin feature/nom-de-la-fonctionnalite

# Créer une Pull Request sur GitHub/GitLab
```

### Conventions de commit

Nous utilisons les [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage (pas de changement de code)
- `refactor:` Refactorisation
- `test:` Ajout de tests
- `chore:` Maintenance

**Exemples** :
```bash
git commit -m "feat: ajout du système de filtres avancés"
git commit -m "fix: correction du calcul des contrastes"
git commit -m "docs: mise à jour du README avec Docker"
```
