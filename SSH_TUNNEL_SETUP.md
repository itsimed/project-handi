# SSH Tunnel Configuration for Render

## Overview

The backend on Render.com will use an SSH tunnel to access MySQL on Paris 8 server, since direct MySQL connections are blocked from outside.

## Configuration Steps

### 1. Add SSH Private Key to Render Environment

Go to **Render Dashboard** → Service `yojob` → **Environment**

Add this environment variable:

```
SSH_PRIVATE_KEY=LS0tLS1CRUdJTiBPUEVOU1NIIFBSSVZBVEUgS0VZLS0tLS0KYjNCbGJuTnphQzFyWlhrdGRqRUFBQUFBQkc1dmJtVUFBQUFFYm05dVpRQUFBQUFBQUFBQkFBQUFNd0FBQUF0emMyZ3RaVwpReU5UVXhPUUFBQUNBUDdrbmhKZHFBK2dRMlFWRTdKU2RvQ0UyTCtKc0t3bUI0cDlGV2JSREdCZ0FBQUpneVlSckVNbUVhCnhBQUFBQXR6YzJndFpXUXlOVFV4T1FBQUFDQVA3a25oSmRxQStnUTJRVkU3SlNkb0NFMkwrSnNLd21CNHA5RldiUkRHQmcKQUFBRUJrUDZlTndkblZTelVvZEJ1T2xEUm5CcldHeDNuSi9jWURhYW1jZmZ6Q2VnL3VTZUVsMm9ENkJEWkJVVHNsSjJnSQpUWXY0bXdyQ1lIaW4wVlp0RU1ZR0FBQUFEbkpsYm1SbGNpMWlZV05yWlc1a0FRSURCQVVHQnc9PQotLS0tLUVORCBPUEVOU1NIIFBSSVZBVEUgS0VZLS0tLS0K
```

### 2. Update DATABASE_URL

Keep the database URL as:
```
DATABASE_URL=mysql://imed:kotukvodrovbew2@localhost:3306/p27_imed
```

This connects to the local tunnel (forwarded to Paris 8 MySQL).

### 3. Update Start Command

In Render service settings, change the **Start Command** to:

```bash
bash backend/start-with-tunnel.sh
```

Or if using `render.yaml`:

```yaml
services:
  - type: web
    name: project-handi-backend
    runtime: node
    buildCommand: npm install && npx prisma generate && npm run build
    startCommand: bash backend/start-with-tunnel.sh
```

### 4. Install SSH Client on Render

The build command should include installing openssh-client:

```bash
apt-get update && apt-get install -y openssh-client && npm install && npx prisma generate && npm run build
```

### 5. Test the Connection

Once deployed, check Render logs to ensure:
- ✅ SSH tunnel established
- ✅ Node.js server started
- ✅ API responding

## Troubleshooting

### SSH Tunnel fails to connect
- Verify SSH key is correctly encoded (base64)
- Check Paris 8 firewall allows SSH from Render IP
- Ensure `~/.ssh/authorized_keys` on Paris 8 contains the public key

### MySQL connection timeout
- Tunnel might not be fully established before Node starts
- Increase sleep time in `start-with-tunnel.sh` from 3 to 5 seconds

### Tunnel drops after deployment
- Render might auto-reboot services
- Add `ServerAliveInterval=60` to SSH config (already done)

## File Structure

```
backend/
  tunnel-ssh.sh        # Script to establish SSH tunnel
  start-with-tunnel.sh # Script to start tunnel + backend
  src/app.ts           # Express app
  package.json         # With proper start script
```

## Security Notes

⚠️ **WARNING**: Never commit the private SSH key to Git!
- Use environment variables only
- The base64 encoded key should be stored securely in Render

## Alternative: Using SSH Config

If needed, create `~/.ssh/config`:

```
Host paris8
  HostName 10.10.2.220
  Port 60022
  User imed
  IdentityFile /tmp/render_key
  ServerAliveInterval 60
```

Then simplify tunnel-ssh.sh to use:
```bash
ssh -N -L 3306:localhost:3306 paris8
```
