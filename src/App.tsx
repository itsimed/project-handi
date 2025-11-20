/**
 * App Component - Configuration du routing principal
 * Routes pour public, auth, candidate, recruiter, organization
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout, AuthLayout, DashboardLayout } from './layout';
import HomePage from './components/HomePage';
import { ROUTES } from './constants';
import type { User, UserRole } from './types';

function App() {
  // State global pour l'authentification (temporaire - à remplacer par Context/Redux)
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* ============================================ */}
        {/* PUBLIC ROUTES */}
        {/* ============================================ */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
        </Route>

        {/* ============================================ */}
        {/* AUTH ROUTES */}
        {/* ============================================ */}
        <Route element={<AuthLayout />}>
          <Route
            path={ROUTES.LOGIN}
            element={
              <div>
                <h1 className="text-2xl font-bold mb-6">Connexion</h1>
                <p className="text-gray-600">Page de connexion à venir...</p>
              </div>
            }
          />
          <Route
            path={ROUTES.REGISTER_CANDIDATE}
            element={
              <div>
                <h1 className="text-2xl font-bold mb-6">Inscription Candidat</h1>
                <p className="text-gray-600">Formulaire d'inscription à venir...</p>
              </div>
            }
          />
          <Route
            path={ROUTES.REGISTER_RECRUITER}
            element={
              <div>
                <h1 className="text-2xl font-bold mb-6">Inscription Recruteur</h1>
                <p className="text-gray-600">Formulaire d'inscription à venir...</p>
              </div>
            }
          />
          <Route
            path={ROUTES.REGISTER_ORGANIZATION}
            element={
              <div>
                <h1 className="text-2xl font-bold mb-6">Inscription Organisme</h1>
                <p className="text-gray-600">Formulaire d'inscription à venir...</p>
              </div>
            }
          />
        </Route>

        {/* ============================================ */}
        {/* CANDIDATE DASHBOARD ROUTES */}
        {/* ============================================ */}
        <Route
          element={
            <DashboardLayout
              userRole="candidate"
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
            />
          }
        >
          <Route
            path={ROUTES.CANDIDATE_DASHBOARD}
            element={
              <div>
                <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
                <p className="text-gray-600">Bienvenue sur votre espace candidat !</p>
              </div>
            }
          />
          <Route
            path={ROUTES.CANDIDATE_PROFILE}
            element={
              <div>
                <h1 className="text-3xl font-bold mb-6">Mon profil</h1>
                <p className="text-gray-600">Gérez votre profil professionnel</p>
              </div>
            }
          />
          <Route
            path={ROUTES.CANDIDATE_OFFERS}
            element={
              <div>
                <h1 className="text-3xl font-bold mb-6">Offres d'emploi</h1>
                <p className="text-gray-600">Parcourez les offres disponibles</p>
              </div>
            }
          />
          <Route
            path={ROUTES.CANDIDATE_OFFER_DETAIL}
            element={
              <div>
                <h1 className="text-3xl font-bold mb-6">Détail de l'offre</h1>
                <p className="text-gray-600">Informations détaillées sur l'offre</p>
              </div>
            }
          />
          <Route
            path={ROUTES.CANDIDATE_APPLICATIONS}
            element={
              <div>
                <h1 className="text-3xl font-bold mb-6">Mes candidatures</h1>
                <p className="text-gray-600">Suivez vos candidatures</p>
              </div>
            }
          />
          <Route
            path={ROUTES.CANDIDATE_RESOURCES}
            element={
              <div>
                <h1 className="text-3xl font-bold mb-6">Ressources</h1>
                <p className="text-gray-600">Guides et ressources utiles</p>
              </div>
            }
          />
          <Route
            path={ROUTES.CANDIDATE_MESSAGES}
            element={
              <div>
                <h1 className="text-3xl font-bold mb-6">Messages</h1>
                <p className="text-gray-600">Vos conversations</p>
              </div>
            }
          />
        </Route>

        {/* ============================================ */}
        {/* RECRUITER DASHBOARD ROUTES */}
        {/* ============================================ */}
        <Route
          element={
            <DashboardLayout
              userRole="recruiter"
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
            />
          }
        >
          <Route
            path={ROUTES.RECRUITER_DASHBOARD}
            element={
              <div>
                <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
                <p className="text-gray-600">Bienvenue sur votre espace recruteur !</p>
              </div>
            }
          />
          <Route
            path={ROUTES.RECRUITER_CREATE_OFFER}
            element={
              <div>
                <h1 className="text-3xl font-bold mb-6">Créer une offre</h1>
                <p className="text-gray-600">Publiez une nouvelle offre d'emploi</p>
              </div>
            }
          />
          <Route
            path={ROUTES.RECRUITER_OFFERS}
            element={
              <div>
                <h1 className="text-3xl font-bold mb-6">Mes offres</h1>
                <p className="text-gray-600">Gérez vos offres publiées</p>
              </div>
            }
          />
          <Route
            path={ROUTES.RECRUITER_OFFER_DETAIL}
            element={
              <div>
                <h1 className="text-3xl font-bold mb-6">Détail de l'offre</h1>
                <p className="text-gray-600">Gérez cette offre et ses candidatures</p>
              </div>
            }
          />
          <Route
            path={ROUTES.RECRUITER_CANDIDATES}
            element={
              <div>
                <h1 className="text-3xl font-bold mb-6">Candidats</h1>
                <p className="text-gray-600">Parcourez les profils de candidats</p>
              </div>
            }
          />
          <Route
            path={ROUTES.RECRUITER_MESSAGES}
            element={
              <div>
                <h1 className="text-3xl font-bold mb-6">Messages</h1>
                <p className="text-gray-600">Communiquez avec les candidats</p>
              </div>
            }
          />
        </Route>

        {/* ============================================ */}
        {/* ORGANIZATION DASHBOARD ROUTES */}
        {/* ============================================ */}
        <Route
          element={
            <DashboardLayout
              userRole="organization"
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
            />
          }
        >
          <Route
            path={ROUTES.ORGANIZATION_DASHBOARD}
            element={
              <div>
                <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
                <p className="text-gray-600">Bienvenue sur votre espace organisme !</p>
              </div>
            }
          />
          <Route
            path={ROUTES.ORGANIZATION_RESOURCES}
            element={
              <div>
                <h1 className="text-3xl font-bold mb-6">Ressources</h1>
                <p className="text-gray-600">Gérez vos ressources publiées</p>
              </div>
            }
          />
          <Route
            path={ROUTES.ORGANIZATION_CREATE_RESOURCE}
            element={
              <div>
                <h1 className="text-3xl font-bold mb-6">Créer une ressource</h1>
                <p className="text-gray-600">Publiez une nouvelle ressource</p>
              </div>
            }
          />
          <Route
            path={ROUTES.ORGANIZATION_RESOURCE_DETAIL}
            element={
              <div>
                <h1 className="text-3xl font-bold mb-6">Détail de la ressource</h1>
                <p className="text-gray-600">Gérez cette ressource</p>
              </div>
            }
          />
        </Route>

        {/* ============================================ */}
        {/* FALLBACK - 404 */}
        {/* ============================================ */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Page non trouvée</p>
                <a href="/" className="text-indigo-600 hover:text-indigo-700 underline">
                  Retour à l'accueil
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
