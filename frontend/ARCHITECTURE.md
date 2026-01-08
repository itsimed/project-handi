# 🏗️ ARCHITECTURE DU PROJET - PROJECT HANDI

## 📁 Structure des dossiers

```
frontend/src/
├── api/                    # Configuration API
│   └── apiClient.ts       # Instance Axios configurée
│
├── assets/                 # Images, fonts, fichiers statiques
│
├── components/             # Composants React réutilisables
│   ├── Icon.tsx           # Système d'icônes SVG
│   ├── FiltersPanel.tsx   # Panneau de filtres
│   ├── OfferCard.tsx      # Carte offre d'emploi
│   ├── SearchBar.tsx      # Barre de recherche
│   ├── ProtectedRoute.tsx # Route protégée
│   └── ...
│
├── constants/              # ✨ NOUVEAU - Constantes centralisées
│   └── index.ts           # Labels, couleurs, config
│
├── hooks/                  # Custom React hooks
│   ├── useApplications.ts # Gestion candidatures
│   ├── useOfferFilters.ts # Filtres des offres
│   └── useCompanies.ts    # Gestion entreprises
│
├── pages/                  # Pages de l'application
│   ├── HomePage.tsx       # Page d'accueil
│   ├── DashboardPage.tsx  # Tableau de bord
│   ├── LoginPage.tsx      # Connexion
│   ├── OfferDetailPage.tsx      # Détail offre
│   ├── MyApplicationsPage.tsx   # Mes candidatures
│   └── ApplicationDetailPage.tsx # Détail candidature
│
├── services/               # ✨ NOUVEAU - Services API
│   └── index.ts           # authService, offerService, etc.
│
├── types/                  # ✨ NOUVEAU - Types TypeScript
│   └── index.ts           # Types partagés (Offer, User, etc.)
│
├── utils/                  # ✨ NOUVEAU - Utilitaires
│   └── index.ts           # Helpers, formatage, validation
│
├── App.tsx                 # Composant racine + routing
├── main.tsx                # Point d'entrée
└── index.css               # Styles globaux
```

---

## 🎯 Conventions de code

### **1. Imports**
Toujours dans cet ordre :
```typescript
// 1. React & libraries
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Types
import type { Offer, Application } from '../types';

// 3. Services & API
import { offerService } from '../services';

// 4. Hooks
import { useApplications } from '../hooks/useApplications';

// 5. Components
import { OfferCard } from '../components/OfferCard';

// 6. Utils & Constants
import { formatDate, getContractLabel } from '../utils';
import { ROUTES, CONTRACT_LABELS } from '../constants';

// 7. Styles
import './styles.css';
```

### **2. Nommage**

- **Fichiers** : PascalCase pour composants (`OfferCard.tsx`), camelCase pour utils (`formatDate.ts`)
- **Variables** : camelCase (`offerList`, `isLoading`)
- **Constantes** : SCREAMING_SNAKE_CASE (`API_BASE_URL`, `MAX_LENGTH`)
- **Interfaces/Types** : PascalCase (`Offer`, `Application`)
- **Functions** : camelCase, verbes (`getUserData`, `formatDate`)

### **3. Types**

✅ **UTILISER les types centralisés** :
```typescript
import type { Offer, Application, ContractType } from '../types';
```

❌ **NE PAS redéfinir** les types dans chaque fichier

### **4. Constantes**

✅ **UTILISER les constantes** :
```typescript
import { CONTRACT_LABELS, ROUTES } from '../constants';

const label = CONTRACT_LABELS[offer.contract];
navigate(ROUTES.OFFER_DETAIL(offer.id));
```

❌ **NE PAS** hardcoder :
```typescript
const label = contract === 'CDI' ? 'CDI' : 'CDD'; // ❌
navigate(`/offres/${offer.id}`); // ❌
```

### **5. Services API**

✅ **UTILISER les services** :
```typescript
import { offerService } from '../services';

const offers = await offerService.getOffers({ contract: 'CDI' });
```

❌ **NE PAS** appeler directement apiClient dans les composants :
```typescript
const response = await apiClient.get('/offers'); // ❌
```

---

## 🔄 Flux de données

```
User Action (Component)
        ↓
    Hook/Service
        ↓
    API Client (Axios)
        ↓
    Backend API
        ↓
    Database (PostgreSQL)
        ↑
    Response
        ↑
    Update State (useState)
        ↑
    Re-render Component
```

**Exemple concret** :
```typescript
// 1. Component appelle le hook
const { applyToOffer, isLoading } = useApplications();

// 2. Hook appelle le service
const applyToOffer = async (offerId: number) => {
  const result = await applicationService.applyToOffer({ offerId });
  // ...
};

// 3. Service appelle l'API
export const applicationService = {
  applyToOffer: async (data) => {
    return await apiClient.post('/applications', data);
  }
};

// 4. API Client envoie la requête HTTP
// 5. Backend traite et répond
// 6. Données remontent jusqu'au composant
```

---

## 🧩 Patterns utilisés

### **1. Custom Hooks** (Logique réutilisable)
```typescript
export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // ... logique
  return { applications, isLoading, fetchApplications };
};
```

### **2. Service Layer** (Séparation API)
```typescript
export const offerService = {
  getOffers: async (filters) => { /* ... */ },
  getOfferById: async (id) => { /* ... */ },
};
```

### **3. Type Safety** (TypeScript)
```typescript
interface OfferCardProps {
  offer: Offer;
  onApply?: (offerId: number) => void;
}
```

### **4. Centralization** (DRY - Don't Repeat Yourself)
- Types → `types/index.ts`
- Constants → `constants/index.ts`
- Utils → `utils/index.ts`

---

## ♿ Accessibilité (RGAA/WCAG AA)

### **Règles à respecter**

1. **Rôles ARIA** :
```tsx
<div role="alert" aria-live="polite">
  {error && <p>{error}</p>}
</div>
```

2. **Labels explicites** :
```tsx
<button aria-label="Postuler à cette offre">
  Postuler
</button>
```

3. **Focus visible** :
```css
.btn:focus {
  outline: 2px solid #0ea5e9;
  outline-offset: 2px;
}
```

4. **Navigation clavier** :
```tsx
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick();
  }
}}
```

5. **Contrastes** : Minimum 4.5:1 pour le texte

---

## 🚀 Bonnes pratiques

### **Performance**

- ✅ Utiliser `React.memo()` pour les composants lourds
- ✅ Lazy loading : `const Component = lazy(() => import('./Component'))`
- ✅ Éviter les re-renders inutiles avec `useCallback`, `useMemo`

### **Sécurité**

- ✅ Valider les entrées utilisateur
- ✅ Échapper le HTML : React le fait automatiquement
- ✅ Stocker les tokens en `localStorage` (OK pour ce projet)
- ✅ HTTPS en production

### **Code propre**

- ✅ Fonctions courtes (max 50 lignes)
- ✅ Composants focalisés (une responsabilité)
- ✅ Commentaires JSDoc pour les fonctions complexes
- ✅ Noms explicites (`getUserApplications` > `getData`)

---

## 📝 Exemples

### **Créer un nouveau composant**

```typescript
// components/MyComponent.tsx
import type { Offer } from '../types';
import { formatDate } from '../utils';
import { CONTRACT_LABELS } from '../constants';

interface MyComponentProps {
  offer: Offer;
  onAction?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ offer, onAction }) => {
  return (
    <div>
      <h2>{offer.title}</h2>
      <p>{CONTRACT_LABELS[offer.contract]}</p>
      <time>{formatDate(offer.createdAt)}</time>
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  );
};
```

### **Créer une nouvelle page**

```typescript
// pages/MyPage.tsx
import { useState, useEffect } from 'react';
import type { Offer } from '../types';
import { offerService } from '../services';
import { OfferCard } from '../components/OfferCard';

export const MyPage = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await offerService.getOffers();
        setOffers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (isLoading) return <div>Chargement...</div>;

  return (
    <main>
      <h1>Mes Offres</h1>
      {offers.map(offer => (
        <OfferCard key={offer.id} offer={offer} />
      ))}
    </main>
  );
};
```

---

## 🔧 Prochaines améliorations

- [ ] Context API pour l'auth (éviter prop drilling)
- [ ] React Query pour le cache des requêtes
- [ ] Tests unitaires (Jest + React Testing Library)
- [ ] Storybook pour les composants
- [ ] CI/CD avec GitHub Actions

---

**Fait avec ❤️ pour une société plus inclusive**
