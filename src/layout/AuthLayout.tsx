/**
 * AuthLayout - Layout pour les pages d'authentification
 * Design centré pour login, register, forgot password, etc.
 */

import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export interface AuthLayoutProps {
  showBackButton?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ showBackButton = true }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex flex-col">
      {/* Header */}
      <header className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <span className="text-2xl" aria-hidden="true">
              ♿
            </span>
            <span>TalentConnect</span>
          </Link>

          {/* Back Button */}
          {showBackButton && (
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour à l'accueil</span>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <Outlet />
          </div>

          {/* Accessibility Statement */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Cette plateforme est conçue pour être accessible à tous.
              <br />
              <a
                href="/legal/accessibility"
                className="text-indigo-600 hover:text-indigo-700 underline"
              >
                En savoir plus sur notre engagement
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} TalentConnect. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
