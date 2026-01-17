# Guide de déploiement Frontend

## Informations serveur
- **Serveur**: handiman.univ-paris8.fr / 10.10.2.220
- **Port SSH**: 60022
- **Login**: imed
- **Localisation**: ~/public_html/

## Déploiement avec SCP (Windows Git Bash)

### 1. Build du projet
```bash
npm run build -- --mode production
```

### 2. Transfert des fichiers
```bash
scp -P 60022 -r dist/* imed@handiman.univ-paris8.fr:public_html/
```

Mot de passe: `Those4-Bony0-Studied8-Evasive4`

### 3. Vérification
Site accessible à: http://handiman.univ-paris8.fr/~imed/

## Déploiement avec WinSCP (Windows)

1. Ouvrir WinSCP
2. Configuration:
   - Protocole: SFTP
   - Hôte: handiman.univ-paris8.fr
   - Port: 60022
   - Nom d'utilisateur: imed
   - Mot de passe: Those4-Bony0-Studied8-Evasive4

3. Se connecter
4. Naviguer vers `public_html/`
5. Uploader le contenu de `dist/` (tous les fichiers et dossiers)

## Configuration Vite

Le projet est configuré avec:
- **Dev**: `base: '/'`
- **Production**: `base: '/~imed/'`

Cela garantit que les chemins des assets sont corrects sur le serveur.
