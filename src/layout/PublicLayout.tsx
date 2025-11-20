/**
 * PublicLayout - Layout pour les pages publiques
 * Utilisé pour la page d'accueil et autres pages accessibles sans authentification
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../ui/Navbar';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        isAuthenticated={false}
        links={[
          { label: 'Accueil', href: '/' },
          { label: 'Offres d\'emploi', href: '/candidate/offers' },
          { label: 'Ressources', href: '/candidate/resources' },
        ]}
      />
      
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                À propos
              </h3>
              <p className="text-sm text-gray-600">
                TalentConnect est une plateforme de recrutement inclusive
                dédiée à faciliter l'accès à l'emploi pour tous.
              </p>
            </div>

            {/* For Candidates */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Pour les candidats
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="/candidate/offers" className="hover:text-indigo-600">
                    Rechercher un emploi
                  </a>
                </li>
                <li>
                  <a href="/candidate/resources" className="hover:text-indigo-600">
                    Ressources
                  </a>
                </li>
                <li>
                  <a href="/auth/register/candidate" className="hover:text-indigo-600">
                    Créer un compte
                  </a>
                </li>
              </ul>
            </div>

            {/* For Recruiters */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Pour les recruteurs
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="/recruiter/create-offer" className="hover:text-indigo-600">
                    Publier une offre
                  </a>
                </li>
                <li>
                  <a href="/auth/register/recruiter" className="hover:text-indigo-600">
                    Créer un compte
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Légal
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="/legal/privacy" className="hover:text-indigo-600">
                    Politique de confidentialité
                  </a>
                </li>
                <li>
                  <a href="/legal/terms" className="hover:text-indigo-600">
                    Conditions d'utilisation
                  </a>
                </li>
                <li>
                  <a href="/legal/accessibility" className="hover:text-indigo-600">
                    Accessibilité
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} TalentConnect. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
