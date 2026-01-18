# ✅ Déploiement Frontend Terminé

## 📍 URLs d'accès

**Production**: http://handiman.univ-paris8.fr/~imed/
**IP directe**: http://10.10.2.220/~imed/

## 📦 Fichiers déployés

- ✅ index.html
- ✅ assets/ (CSS et JS compilés)
- ✅ Images (hero, logos, onglet)
- ✅ .htaccess (configuration Apache)

## 🔧 Configuration

### Vite (vite.config.ts)
```typescript
base: mode === 'production' ? '/~imed/' : '/'
```
- **Dev local**: Utilise `/` (http://localhost:5173/)
- **Production**: Utilise `/~imed/` (http://handiman.univ-paris8.fr/~imed/)

### Apache (.htaccess)
- ✅ RewriteBase: `/~imed/`
- ✅ Redirection SPA vers index.html
- ✅ Compression gzip
- ✅ Cache navigateur (1 an pour images, 1 mois pour CSS/JS)
- ✅ Headers de sécurité

## 🚀 Commandes de déploiement

### Build
```bash
cd frontend
npm run build -- --mode production
```

### Upload (depuis Git Bash Windows)
```bash
scp -P 60022 -r dist/* imed@10.10.2.220:public_html/
```
Mot de passe: `Those4-Bony0-Studied8-Evasive4`

### Vérification
```bash
ssh -p 60022 imed@10.10.2.220 "ls -la public_html/"
```

## 📝 Notes importantes

1. **Base path**: Le frontend est configuré pour fonctionner sous `/~imed/`
2. **API Backend**: Pointée vers Railway (voir apiClient.ts)
3. **Fichiers .htaccess**: Déjà présent sur le serveur, bien configuré
4. **React Router**: Fonctionne grâce aux règles de réécriture Apache

## 🔄 Redéploiement futur

Pour mettre à jour le site:
```bash
cd /c/Users/imedb/Desktop/val/project-handi/frontend
npm run build -- --mode production
scp -P 60022 -r dist/* imed@10.10.2.220:public_html/
```

## 🧪 Tests à effectuer

1. ✅ Accès à la page d'accueil
2. ⏳ Navigation entre les pages (React Router)
3. ⏳ Connexion/Inscription
4. ⏳ Création d'offres (recruteur)
5. ⏳ Candidature aux offres
6. ⏳ Images et assets chargés correctement
7. ⏳ API Backend (Railway) accessible

## 🛠️ Dépannage

**Si les images ne chargent pas:**
- Vérifier que le `base` dans vite.config.ts est `/~imed/`
- Rebuild avec `npm run build -- --mode production`

**Si React Router ne fonctionne pas:**
- Vérifier `.htaccess` sur le serveur
- S'assurer que `mod_rewrite` est activé sur Apache

**Si l'API ne répond pas:**
- Vérifier CORS sur Railway backend
- Vérifier l'URL dans `frontend/src/api/apiClient.ts`
