#!/bin/bash
# tunnel-ssh-pwd.sh - Établir un tunnel SSH vers Paris 8

set -e

REMOTE_HOST="imed@10.10.2.220"
REMOTE_PORT="60022"
SSH_PASSWORD="${SSH_PASSWORD:-}"

if [ -z "$SSH_PASSWORD" ]; then
  echo "❌ ERROR: SSH_PASSWORD environment variable not set"
  exit 1
fi

echo "🔗 Establishing SSH tunnel to Paris 8..."

# Installer sshpass si nécessaire
if ! command -v sshpass &> /dev/null; then
  echo "📦 Installing sshpass..."
  apt-get update -qq 2>/dev/null || true
  apt-get install -y sshpass 2>/dev/null || echo "⚠️ sshpass install failed"
fi

# Lancer le tunnel
sshpass -p "$SSH_PASSWORD" ssh \
  -N \
  -L 3306:localhost:3306 \
  -p "$REMOTE_PORT" \
  -o StrictHostKeyChecking=no \
  -o UserKnownHostsFile=/dev/null \
  -o ServerAliveInterval=60 \
  "$REMOTE_HOST" &

TUNNEL_PID=$!
sleep 2

echo "✅ SSH tunnel established (PID: $TUNNEL_PID)"
echo "📡 MySQL accessible at: localhost:3306"

wait $TUNNEL_PID


