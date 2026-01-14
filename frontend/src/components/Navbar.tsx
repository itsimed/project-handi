/**
 * Navbar - Barre de navigation améliorée
 * - Boutons occupent toute la hauteur de la navbar
 * - Indicateur de page active en bas
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { STORAGE_KEYS } from '../constants';
import { UserAvatar } from './UserAvatar';
import { UserMenu } from './UserMenu';
import { useTheme } from '../contexts/AccessibilityContext';

interface NavbarProps {
  variant?: 'home' | 'dashboard' | 'profile' | 'recruiter';
}

export const Navbar = ({ variant = 'home' }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  const user = userData ? JSON.parse(userData) : null;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    navigate('/');
  };

  const handleNavigateToDashboard = () => {
    if (user?.role === 'RECRUITER') {
      navigate('/recruteur/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const { colors, theme } = useTheme();

  // Vérifier si un chemin est actif
  const isActive = (path: string) => location.pathname === path;

  // Si l'utilisateur n'est pas connecté, afficher seulement le header simple
  if (!isLoggedIn) {
    return (
      <header className="transition-all duration-300 h-16 relative z-50" style={{ backgroundColor: colors.bg, borderBottom: `1px solid ${colors.border}33` }}>
        <div className="container mx-auto px-6 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo à gauche */}
            <button
              onClick={() => navigate('/')}
              className="group focus:outline-none focus:ring-2 rounded-lg p-2 -ml-2"
              aria-label="Retour à l'accueil"
            >
              <img 
                src={theme === 'dark' ? '/logo sombre.webp' : '/logo clair.webp'}
                alt="Project Handi"
                className="h-20"
              />
            </button>

            {/* Boutons connexion/inscription à droite */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="group px-6 py-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 rounded-lg border-2 hover:scale-105 hover:shadow-lg"
                style={{ 
                  backgroundColor: theme === 'dark' ? '#FFFFFF' : '#23022E',
                  color: theme === 'dark' ? '#23022E' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#23022E' : '#FFFFFF'
                }}
                aria-label="Créer un nouveau compte"
              >
                Inscription
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="group px-6 py-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 rounded-lg border-2 hover:scale-105 hover:shadow-lg"
                style={{ 
                  backgroundColor: colors.bg,
                  color: colors.text,
                  borderColor: colors.border
                }}
                aria-label="Se connecter"
              >
                Connexion
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Si l'utilisateur est connecté, afficher la navbar complète
  return (
    <header className="transition-all duration-300 h-16 relative z-50" style={{ backgroundColor: colors.bg, borderBottom: `1px solid ${colors.border}33` }}>
      <div className="container mx-auto px-6 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="group focus:outline-none focus:ring-2 rounded-lg p-2 -ml-2"
            aria-label="Retour à l'accueil"
          >
            <img 
              src={theme === 'dark' ? '/logo sombre.webp' : '/logo clair.webp'}
              alt="Project Handi"
              className="h-20"
            />
          </button>

          {/* Navigation */}
          <div className="flex items-center gap-4 h-full">
            <nav aria-label="Navigation principale" className="flex items-center h-full -mb-px">
              {/* Dashboard/Offres - Pour tous les utilisateurs */}
              <button
                type="button"
                onClick={handleNavigateToDashboard}
                className={`relative flex items-center gap-2 px-4 h-full transition-all duration-200 font-medium focus:outline-none focus:ring-2 rounded-lg hover:scale-105 ${
                  isActive('/dashboard') || isActive('/recruteur/dashboard') ? '' : ''
                }`}
                style={{ 
                  color: colors.text,
                  opacity: (isActive('/dashboard') || isActive('/recruteur/dashboard')) ? 1 : 0.7
                }}
                aria-label="Voir les offres"
              >
                <span>Offres</span>
                {(isActive('/dashboard') || isActive('/recruteur/dashboard')) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: colors.text }}></span>
                )}
              </button>

              {/* Publier une offre (recruteurs uniquement) */}
              {user?.role === 'RECRUITER' && (
                <button
                  type="button"
                  onClick={() => navigate('/recruteur/publier-offre')}
                  className={`relative flex items-center gap-2 px-4 h-full transition-all duration-200 font-medium focus:outline-none focus:ring-2 rounded-lg hover:scale-105 ${
                    isActive('/recruteur/publier-offre') ? '' : ''
                  }`}
                  style={{ 
                    color: colors.text,
                    opacity: isActive('/recruteur/publier-offre') ? 1 : 0.7
                  }}
                  aria-label="Publier une offre"
                >
                  <span>Publier une offre</span>
                  {isActive('/recruteur/publier-offre') && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: colors.text }}></span>
                  )}
                </button>
              )}
            </nav>

            {/* Menu utilisateur */}
            <div className="relative flex items-center z-50">
              <UserAvatar
                firstName={user?.firstName || ''}
                lastName={user?.lastName || ''}
                role={user?.role || 'APPLICANT'}
                isExpanded={isMenuOpen}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
              <UserMenu
                user={{
                  firstName: user?.firstName || '',
                  lastName: user?.lastName || '',
                  role: user?.role || 'APPLICANT',
                }}
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
