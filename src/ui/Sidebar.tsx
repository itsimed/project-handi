/**
 * Sidebar Component - Barre latérale de navigation pour les dashboards
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

export interface SidebarLink {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

export interface SidebarSection {
  title?: string;
  links: SidebarLink[];
}

export interface SidebarProps {
  sections: SidebarSection[];
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ sections, className = '' }) => {
  const location = useLocation();

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <aside
      className={`w-64 bg-white border-r border-gray-200 h-full overflow-y-auto ${className}`}
      aria-label="Navigation latérale"
    >
      <nav className="p-4 space-y-6">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {/* Section Title */}
            {section.title && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
            )}

            {/* Section Links */}
            <div className="space-y-1">
              {section.links.map((link) => {
                const Icon = link.icon;
                const isActive = isActivePath(link.href);

                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`
                      flex items-center justify-between gap-3 px-3 py-2 rounded-lg
                      text-sm font-medium transition-colors duration-200
                      ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span
                        className={`
                          px-2 py-0.5 text-xs font-semibold rounded-full
                          ${
                            isActive
                              ? 'bg-indigo-100 text-indigo-600'
                              : 'bg-gray-100 text-gray-600'
                          }
                        `}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
