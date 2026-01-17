/**
 * UserMenu - Menu déroulant utilisateur accessible
 * Menu contextuel avec navigation au clavier et gestion du focus
 * Conforme WCAG 2.1 AA
 */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, BriefcaseIcon, DocumentIcon, SettingsIcon, LogoutIcon } from './icons';
import { useTheme } from '../contexts/AccessibilityContext';

interface UserMenuProps {
  user: {
    firstName: string;
    lastName: string;
    role: 'APPLICANT' | 'RECRUITER';
  };
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const UserMenu = ({ user, isOpen, onClose, onLogout }: UserMenuProps) => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Nombre d'items dans le menu
  const menuItemsCount = 4;

  // Fermeture au clic extérieur
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Gestion des touches clavier
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % menuItemsCount);
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex((prev) => (prev - 1 + menuItemsCount) % menuItemsCount);
          break;
        case 'Home':
          event.preventDefault();
          setFocusedIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setFocusedIndex(menuItemsCount - 1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus automatique sur l'item sélectionné
  useEffect(() => {
    if (isOpen && menuItemsRef.current[focusedIndex]) {
      menuItemsRef.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, isOpen]);

  // Reset du focus lors de l'ouverture
  useEffect(() => {
    if (isOpen) {
      setFocusedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogoutClick = () => {
    onLogout();
    onClose();
  };

  // Menu items différents selon le rôle
  const menuItems = [
    {
      label: 'Mon profil',
      Icon: UserIcon,
      onClick: () => handleNavigate('/profil'),
      ariaLabel: 'Accéder à mon profil',
    },
    {
      label: user.role === 'RECRUITER' ? 'Mes offres' : 'Mes candidatures',
      Icon: user.role === 'RECRUITER' ? BriefcaseIcon : DocumentIcon,
      onClick: () => handleNavigate(user.role === 'RECRUITER' ? '/recruteur/dashboard' : '/mes-candidatures'),
      ariaLabel: user.role === 'RECRUITER' ? 'Voir mes offres publiées' : 'Voir mes candidatures',
    },
    {
      label: 'Paramètres',
      Icon: SettingsIcon,
      onClick: () => handleNavigate('/parametres'),
      ariaLabel: 'Accéder aux paramètres',
    },
    {
      label: 'Déconnexion',
      Icon: LogoutIcon,
      onClick: handleLogoutClick,
      ariaLabel: 'Se déconnecter du compte',
      isDanger: true,
    },
  ];

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Menu utilisateur"
      className="absolute top-full right-0 mt-2 w-56 rounded-lg shadow-xl py-2 z-[9999]"
      style={{ 
        backgroundColor: colors.bg,
        borderColor: `${colors.border}33`,
        border: `1px solid ${colors.border}33`
      }}
    >
      {/* En-tête du menu avec info utilisateur */}
      <div 
        className="px-4 py-3 border-b"
        style={{ 
          color: colors.text,
          borderColor: `${colors.border}33`
        }}
      >
        <p className="text-sm font-semibold">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-xs" style={{ color: colors.text, opacity: 0.6 }}>
          {user.role === 'RECRUITER' ? 'Recruteur' : 'Candidat'}
        </p>
      </div>

      {/* Items du menu */}
      <div className="py-1">
        {menuItems.map((item, index) => {
          const IconComponent = item.Icon;
          return (
            <button
              key={item.label}
              ref={(el) => { menuItemsRef.current[index] = el; }}
              role="menuitem"
              type="button"
              onClick={item.onClick}
              aria-label={item.ariaLabel}
              className={`
                w-full text-left px-4 py-2.5 text-sm
                flex items-center gap-3
                transition-colors duration-150
                focus:outline-none focus:ring-2 focus:ring-inset rounded-lg
              `}
              style={{
                color: item.isDanger ? '#dc2626' : colors.text,
                backgroundColor: focusedIndex === index ? `${colors.text}10` : 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.text}10`;
              }}
              onMouseLeave={(e) => {
                if (focusedIndex !== index) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <IconComponent size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
