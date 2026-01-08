# 🧪 GUIDE DE TEST - INSCRIPTION & CONNEXION

## ✅ Ce qui a été fait

### **1. Page RegisterPage créée**
- ✅ Formulaire d'inscription complet
- ✅ Validation des champs
- ✅ Toggle mot de passe
- ✅ Confirmation mot de passe
- ✅ Choix du rôle (Candidat/Recruteur)
- ✅ Messages d'erreur contextuels
- ✅ Loading states
- ✅ Accessibilité RGAA complète

### **2. Routes ajoutées**
- ✅ `/login` - LoginPage (connexion + inscription)
- ✅ `/register` - RegisterPage (inscription dédiée)

### **3. Backend déjà configuré**
- ✅ `POST /api/v1/auth/register` - Endpoint d'inscription
- ✅ `POST /api/v1/auth/login` - Endpoint de connexion
- ✅ Hashage bcrypt des mots de passe
- ✅ Génération JWT
- ✅ Vérification email unique

---

## 🚀 COMMENT TESTER

### **OPTION 1 : Page d'inscription dédiée**

1. **Accédez à** : http://localhost:5173/register

2. **Remplissez le formulaire** :
   - Choisissez "Candidat·e" ou "Recruteur·euse"
   - Prénom : `Jean`
   - Nom : `Martin`
   - Email : `jean.martin.test@example.com`
   - Mot de passe : `password123`
   - Confirmer : `password123`

3. **Cliquez sur "Créer mon compte"**

4. **Résultat attendu** :
   - ✅ Message de succès vert
   - ✅ Redirection automatique vers `/login` après 2 secondes
   - ✅ Compte créé dans la base de données

5. **Connectez-vous** :
   - Email : `jean.martin.test@example.com`
   - Mot de passe : `password123`

---

### **OPTION 2 : LoginPage avec mode inscription**

1. **Accédez à** : http://localhost:5173/login

2. **Cliquez sur** "Pas encore de compte ? S'inscrire"

3. **Le formulaire bascule** en mode inscription

4. **Remplissez** et testez

---

## 🧪 TESTS DE VALIDATION

### **Test 1 : Email invalide**
```
Email : "test" (sans @)
Résultat : ❌ "L'adresse email n'est pas valide."
```

### **Test 2 : Mot de passe trop court**
```
Mot de passe : "123"
Résultat : ❌ "Le mot de passe doit contenir au moins 6 caractères."
```

### **Test 3 : Mots de passe différents**
```
Mot de passe : "password123"
Confirmer : "password456"
Résultat : ❌ "Les mots de passe ne correspondent pas."
```

### **Test 4 : Email déjà utilisé**
```
Email : "marie.dupont@example.com" (déjà dans la BDD)
Résultat : ❌ "Cet email est déjà utilisé."
```

### **Test 5 : Champs vides**
```
Laissez un champ vide
Résultat : ❌ "Ce champ est requis."
```

### **Test 6 : Inscription réussie**
```
Tous les champs valides
Résultat : ✅ "Inscription réussie ! Vous allez être redirigé..."
```

---

## 🔍 VÉRIFIER DANS LA BASE DE DONNÉES

### **Méthode 1 : Prisma Studio**
```bash
cd backend
npx prisma studio
```
- Ouvre http://localhost:5555
- Allez dans la table `User`
- Vérifiez que votre utilisateur est créé

### **Méthode 2 : Logs backend**
Regardez dans le terminal backend :
```
🚀 Server is flying on port 5000
```

Si l'inscription réussit, aucune erreur n'apparaîtra.

---

## 🎨 FONCTIONNALITÉS VISUELLES

### **RegisterPage**
- ✅ **Choix du rôle** : 2 boutons avec icônes (👤 Candidat, 💼 Recruteur)
- ✅ **Toggle mot de passe** : Icône œil pour voir/masquer
- ✅ **Messages d'erreur** : Bordures rouges + texte explicatif
- ✅ **Messages de succès** : Bandeau vert avec icône ✓
- ✅ **Loading** : Spinner + "Création du compte..."
- ✅ **Liens** : Vers connexion et accueil

### **LoginPage**
- ✅ **Mode dual** : Bascule connexion ↔ inscription
- ✅ **Validation** : En temps réel
- ✅ **Comptes de test** : Affichés en bas

---

## 📱 RESPONSIVE

Testez sur différentes tailles :

- **Mobile (375px)** : Layout vertical, tout accessible
- **Tablet (768px)** : Grid 2 colonnes pour prénom/nom
- **Desktop (1024px+)** : Centré, max-width 672px

---

## ♿ ACCESSIBILITÉ (RGAA)

### **Tests clavier**
1. Appuyez sur `Tab` pour naviguer
2. Tous les champs doivent être accessibles
3. Le focus doit être visible (anneau bleu)
4. `Enter` sur les boutons doit fonctionner

### **Tests lecteur d'écran**
1. Activez NVDA (Windows) ou VoiceOver (Mac)
2. Les labels doivent être annoncés
3. Les erreurs doivent être lues (`role="alert"`)
4. Les champs requis doivent indiquer "requis"

---

## 🐛 DÉPANNAGE

### **Erreur : "Network Error"**
- ✅ Vérifiez que le backend tourne sur port 5000
- ✅ Vérifiez `apiClient.ts` : baseURL = `http://localhost:5000/api/v1`

### **Erreur : "Cet email est déjà utilisé"**
- ✅ Normal si vous utilisez un email existant
- ✅ Utilisez un email différent

### **Redirection ne fonctionne pas**
- ✅ Vérifiez que `ROUTES` dans `constants/index.ts` est correct
- ✅ Vérifiez les routes dans `App.tsx`

---

## 📊 FLUX COMPLET

```
┌─────────────────────────────────────────────────────┐
│  1. Utilisateur remplit le formulaire              │
│     ↓                                               │
│  2. Validation côté client (utils)                 │
│     ↓                                               │
│  3. Appel authService.register()                   │
│     ↓                                               │
│  4. POST /api/v1/auth/register                     │
│     ↓                                               │
│  5. Backend : vérification email unique            │
│     ↓                                               │
│  6. Backend : hashage mot de passe (bcrypt)        │
│     ↓                                               │
│  7. Backend : création utilisateur (Prisma)        │
│     ↓                                               │
│  8. Backend : retourne succès                      │
│     ↓                                               │
│  9. Frontend : message succès                      │
│     ↓                                               │
│  10. Redirection vers /login après 2s              │
└─────────────────────────────────────────────────────┘
```

---

## ✨ PROCHAINES ÉTAPES

Après avoir testé l'inscription :

1. **Testez la connexion** avec le compte créé
2. **Vérifiez le token** dans localStorage
3. **Accédez au Dashboard** (protégé)
4. **Testez la déconnexion**

---

**🎉 Tout est prêt ! Commencez vos tests !**

Accédez à : **http://localhost:5173/register**
