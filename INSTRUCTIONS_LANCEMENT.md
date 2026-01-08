# 🚀 INSTRUCTIONS DE LANCEMENT - PROJECT HANDI

## ✅ Checklist avant le lancement

- [x] Node.js installé
- [x] npm installé
- [x] Dépendances backend installées
- [x] Dépendances frontend installées
- [ ] Docker Desktop installé *(en cours)*
- [ ] Docker Desktop lancé

---

## 📝 ÉTAPES APRÈS L'INSTALLATION DE DOCKER

### 1️⃣ Lancer Docker Desktop

1. Une fois Docker Desktop installé, **ouvrez-le**
2. Attendez que le message **"Docker Desktop is running"** apparaisse
3. Vérifiez en bas à gauche : le logo doit être **vert**

### 2️⃣ Lancer le projet automatiquement

Double-cliquez sur le fichier : **`start-project.bat`**

Le script va :
- ✅ Vérifier que Docker fonctionne
- ✅ Démarrer PostgreSQL
- ✅ Créer et peupler la base de données
- ✅ Lancer le backend (port 5000)
- ✅ Lancer le frontend (port 5173)

### 3️⃣ Accéder au site

Ouvrez votre navigateur sur : **http://localhost:5173**

---

## 🧪 COMPTES DE TEST

### Candidats
- **Email** : marie.dupont@example.com
- **Mot de passe** : password123

### Recruteurs
- **Email** : recruiter@techinclusion.com
- **Mot de passe** : password123

---

## 🛠️ LANCEMENT MANUEL (SI LE SCRIPT NE FONCTIONNE PAS)

### Terminal 1 - Base de données
```bash
docker compose up -d
```

### Terminal 2 - Backend
```bash
cd backend
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

### Terminal 3 - Frontend
```bash
cd frontend
npm run dev
```

---

## ❌ PROBLÈMES COURANTS

### Docker n'est pas reconnu
**Solution** : Relancez votre ordinateur après l'installation de Docker Desktop

### Port 5000 déjà utilisé
**Solution** : 
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <numéro_du_processus> /F
```

### Erreur de connexion PostgreSQL
**Solution** :
1. Vérifiez que Docker Desktop est lancé
2. Vérifiez que le conteneur fonctionne : `docker ps`
3. Redémarrez PostgreSQL : `docker compose restart`

### Le frontend ne charge pas
**Solution** :
1. Vérifiez que le backend fonctionne (http://localhost:5000)
2. Ouvrez la console navigateur (F12) pour voir les erreurs
3. Vérifiez les CORS dans `backend/src/app.ts`

---

## 📞 SUPPORT

Si vous rencontrez un problème :
1. Vérifiez les logs dans les terminaux
2. Consultez la section "Dépannage" du README.md
3. Relancez Docker Desktop et réessayez

---

**Fait avec ❤️ pour une société plus inclusive**
