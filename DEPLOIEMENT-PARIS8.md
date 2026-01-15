# Guide de déploiement - Hébergement Paris 8

## 🎓 Votre hébergement

**Serveur** : handiman.univ-paris8.fr  
**Type** : Hébergement mutualisé Apache/PHP  
**Base de données** : MySQL (p27_imed)  
**SSH Port** : 60022 (non standard)

---

## ⚠️ Important : Limitation de l'hébergement

Votre hébergement Paris 8 est un serveur web **Apache/PHP classique**. Il ne supporte **pas Node.js** directement.

**Solutions possibles :**

### Option 1 : Frontend uniquement (recommandé pour commencer)
Déployer uniquement le frontend React en version statique. Les données seront simulées côté navigateur.

### Option 2 : Backend sur un service externe gratuit
- Frontend sur Paris 8
- Backend sur Render.com, Railway.app ou Vercel (gratuit)

### Option 3 : Demander accès serveur Node.js
Contacter le service informatique de Paris 8 pour un accès serveur dédié.

---

## 🚀 Déploiement Frontend (Option 1 - Immédiat)

### Méthode A : Script automatique

```bash
chmod +x deploy-paris8.sh
./deploy-paris8.sh
```

### Méthode B : Manuel avec WinSCP

1. **Téléchargez WinSCP** : https://winscp.net/

2. **Configurez la connexion** :
   - Protocole : SFTP
   - Hôte : handiman.univ-paris8.fr
   - Port : 60022
   - Nom d'utilisateur : imed
   - Mot de passe : Those4-Bony0-Studied8-Evasive4

3. **Build du projet** :
```bash
cd frontend
npm run build
```

4. **Uploadez le contenu de `frontend/dist/`** vers `/public_html/`

5. **Créez un fichier `.htaccess`** dans public_html :
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /~imed/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /~imed/index.html [L]
</IfModule>
```

6. **Site accessible** : https://handiman.univ-paris8.fr/~imed/

---

## 🔧 Configuration pour frontend standalone

Pour que le frontend fonctionne sans backend, il faut le configurer en mode démo.

**Créez** `frontend/.env.production.local` :
```env
VITE_API_URL=
VITE_DEMO_MODE=true
```

Puis rebuild :
```bash
cd frontend
npm run build
```

---

## 🌐 Déploiement Backend (Option 2 - Backend externe)

### A. Sur Render.com (gratuit)

1. **Créez un compte** : https://render.com

2. **New Web Service** :
   - Repository : Uploadez votre code sur GitHub
   - Build Command : `cd backend && npm install && npx prisma generate`
   - Start Command : `cd backend && npm start`

3. **Variables d'environnement** :
```
DATABASE_URL=mysql://imed:kotukvodrovbew2@handiman.univ-paris8.fr:3306/p27_imed
JWT_SECRET=ProjectHandi2026SecureSecret!Paris8
PORT=10000
FRONTEND_URL=https://handiman.univ-paris8.fr/~imed
```

4. **Notez l'URL** du backend (ex: `https://votre-app.onrender.com`)

5. **Mettez à jour frontend/.env.production** :
```env
VITE_API_URL=https://votre-app.onrender.com/api/v1
```

6. **Rebuild et redéployez le frontend**

---

## 🗄️ Configuration Base de données MySQL

Votre base de données existe déjà :
- Host : localhost (depuis le serveur Paris 8)
- Database : p27_imed
- User : imed
- Password : kotukvodrovbew2

### Migration Prisma vers MySQL

Le schema.prisma a été modifié pour MySQL. Pour créer les tables :

```bash
# En local
cd backend
npm install
npx prisma generate
npx prisma db push
```

Ou directement sur phpMyAdmin de Paris 8 en exécutant le SQL généré.

---

## 📝 Commandes SSH utiles

### Connexion SSH
```bash
ssh -p 60022 imed@handiman.univ-paris8.fr
```

### Upload fichiers
```bash
scp -P 60022 fichier.txt imed@handiman.univ-paris8.fr:~/public_html/
```

### Upload dossier complet
```bash
scp -P 60022 -r frontend/dist/* imed@handiman.univ-paris8.fr:~/public_html/
```

---

## ✅ Vérifications

- [ ] Frontend accessible : https://handiman.univ-paris8.fr/~imed/
- [ ] Fichier .htaccess présent
- [ ] Toutes les ressources (CSS, JS, images) chargent
- [ ] Navigation fonctionne (React Router)
- [ ] Backend déployé (si option 2 choisie)
- [ ] Base de données MySQL configurée

---

## 🐛 Dépannage

### Erreur 404 sur les sous-pages
→ Vérifiez le fichier .htaccess et RewriteBase

### Ressources CSS/JS ne chargent pas
→ Vérifiez le chemin de base dans index.html (doit être `/~imed/`)

### "Mixed Content" (HTTP/HTTPS)
→ Assurez-vous que l'API backend est en HTTPS

### Base de données inaccessible
→ MySQL est en localhost, accessible uniquement depuis le serveur Paris 8

---

## 📞 Support

Pour un accès Node.js sur le serveur Paris 8 :
- Service informatique : informatique@univ-paris8.fr
- Demandez un conteneur Docker ou accès serveur dédié

---

## 🎯 Recommandation

**Pour une démo rapide** : Utilisez l'Option 1 (frontend seul)  
**Pour une vraie application** : Utilisez l'Option 2 (backend Render.com)
