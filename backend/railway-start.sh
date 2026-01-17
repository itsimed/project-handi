#!/bin/bash
set -e

echo "🔧 Résolution des migrations échouées..."
npx prisma migrate resolve --rolled-back 20260117215637_remove_invisible_category || echo "Migration déjà résolue ou inexistante"

echo "📦 Application des migrations..."
npx prisma migrate deploy

echo "🚀 Démarrage du serveur..."
npm start
