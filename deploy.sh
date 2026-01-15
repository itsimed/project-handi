#!/bin/bash

# Script de déploiement Project Handi
# Usage: ./deploy.sh

echo "🚀 Déploiement de Project Handi..."

# Variables à configurer
SERVER_USER="votre_user"
SERVER_HOST="votre_serveur.com"
SERVER_PATH="/var/www/project-handi"

# 1. Build du backend
echo "📦 Build du backend..."
cd backend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build du backend"
    exit 1
fi

# 2. Build du frontend
echo "📦 Build du frontend..."
cd ../frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build du frontend"
    exit 1
fi
cd ..

# 3. Upload des fichiers
echo "📤 Upload vers le serveur..."

# Backend
echo "  - Backend..."
scp -r backend/dist backend/package.json backend/package-lock.json backend/.env.production backend/ecosystem.config.js ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/backend/

# Prisma
echo "  - Base de données..."
scp -r backend/prisma ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/backend/

# Frontend
echo "  - Frontend..."
scp -r frontend/dist ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/frontend/

# 4. Commandes sur le serveur
echo "🔄 Installation et redémarrage..."
ssh ${SERVER_USER}@${SERVER_HOST} << 'EOF'
cd /var/www/project-handi/backend

# Copier .env.production en .env
cp .env.production .env

# Installer les dépendances
npm install --production

# Générer Prisma client
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Redémarrer avec PM2
pm2 restart project-handi-api || pm2 start ecosystem.config.js --env production

# Sauvegarder la config PM2
pm2 save

echo "✅ Déploiement terminé sur le serveur"
EOF

echo "✅ Déploiement complet terminé !"
echo "🌐 Votre site est en ligne !"
