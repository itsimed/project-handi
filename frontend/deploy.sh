#!/bin/bash

# Script de déploiement frontend sur handiman.univ-paris8.fr
# Le contenu de dist/ sera copié dans ~/public_html/~imed/

SERVER="handiman.univ-paris8.fr"
USER="imed"
PORT="60022"
REMOTE_DIR="public_html"
LOCAL_DIST="dist/"

echo "🚀 Déploiement du frontend sur $SERVER..."
echo "📦 Build en cours..."

# Build du projet
npm run build -- --mode production || { echo "❌ Build échoué"; exit 1; }

echo "✅ Build terminé"
echo "📤 Upload des fichiers vers $SERVER:$REMOTE_DIR..."

# Transfert avec SCP (l'utilisateur devra entrer le mot de passe)
# Option: Créer d'abord le dossier si nécessaire
scp -P $PORT -r $LOCAL_DIST/* ${USER}@${SERVER}:${REMOTE_DIR}/

if [ $? -eq 0 ]; then
    echo "✅ Déploiement réussi!"
    echo "🌐 Site accessible à: http://$SERVER/~imed/"
else
    echo "❌ Erreur lors du déploiement"
    exit 1
fi
