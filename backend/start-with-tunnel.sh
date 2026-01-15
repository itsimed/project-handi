#!/bin/bash
# start-with-tunnel.sh
# Lance le tunnel SSH et le serveur backend

set -e

# Source le tunnel SSH en arrière-plan
echo "🚀 Starting Project Handi Backend with SSH Tunnel..."
./tunnel-ssh.sh &
TUNNEL_PID=$!

# Attendre que le tunnel soit établi
sleep 3

# Vérifier que le tunnel est actif
if ! kill -0 $TUNNEL_PID 2>/dev/null; then
  echo "❌ SSH tunnel failed to start"
  exit 1
fi

echo "✅ SSH tunnel is active"

# Cleanup les processus enfants à la fermeture
trap "kill $TUNNEL_PID" EXIT TERM INT

# Lancer le serveur backend
echo "🎯 Starting Node.js server..."
exec npm start
