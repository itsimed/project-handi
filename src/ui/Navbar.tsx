/**
 * Navbar Component - Barre de navigation principale
 * Navigation responsive avec menu mobile
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, User } from 'lucide-react';
import Button from './Button';
import { ROUTES } from '../constants';

export interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface NavbarProps {
  appName?: string;
  links?: NavLink[];
  isAuthenticated?: boolean;
  userRole?: 'candidate' | 'recruiter' | 'organization';
  onLogout?: () => void;
  notificationCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({
  appName = 'TalentConnect',
  links = [],
  isAuthenticated = false,
  userRole,
  onLogout,
  notificationCount = 0,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActivePath = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Desktop Navigation */}
          <div className="flex">
            {/* Logo */}
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-2 text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <span className="text-2xl" aria-hidden="true">
                ♿
              </span>
              {appName}
            </Link>

            {/* Desktop Links */}
            {links.length > 0 && (
              <div className="hidden md:ml-8 md:flex md:gap-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`
                      inline-flex items-center gap-2 px-4 py-2 rounded-lg
                      text-sm font-medium transition-colors duration-200
                      ${
                        isActivePath(link.href)
                          ? 'text-indigo-600 bg-indigo-50'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                    aria-current={isActivePath(link.href) ? 'page' : undefined}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex md:items-center md:gap-3">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label={`Notifications ${
                    notificationCount > 0
                      ? `(${notificationCount} non lues)`
                      : ''
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span
                      className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                      aria-hidden="true"
                    >
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>

                {/* Profile */}
                <Link
                  to={
                    userRole === 'candidate'
                      ? ROUTES.CANDIDATE_PROFILE
                      : userRole === 'recruiter'
                      ? ROUTES.RECRUITER_DASHBOARD
                      : ROUTES.ORGANIZATION_DASHBOARD
                  }
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Mon profil"
                >
                  <User className="w-5 h-5" />
                </Link>

                {/* Logout */}
                <Button variant="outline" size="sm" onClick={onLogout}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER_CANDIDATE}>
                  <Button variant="primary" size="sm">
                    Inscription
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Links */}
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  text-sm font-medium transition-colors
                  ${
                    isActivePath(link.href)
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
                aria-current={isActivePath(link.href) ? 'page' : undefined}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth Actions */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={
                      userRole === 'candidate'
                        ? ROUTES.CANDIDATE_PROFILE
                        : userRole === 'recruiter'
                        ? ROUTES.RECRUITER_DASHBOARD
                        : ROUTES.ORGANIZATION_DASHBOARD
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-5 h-5" />
                    Mon profil
                  </Link>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout?.();
                    }}
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Link to={ROUTES.LOGIN} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" fullWidth>
                      Connexion
                    </Button>
                  </Link>
                  <Link to={ROUTES.REGISTER_CANDIDATE} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" fullWidth>
                      Inscription
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
