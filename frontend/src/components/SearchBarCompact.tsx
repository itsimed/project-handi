/**
 * SearchBarCompact Component - Version compacte pour le header
 * Barre de recherche accessible RGAA en version horizontale
 */

import { useState, FormEvent } from 'react';
import { Icon } from './Icon';
import { useTheme } from '../contexts/AccessibilityContext';

interface SearchQuery {
  what: string;
  where: string;
}

interface SearchBarCompactProps {
  onSearch: (query: SearchQuery) => void;
  isLoading?: boolean;
  initialWhat?: string;
  initialWhere?: string;
}

/**
 * Version compacte de la barre de recherche pour le header
 * Conforme RGAA/WCAG AA
 */
export const SearchBarCompact: React.FC<SearchBarCompactProps> = ({ 
  onSearch, 
  isLoading = false,
  initialWhat = '',
  initialWhere = '',
}) => {
  const { colors } = useTheme();
  const [what, setWhat] = useState(initialWhat);
  const [where, setWhere] = useState(initialWhere);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch({ what, where });
  };

  return (
    <form 
      role="search" 
      onSubmit={handleSubmit}
      className="flex-1 max-w-3xl"
    >
      <div 
        className="flex items-center gap-2 rounded-xl border-2 p-2"
        style={{ 
          backgroundColor: colors.bg,
          borderColor: colors.border
        }}
      >
        {/* Champ "Quoi ?" */}
        <div className="flex-1">
          <label htmlFor="search-what-compact" className="sr-only">
            Quoi ?
          </label>
          <input
            id="search-what-compact"
            type="text"
            value={what}
            onChange={(e) => setWhat(e.target.value)}
            placeholder="Métier, entreprise..."
            aria-label="Rechercher par métier ou entreprise"
            className="w-full px-3 py-2 bg-transparent focus:outline-none"
            style={{ 
              color: colors.text,
              opacity: what ? 1 : 0.5
            }}
          />
        </div>

        <div 
          className="w-px h-6" 
          aria-hidden="true"
          style={{ backgroundColor: colors.border, opacity: 0.5 }}
        />

        {/* Champ "Où ?" */}
        <div className="flex-1">
          <label htmlFor="search-where-compact" className="sr-only">
            Où ?
          </label>
          <input
            id="search-where-compact"
            type="text"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            placeholder="Ville, région..."
            aria-label="Rechercher par ville ou région"
            className="w-full px-3 py-2 bg-transparent focus:outline-none"
            style={{ 
              color: colors.text,
              opacity: where ? 1 : 0.5
            }}
          />
        </div>

        {/* Bouton de recherche */}
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 disabled:cursor-not-allowed font-medium rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2"
          style={{ 
            backgroundColor: colors.text,
            color: colors.bg,
            opacity: isLoading ? 0.5 : 1
          }}
          aria-label="Lancer la recherche"
        >
          <Icon name="search" size={20} />
        </button>
      </div>
    </form>
  );
};

