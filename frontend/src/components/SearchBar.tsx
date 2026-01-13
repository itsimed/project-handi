/**
 * SearchBar Component - Barre de recherche principale accessible RGAA
 * Inspirée de HelloWork avec deux champs (Quoi ? / Où ?)
 */

import { useState, FormEvent } from 'react';
import { Icon } from './Icon';
import { useTheme } from '../contexts/ThemeContext';

interface SearchQuery {
  what: string;
  where: string;
}

interface SearchBarProps {
  onSearch: (query: SearchQuery) => void;
  isLoading?: boolean;
}

/**
 * Barre de recherche accessible avec labels visibles et navigation clavier
 * Conforme RGAA/WCAG AA
 */
export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading = false }) => {
  const [what, setWhat] = useState('');
  const [where, setWhere] = useState('');
  const { colors } = useTheme();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch({ what, where });
  };

  return (
    <form 
      role="search" 
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="rounded-2xl border-2 p-6 shadow-xl" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Champ "Quoi ?" */}
          <div className="flex-1">
            <label 
              htmlFor="search-what" 
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text }}
            >
              Quoi ?
            </label>
            <input
              id="search-what"
              type="text"
              value={what}
              onChange={(e) => setWhat(e.target.value)}
              placeholder="Métier, entreprise, compétence..."
              aria-label="Rechercher par métier, entreprise ou compétence"
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{ 
                backgroundColor: colors.bg,
                borderColor: colors.border,
                color: colors.text
              }}
            />
          </div>

          {/* Champ "Où ?" */}
            <div className="flex-1">
            <label 
              htmlFor="search-where" 
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text }}
            >
              Où ?
            </label>
            <input
              id="search-where"
              type="text"
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              placeholder="Ville, département, code postal..."
              aria-label="Rechercher par ville, département ou code postal"
              className="w-full px-4 py-3 border-2 rounded-lg  focus:ring-2 transition-all focus:ring-[#b81feb] "
              style={{ 
              backgroundColor: colors.bg,
              borderColor: colors.border,
              color: colors.text
              }}
            />
            </div>

          {/* Bouton de recherche */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-8 py-3 font-bold border-2 rounded-lg transition-all focus:outline-none focus:ring-2 flex items-center justify-center gap-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: colors.bg,
                color: colors.text,
                borderColor: colors.border
              }}
              aria-label="Lancer la recherche"
            >
              <Icon name="search" size={20}  />
              <span>{isLoading ? 'Recherche...' : 'Rechercher'}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

