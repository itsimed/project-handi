#!/bin/bash
# start.sh - Script de démarrage pour Render avec tunnel SSH

set -e

echo "🚀 Starting Project Handi Backend with SSH Tunnel..."

# Créer le fichier de clé SSH
SSH_KEY_PATH="/tmp/render_key"
if [ -z "$SSH_PRIVATE_KEY" ]; then
  echo "❌ ERROR: SSH_PRIVATE_KEY environment variable not set"
  exit 1
fi

echo "$SSH_PRIVATE_KEY" | base64 -d > "$SSH_KEY_PATH"
chmod 600 "$SSH_KEY_PATH"

# Lancer le tunnel SSH en arrière-plan
echo "🔗 Establishing SSH tunnel to Paris 8..."
ssh -i "$SSH_KEY_PATH" \
  -N \
  -L 3306:localhost:3306 \
  -p 60022 \
  -o "StrictHostKeyChecking=no" \
  -o "UserKnownHostsFile=/dev/null" \
  -o "ServerAliveInterval=60" \
  -o "ServerAliveCountMax=3" \
  imed@10.10.2.220 &

TUNNEL_PID=$!
echo "✅ SSH tunnel established (PID: $TUNNEL_PID)"

# Attendre que le tunnel soit stable
sleep 3

# Cleanup à la fermeture
trap "kill $TUNNEL_PID 2>/dev/null || true" EXIT TERM INT

# Lancer le serveur Node.js
echo "🎯 Starting Node.js server..."
cd backend
exec npm start
