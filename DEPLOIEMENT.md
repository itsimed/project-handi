# 🚀 Guide de Déploiement - Project Handi

## Prérequis sur votre serveur

### 1. Accès et connexion
```bash
ssh votre_user@votre_serveur.com
```

### 2. Installer Node.js (v18+)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Vérifier version
```

### 3. Installer PostgreSQL
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Créer la base de données
sudo -u postgres psql
```

Dans psql :
```sql
CREATE DATABASE project_handi;
CREATE USER project_handi_user WITH ENCRYPTED PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE project_handi TO project_handi_user;
\q
```

### 4. Installer PM2 (gestionnaire de processus)
```bash
sudo npm install -g pm2
```

### 5. Installer Nginx
```bash
sudo apt install nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## Configuration initiale

### 1. Créer la structure de dossiers
```bash
sudo mkdir -p /var/www/project-handi/backend
sudo mkdir -p /var/www/project-handi/frontend
sudo chown -R $USER:$USER /var/www/project-handi
```

### 2. Configurer les variables d'environnement

Éditez `backend/.env.production` :
```env
DATABASE_URL="postgresql://project_handi_user:votre_mot_de_passe@localhost:5432/project_handi?schema=public"
JWT_SECRET="VOTRE_SECRET_JWT_TRES_LONG_ET_SECURISE_123456789"
FRONTEND_URL="https://votre-domaine.com"
```

Éditez `frontend/.env.production` :
```env
VITE_API_URL=https://votre-domaine.com/api/v1
```

### 3. Configurer Nginx

```bash
sudo cp nginx.conf /etc/nginx/sites-available/project-handi

# Modifier le fichier avec votre domaine
sudo nano /etc/nginx/sites-available/project-handi

# Activer le site
sudo ln -s /etc/nginx/sites-available/project-handi /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

---

## Premier déploiement

### Méthode 1 : Script automatique (recommandé)

1. Éditez `deploy.sh` et remplacez :
   - `SERVER_USER` par votre nom d'utilisateur
   - `SERVER_HOST` par votre serveur
   - `SERVER_PATH` par le chemin sur le serveur

2. Rendez le script exécutable :
```bash
chmod +x deploy.sh
```

3. Lancez le déploiement :
```bash
./deploy.sh
```

### Méthode 2 : Manuel

#### Sur votre machine locale :

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd ../frontend
npm run build
```

#### Upload vers le serveur :

```bash
# Backend
scp -r backend/dist backend/package.json backend/.env.production backend/ecosystem.config.js user@serveur:/var/www/project-handi/backend/
scp -r backend/prisma user@serveur:/var/www/project-handi/backend/

# Frontend
scp -r frontend/dist user@serveur:/var/www/project-handi/frontend/
```

#### Sur le serveur :

```bash
ssh user@serveur

cd /var/www/project-handi/backend

# Copier la config
cp .env.production .env

# Installer dépendances
npm install --production

# Prisma
npx prisma generate
npx prisma migrate deploy

# Démarrer avec PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

---

## SSL/HTTPS avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir le certificat (remplacez votre-domaine.com)
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Renouvellement automatique (déjà configuré par défaut)
sudo certbot renew --dry-run
```

---

## Commandes utiles

### PM2 (Backend)
```bash
pm2 status                          # Statut
pm2 logs project-handi-api          # Logs en temps réel
pm2 restart project-handi-api       # Redémarrer
pm2 stop project-handi-api          # Arrêter
pm2 monit                           # Monitoring
```

### Nginx
```bash
sudo systemctl status nginx         # Statut
sudo systemctl restart nginx        # Redémarrer
sudo nginx -t                       # Tester config
sudo tail -f /var/log/nginx/project-handi-access.log   # Logs
```

### Base de données
```bash
# Se connecter
sudo -u postgres psql -d project_handi

# Backup
pg_dump -U project_handi_user project_handi > backup.sql

# Restore
psql -U project_handi_user project_handi < backup.sql
```

---

## Vérifications

✅ Backend accessible : `https://votre-domaine.com/api/v1/stats`
✅ Frontend accessible : `https://votre-domaine.com`
✅ PM2 actif : `pm2 status`
✅ Nginx actif : `sudo systemctl status nginx`
✅ PostgreSQL actif : `sudo systemctl status postgresql`

---

## Dépannage

### Le backend ne démarre pas
```bash
# Vérifier les logs
pm2 logs project-handi-api

# Vérifier la connexion DB
cd /var/www/project-handi/backend
npx prisma db pull
```

### Nginx 502 Bad Gateway
```bash
# Vérifier que le backend tourne sur le port 4000
sudo netstat -tulpn | grep 4000
pm2 status
```

### Problème de permissions
```bash
sudo chown -R $USER:$USER /var/www/project-handi
chmod -R 755 /var/www/project-handi
```

---

## Mise à jour du site

```bash
# Méthode simple
./deploy.sh

# Ou manuellement
npm run build  # localement
scp -r dist user@serveur:/var/www/project-handi/frontend/
ssh user@serveur "pm2 restart project-handi-api"
```
