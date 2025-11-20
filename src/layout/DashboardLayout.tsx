/**
 * DashboardLayout - Layout pour les espaces authentifiés
 * Avec sidebar et navigation adaptée au rôle de l'utilisateur
 */

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  MessageSquare,
  FileText,
  User,
  PlusCircle,
  BookOpen,
} from 'lucide-react';
import Navbar from '../ui/Navbar';
import Sidebar from '../ui/Sidebar';
import type { SidebarSection } from '../ui/Sidebar';
import { ROUTES } from '../constants';
import type { UserRole } from '../types';

export interface DashboardLayoutProps {
  userRole: UserRole;
  isAuthenticated: boolean;
  onLogout: () => void;
  notificationCount?: number;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  userRole,
  isAuthenticated,
  onLogout,
  notificationCount = 0,
}) => {
  // Redirection si non authentifié
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Configuration de la sidebar selon le rôle
  const getSidebarSections = (): SidebarSection[] => {
    if (userRole === 'candidate') {
      return [
        {
          title: 'Navigation',
          links: [
            {
              label: 'Tableau de bord',
              href: ROUTES.CANDIDATE_DASHBOARD,
              icon: LayoutDashboard,
            },
            {
              label: 'Mon profil',
              href: ROUTES.CANDIDATE_PROFILE,
              icon: User,
            },
            {
              label: 'Offres d\'emploi',
              href: ROUTES.CANDIDATE_OFFERS,
              icon: Briefcase,
            },
            {
              label: 'Mes candidatures',
              href: ROUTES.CANDIDATE_APPLICATIONS,
              icon: FileText,
            },
          ],
        },
        {
          title: 'Ressources',
          links: [
            {
              label: 'Ressources',
              href: ROUTES.CANDIDATE_RESOURCES,
              icon: BookOpen,
            },
            {
              label: 'Messages',
              href: ROUTES.CANDIDATE_MESSAGES,
              icon: MessageSquare,
            },
          ],
        },
      ];
    }

    if (userRole === 'recruiter') {
      return [
        {
          title: 'Navigation',
          links: [
            {
              label: 'Tableau de bord',
              href: ROUTES.RECRUITER_DASHBOARD,
              icon: LayoutDashboard,
            },
            {
              label: 'Mes offres',
              href: ROUTES.RECRUITER_OFFERS,
              icon: Briefcase,
            },
            {
              label: 'Créer une offre',
              href: ROUTES.RECRUITER_CREATE_OFFER,
              icon: PlusCircle,
            },
          ],
        },
        {
          title: 'Candidats',
          links: [
            {
              label: 'Candidats',
              href: ROUTES.RECRUITER_CANDIDATES,
              icon: Users,
            },
            {
              label: 'Messages',
              href: ROUTES.RECRUITER_MESSAGES,
              icon: MessageSquare,
            },
          ],
        },
      ];
    }

    // Organization
    return [
      {
        title: 'Navigation',
        links: [
          {
            label: 'Tableau de bord',
            href: ROUTES.ORGANIZATION_DASHBOARD,
            icon: LayoutDashboard,
          },
          {
            label: 'Ressources',
            href: ROUTES.ORGANIZATION_RESOURCES,
            icon: BookOpen,
          },
          {
            label: 'Créer une ressource',
            href: ROUTES.ORGANIZATION_CREATE_RESOURCE,
            icon: PlusCircle,
          },
        ],
      },
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        onLogout={onLogout}
        notificationCount={notificationCount}
      />

      {/* Main Content with Sidebar */}
      <div className="flex-1 flex">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block">
          <Sidebar sections={getSidebarSections()} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation - Visible only on mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {getSidebarSections()[0].links.slice(0, 4).map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-1 px-2 py-2 text-xs font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span className="truncate w-full text-center">{link.label}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default DashboardLayout;
