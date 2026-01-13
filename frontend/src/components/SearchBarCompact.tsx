/**
 * SearchBarCompact Component - Version compacte pour le header
 * Barre de recherche accessible RGAA en version horizontale
 */

import { useState, FormEvent } from 'react';
import { Icon } from './Icon';

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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-900 rounded-lg border border-slate-700 p-2">
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
            className="w-full px-3 py-2.5 sm:py-2 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-sm sm:text-base"
          />
        </div>

        <div className="hidden sm:block w-px h-6 bg-slate-700" aria-hidden="true" />

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
            className="w-full px-3 py-2.5 sm:py-2 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-sm sm:text-base"
          />
        </div>

        {/* Bouton de recherche */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-sm sm:text-base font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center justify-center gap-2"
          aria-label="Lancer la recherche"
        >
          <Icon name="search" size={18} className="sm:w-5 sm:h-5" />
          <span className="sm:hidden">Rechercher</span>
        </button>
      </div>
    </form>
  );
};

