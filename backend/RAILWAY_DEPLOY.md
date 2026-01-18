# Déploiement Backend sur Railway

## Prérequis
- Compte Railway actif
- Base de données PostgreSQL Railway configurée

## Variables d'environnement à configurer sur Railway

### Obligatoires
```
DATABASE_URL=<Railway PostgreSQL Connection String>
JWT_SECRET=<votre-clé-secrète-unique-et-longue>
NODE_ENV=production
```

### Optionnelles
```
PORT=<Railway configure automatiquement>
FRONTEND_URL=https://votre-domaine-frontend.com
API_URL=https://votre-backend.railway.app/api/v1
```

## Configuration Railway

### 1. Build Command
Railway détectera automatiquement via `package.json`:
```
npm install && npm run build
```

### 2. Start Command
**Pour réparer automatiquement les migrations:**
```
npm run start:railway
```

**Ou standard (après avoir résolu manuellement):**
```
npm start
```

### 3. Migrations Base de Données
Après le premier déploiement, exécuter dans Railway CLI:
```bash
npx prisma migrate deploy
```

## Points de vérification

✅ **Port dynamique**: Le code utilise `process.env.PORT || 4000`
✅ **Prisma Generate**: Script `postinstall` configuré
✅ **Binary Targets**: Configurés pour Linux (Railway)
✅ **PostgreSQL**: Schema configuré pour PostgreSQL
✅ **Variables d'env**: Chargement avec dotenv

## Healthcheck
Endpoint disponible: `GET /`
Réponse attendue:
```json
{
  "status": "Online",
  "message": "API Project Handi Backend"
}
```

## Structure des migrations
Les migrations Prisma sont versionnées dans `/prisma/migrations/`
Railway les appliquera automatiquement avec `prisma migrate deploy`

## Logs
Les logs sont accessibles via Railway Dashboard ou CLI:
```bash
railway logs
```
