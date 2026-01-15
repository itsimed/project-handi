#!/bin/bash
# tunnel-ssh-pwd.sh - Établir un tunnel SSH via sshpass ou interactive SSH

REMOTE_HOST="imed@10.10.2.220"
REMOTE_PORT="60022"
SSH_PASSWORD="${SSH_PASSWORD:-}"

if [ -z "$SSH_PASSWORD" ]; then
  echo "❌ ERROR: SSH_PASSWORD environment variable not set"
  exit 1
fi

echo "🔗 Establishing SSH tunnel to Paris 8..."

# Tenter avec sshpass directement (préinstallé généralement)
SSH_TUNNEL_CMD="ssh -N -L 3306:localhost:3306 -p $REMOTE_PORT \
  -o StrictHostKeyChecking=no \
  -o UserKnownHostsFile=/dev/null \
  -o ServerAliveInterval=60 \
  -o ConnectTimeout=5 \
  $REMOTE_HOST"

# Vérifier si sshpass est disponible
if which sshpass &>/dev/null; then
  echo "✅ SSH tunnel starting with sshpass..."
  sshpass -p "$SSH_PASSWORD" $SSH_TUNNEL_CMD &
elif which expect &>/dev/null; then
  echo "✅ SSH tunnel starting with expect..."
  # Utiliser expect pour un tunnel interactif
  expect <<EOF
set timeout 10
spawn $SSH_TUNNEL_CMD
expect "password:" { send "$SSH_PASSWORD\r" }
interact
EOF
  &
else
  echo "⚠️  Installing sshpass..."
  apt-get update -qq 2>/dev/null && apt-get install -y sshpass 2>/dev/null
  if [ $? -eq 0 ]; then
    echo "✅ SSH tunnel starting..."
    sshpass -p "$SSH_PASSWORD" $SSH_TUNNEL_CMD &
  else
    echo "❌ Could not establish SSH tunnel - sshpass installation failed"
    echo "Continuing without tunnel (this will likely fail)"
  fi
fi

TUNNEL_PID=$!
sleep 3

# Vérifier si le tunnel est actif
if kill -0 $TUNNEL_PID 2>/dev/null; then
  echo "✅ SSH tunnel established (PID: $TUNNEL_PID)"
  echo "📡 MySQL accessible at: localhost:3306"
else
  echo "⚠️  SSH tunnel may have failed, but attempting to continue..."
fi

# Garder le tunnel actif
wait $TUNNEL_PID 2>/dev/null || true

