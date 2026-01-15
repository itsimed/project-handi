#!/bin/bash
# tunnel-ssh-pwd.sh - Établir un tunnel SSH vers Paris 8 avec expect

REMOTE_HOST="imed@10.10.2.220"
REMOTE_PORT="60022"
SSH_PASSWORD="${SSH_PASSWORD:-}"

if [ -z "$SSH_PASSWORD" ]; then
  echo "❌ ERROR: SSH_PASSWORD environment variable not set"
  exit 1
fi

echo "🔗 Establishing SSH tunnel to Paris 8..."

# Créer un script expect temporaire
EXPECT_SCRIPT="/tmp/ssh_tunnel_$$.exp"
cat > "$EXPECT_SCRIPT" << 'EXPECT_EOF'
#!/usr/bin/expect
set timeout 10
set password [lindex $argv 0]
set host [lindex $argv 1]
set port [lindex $argv 2]

spawn ssh -N -L 3306:localhost:3306 -p $port -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ServerAliveInterval=60 $host

expect {
    "password:" {
        send "$password\r"
        interact
    }
    timeout {
        puts "SSH connection timeout"
        exit 1
    }
}
EXPECT_EOF

chmod +x "$EXPECT_SCRIPT"

# Essayer avec expect
if command -v expect &> /dev/null; then
  echo "✅ Using expect for SSH connection"
  expect "$EXPECT_SCRIPT" "$SSH_PASSWORD" "$REMOTE_HOST" "$REMOTE_PORT" &
  TUNNEL_PID=$!
  sleep 2
  
  if kill -0 $TUNNEL_PID 2>/dev/null; then
    echo "✅ SSH tunnel established (PID: $TUNNEL_PID)"
    echo "📡 MySQL accessible at: localhost:3306"
  else
    echo "⚠️ SSH tunnel may have failed"
  fi
else
  echo "❌ expect not found - cannot establish SSH tunnel"
  exit 1
fi

# Cleanup
trap "rm -f $EXPECT_SCRIPT" EXIT

# Garder le tunnel actif
wait $TUNNEL_PID



