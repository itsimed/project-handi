/**
 * Navbar - Barre de navigation améliorée
 * - Boutons occupent toute la hauteur de la navbar
 * - Indicateur de page active en bas
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { STORAGE_KEYS } from '../constants';
import { UserAvatar } from './UserAvatar';
import { UserMenu } from './UserMenu';
import { MenuIcon, CloseIcon } from './icons';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fermer le menu mobile quand on change de page
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Empêcher le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

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

  // Vérifier si un chemin est actif
  const isActive = (path: string) => location.pathname === path;

  // Si l'utilisateur n'est pas connecté, afficher seulement le header simple
  if (!isLoggedIn) {
    return (
      <header className="backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/50 transition-all duration-300 h-16 relative z-50">
        <div className="container mx-auto px-4 sm:px-6 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo à gauche */}
            <button
              onClick={() => navigate('/')}
              className="group focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-lg p-2 -ml-2"
            >
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Project Handi
              </h1>
            </button>

            {/* Boutons connexion/inscription à droite */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="px-3 sm:px-6 py-2 text-sm sm:text-base font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 hover:from-emerald-500/20 hover:to-teal-500/20 rounded-lg"
                aria-label="Créer un nouveau compte"
              >
                <span className="hidden sm:inline">Inscription</span>
                <span className="sm:hidden">Insc.</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="px-3 sm:px-6 py-2 text-sm sm:text-base font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 rounded-lg"
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
    <>
      <header className="backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/50 transition-all duration-300 h-16 relative z-50">
        <div className="container mx-auto px-4 sm:px-6 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo & Brand */}
            <button
              onClick={() => navigate('/')}
              className="group text-left focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-lg p-2 -ml-2 h-full"
            >
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Project Handi
              </h1>
              <p className="hidden sm:block text-xs text-slate-400 font-medium">
                {variant === 'profile' ? 'Mon profil' : 
                 variant === 'recruiter' ? 'Espace recruteur' : 
                 'Recrutement inclusif'}
              </p>
            </button>

            {/* Navigation Desktop - Masquée sur mobile */}
            <div className="hidden lg:flex items-center gap-4 h-full">
              <nav aria-label="Navigation principale" className="flex items-center h-full -mb-px">
                {/* Dashboard/Offres - Pour tous les utilisateurs */}
                <button
                  type="button"
                  onClick={handleNavigateToDashboard}
                  className={`relative flex items-center gap-2 px-4 h-full text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isActive('/dashboard') || isActive('/recruteur/dashboard') ? 'text-white' : ''
                  }`}
                  aria-label="Voir les offres"
                >
                  <span>Offres</span>
                  {(isActive('/dashboard') || isActive('/recruteur/dashboard')) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500"></span>
                  )}
                </button>

                {/* Publier une offre (recruteurs uniquement) */}
                {user?.role === 'RECRUITER' && (
                  <button
                    type="button"
                    onClick={() => navigate('/recruteur/publier-offre')}
                    className={`relative flex items-center gap-2 px-4 h-full text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      isActive('/recruteur/publier-offre') ? 'text-white' : ''
                    }`}
                    aria-label="Publier une offre"
                  >
                    <span>Publier une offre</span>
                    {isActive('/recruteur/publier-offre') && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500"></span>
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

            {/* Bouton menu hamburger mobile */}
            <div className="lg:hidden flex items-center gap-3">
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
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-lg"
                aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <CloseIcon size={24} aria-hidden="true" />
                ) : (
                  <MenuIcon size={24} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu mobile drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div
            className="fixed top-16 left-0 right-0 bottom-0 bg-slate-900 z-50 lg:hidden overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
          >
            <nav className="flex flex-col p-6 space-y-4">
              {/* Dashboard/Offres */}
              <button
                type="button"
                onClick={() => {
                  handleNavigateToDashboard();
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  isActive('/dashboard') || isActive('/recruteur/dashboard')
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Offres
              </button>

              {/* Publier une offre (recruteurs uniquement) */}
              {user?.role === 'RECRUITER' && (
                <button
                  type="button"
                  onClick={() => {
                    navigate('/recruteur/publier-offre');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isActive('/recruteur/publier-offre')
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Publier une offre
                </button>
              )}

              {/* Séparateur */}
              <div className="border-t border-slate-700 my-2" />

              {/* Lien vers profil */}
              <button
                type="button"
                onClick={() => {
                  navigate('/profil');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-4 py-3 rounded-lg font-medium text-slate-300 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                Mon profil
              </button>

              {/* Lien vers candidatures/offres selon le rôle */}
              <button
                type="button"
                onClick={() => {
                  if (user?.role === 'RECRUITER') {
                    navigate('/recruteur/dashboard');
                  } else {
                    navigate('/mes-candidatures');
                  }
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-4 py-3 rounded-lg font-medium text-slate-300 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {user?.role === 'RECRUITER' ? 'Mes offres' : 'Mes candidatures'}
              </button>

              {/* Lien vers paramètres */}
              <button
                type="button"
                onClick={() => {
                  navigate('/parametres');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-4 py-3 rounded-lg font-medium text-slate-300 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                Paramètres
              </button>

              {/* Séparateur */}
              <div className="border-t border-slate-700 my-2" />

              {/* Déconnexion */}
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-4 py-3 rounded-lg font-medium text-red-400 hover:bg-red-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Déconnexion
              </button>
            </nav>
          </div>
        </>
      )}
    </>
  );
};
