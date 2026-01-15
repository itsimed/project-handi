#!/bin/bash

# Script de déploiement pour hébergement mutualisé Paris 8
# Port SSH : 60022
# Serveur : handiman.univ-paris8.fr

SERVER_USER="imed"
SERVER_HOST="handiman.univ-paris8.fr"
SERVER_PORT="60022"
SERVER_PATH="~/public_html"

echo "🚀 Déploiement Project Handi sur Paris 8..."

# 1. Vérifier que le build frontend existe
if [ ! -d "frontend/dist" ]; then
    echo "📦 Build du frontend..."
    cd frontend
    npm run build
    cd ..
fi

# 2. Créer un fichier .htaccess pour React Router
echo "📝 Création du fichier .htaccess..."
cat > frontend/dist/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /~imed/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /~imed/index.html [L]
</IfModule>
EOF

# 3. Upload du frontend via SCP
echo "📤 Upload du frontend..."
scp -P ${SERVER_PORT} -r frontend/dist/* ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

if [ $? -eq 0 ]; then
    echo "✅ Frontend déployé avec succès !"
    echo "🌐 Site accessible sur : https://handiman.univ-paris8.fr/~imed/"
else
    echo "❌ Erreur lors de l'upload"
    exit 1
fi

echo ""
echo "⚠️  Note : Le backend Node.js nécessite un serveur dédié."
echo "Options :"
echo "  1. Héberger le backend sur un service gratuit (Render, Railway)"
echo "  2. Demander un accès serveur Node.js à l'université"
echo "  3. Utiliser uniquement le frontend (mode démo)"
