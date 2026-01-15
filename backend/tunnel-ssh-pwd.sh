#!/bin/bash
# tunnel-ssh.sh - Établir un tunnel SSH vers Paris 8 avec mot de passe

REMOTE_HOST="imed@10.10.2.220"
REMOTE_PORT="60022"
SSH_PASSWORD="${SSH_PASSWORD:-}"

if [ -z "$SSH_PASSWORD" ]; then
  echo "❌ ERROR: SSH_PASSWORD environment variable not set"
  exit 1
fi

echo "📦 Installing sshpass..."
apt-get update -qq && apt-get install -y sshpass > /dev/null 2>&1 || true

echo "🔗 Establishing SSH tunnel to Paris 8..."
sshpass -p "$SSH_PASSWORD" ssh \
  -N \
  -L 3306:localhost:3306 \
  -p "$REMOTE_PORT" \
  -o "StrictHostKeyChecking=no" \
  -o "UserKnownHostsFile=/dev/null" \
  -o "ServerAliveInterval=60" \
  "$REMOTE_HOST" &

sleep 2
echo "✅ SSH tunnel established"
echo "📡 MySQL accessible at: localhost:3306"

wait
