# Yojob - Plateforme de Recrutement 

[![RGAA](https://img.shields.io/badge/RGAA-Conforme-green)](https://www.numerique.gouv.fr/publications/rgaa-accessibilite/)
[![WCAG 2.1](https://img.shields.io/badge/WCAG%202.1-AA-blue)](https://www.w3.org/WAI/WCAG21/quickref/)

## Installation rapide

### Pour les membres de l'équipe

**Consultez [INSTALLATION.md](INSTALLATION.md) pour le guide complet**

```bash
# 1. Cloner et installer
git clone <URL_DU_REPO>
cd project-handi
cd backend && npm install
cd ../frontend && npm install

# 2. Configurer (.env déjà prêt avec base Neon)
cd backend && cp .env.example .env
npx prisma generate

# 3. Lancer
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev
```
