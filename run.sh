#!/bin/bash
# Démarrage simple avec tunnel SSH
SSH_KEY_PATH="/tmp/render_key"
echo "$SSH_PRIVATE_KEY" | base64 -d > "$SSH_KEY_PATH" 2>/dev/null || {
  echo "Failed to decode SSH key"
  exit 1
}
chmod 600 "$SSH_KEY_PATH"
ssh -i "$SSH_KEY_PATH" -N -L 3306:localhost:3306 -p 60022 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ServerAliveInterval=60 imed@10.10.2.220 &
sleep 3
cd backend && npm start
