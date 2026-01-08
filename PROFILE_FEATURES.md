# Nouvelles fonctionnalités - Page Profil

## ✅ Fonctionnalités implémentées

### 1. Affichage entreprise pour les recruteurs
- **Frontend** : [ProfilePage.tsx](frontend/src/pages/ProfilePage.tsx)
  - Nouveau champ "Entreprise" visible uniquement pour les recruteurs
  - Icône bâtiment + nom de l'entreprise
  - Champ en lecture seule (non modifiable)
  - Affichage conditionnel : `{user.role === 'RECRUITER' && companyName && (...)}`

- **Type** : [types/index.ts](frontend/src/types/index.ts)
  - Ajout de `company?: Company | null` dans l'interface User
  - Permet de récupérer les données de l'entreprise liée

### 2. Suppression de compte
- **Frontend** : [ProfilePage.tsx](frontend/src/pages/ProfilePage.tsx)
  - Section "Zone dangereuse" avec bouton rouge en bas de page
  - Modal de confirmation avec :
    - Avertissement clair et visible
    - Liste des conséquences (données, candidatures, offres)
    - Boutons Annuler / Supprimer
    - Animation de chargement pendant la suppression
  - Déconnexion automatique après suppression
  - Redirection vers la page d'accueil

- **Backend** :
  - **Route** : `DELETE /api/v1/users/:id` ([userRoutes.ts](backend/src/routes/userRoutes.ts))
  - **Contrôleur** : `deleteUserController` ([userController.ts](backend/src/controllers/userController.ts))
    - Vérification : utilisateur peut uniquement supprimer son propre compte
    - Sécurité : authentification requise via `authenticateToken`
  
  - **Service** : `deleteUser(userId)` ([userService.ts](backend/src/services/userService.ts))
    - Suppression en cascade complète :
      1. Suppression des candidatures de l'utilisateur
      2. Si RECRUITER : suppression de toutes les candidatures liées à ses offres
      3. Si RECRUITER : suppression de toutes ses offres d'emploi
      4. Suppression de l'utilisateur

## 🔒 Sécurité

- ✅ Authentification requise (token JWT)
- ✅ Vérification : utilisateur ne peut supprimer que son propre compte
- ✅ Double confirmation avant suppression
- ✅ Suppression en cascade pour éviter les données orphelines

## 📊 Données supprimées

### Pour tous les utilisateurs :
- Compte utilisateur (email, mot de passe, infos personnelles)
- Toutes les candidatures de l'utilisateur

### Pour les recruteurs :
- Toutes les offres d'emploi publiées
- Toutes les candidatures reçues sur ces offres

## 🎨 Interface utilisateur

### Modal de confirmation :
- Fond sombre avec flou (backdrop-blur)
- Carte rouge avec bordure
- Icône d'avertissement
- Message clair et explicite
- Liste des conséquences
- Boutons bien espacés
- Animation de chargement

### Zone dangereuse :
- Fond rouge/5 (très discret)
- Bordure rouge/20
- Icône d'alerte
- Titre "Zone dangereuse"
- Texte explicatif
- Bouton rouge avec hover blanc

## 🧪 Test

Pour tester :
1. Se connecter sur http://localhost:5173/login
2. Aller sur /profil
3. Scroller en bas de la page
4. Cliquer sur "Supprimer mon compte définitivement"
5. Lire le modal de confirmation
6. Cliquer sur "Supprimer définitivement"
7. Vérifier la redirection vers la page d'accueil
8. Essayer de se reconnecter avec les mêmes identifiants → devrait échouer

## 📝 Notes techniques

- L'API utilise `apiClient.delete()` qui ajoute automatiquement le token JWT
- Le modal utilise un portail React via `position: fixed` et `z-index: 50`
- La suppression est transactionnelle : soit tout réussit, soit rien
- Les erreurs sont catchées et affichées à l'utilisateur
