/**
 * SearchBar Component - Barre de recherche principale accessible RGAA
 * Inspirée de HelloWork avec deux champs (Quoi ? / Où ?)
 */

import { useState, FormEvent } from 'react';
import { Icon } from './Icon';

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
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
          {/* Champ "Quoi ?" */}
          <div className="flex-1">
            <label 
              htmlFor="search-what" 
              className="block text-xs sm:text-sm font-medium text-slate-300 mb-2"
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
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all"
            />
          </div>

          {/* Champ "Où ?" */}
          <div className="flex-1">
            <label 
              htmlFor="search-where" 
              className="block text-xs sm:text-sm font-medium text-slate-300 mb-2"
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
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all"
            />
          </div>

          {/* Bouton de recherche */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-sm sm:text-base font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 flex items-center justify-center gap-2"
              aria-label="Lancer la recherche"
            >
              <Icon name="search" size={18} className="sm:w-5 sm:h-5" />
              <span>{isLoading ? 'Recherche...' : 'Rechercher'}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

