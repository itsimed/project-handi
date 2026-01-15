#!/bin/bash
# tunnel-ssh.sh
# Script pour établir un tunnel SSH vers Paris 8

SSH_KEY_PATH="/tmp/render_key"
REMOTE_HOST="imed@10.10.2.220"
REMOTE_PORT="60022"
LOCAL_PORT="3306"
REMOTE_MYSQL_HOST="localhost"
REMOTE_MYSQL_PORT="3306"
TUNNEL_PID_FILE="/tmp/ssh_tunnel.pid"

# Créer le fichier de clé SSH (fourni par Render en variable d'env)
if [ -z "$SSH_PRIVATE_KEY" ]; then
  echo "❌ ERROR: SSH_PRIVATE_KEY environment variable not set"
  exit 1
fi

echo "$SSH_PRIVATE_KEY" > "$SSH_KEY_PATH"
chmod 600 "$SSH_KEY_PATH"

# Arrêter le tunnel existant s'il existe
if [ -f "$TUNNEL_PID_FILE" ]; then
  old_pid=$(cat "$TUNNEL_PID_FILE")
  if kill -0 "$old_pid" 2>/dev/null; then
    echo "Stopping existing SSH tunnel (PID: $old_pid)"
    kill "$old_pid"
    sleep 1
  fi
fi

# Lancer le tunnel
echo "🔗 Establishing SSH tunnel to Paris 8..."
ssh -i "$SSH_KEY_PATH" \
  -N \
  -L "$LOCAL_PORT:$REMOTE_MYSQL_HOST:$REMOTE_MYSQL_PORT" \
  -p "$REMOTE_PORT" \
  -o "StrictHostKeyChecking=no" \
  -o "UserKnownHostsFile=/dev/null" \
  -o "ServerAliveInterval=60" \
  -o "ServerAliveCountMax=3" \
  "$REMOTE_HOST" &

TUNNEL_PID=$!
echo $TUNNEL_PID > "$TUNNEL_PID_FILE"

echo "✅ SSH tunnel established (PID: $TUNNEL_PID)"
echo "📡 MySQL accessible at: localhost:3306"

# Garder le tunnel actif
wait $TUNNEL_PID
