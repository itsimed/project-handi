/**
 * StatsBar Component - Barre de statistiques accessible
 * Affiche le nombre d'offres et d'entreprises avec aria-live
 */

import { Icon } from './Icon';

interface StatsBarProps {
  totalOffers: number;
  totalCompanies: number;
  isLoading: boolean;
}

/**
 * Barre de statistiques accessible avec annonces aria-live
 * Conforme RGAA/WCAG AA
 */
export const StatsBar: React.FC<StatsBarProps> = ({
  totalOffers,
  totalCompanies,
  isLoading,
}) => {
  const formatNumber = (num: number): string => {
    return num.toLocaleString('fr-FR');
  };

  if (isLoading) {
    return (
      <div
        className="flex justify-center items-center gap-8 py-6"
        aria-live="polite"
      >
        <p className="text-slate-400">Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col md:flex-row justify-center items-center gap-8 py-6"
      aria-live="polite"
    >
      <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8 list-none">
        {/* Statistique Offres */}
        <li className="flex items-center gap-2 sm:gap-3 text-center sm:text-left">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-500/10 rounded-full flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <Icon name="briefcase" size={20} className="sm:w-6 sm:h-6 text-sky-400" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-100">
              {formatNumber(totalOffers)}
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              offre{totalOffers > 1 ? 's' : ''} disponible
              {totalOffers > 1 ? 's' : ''}
            </p>
          </div>
        </li>

        {/* Séparateur visuel */}
        <li
          className="hidden sm:block w-px h-12 sm:h-16 bg-slate-700"
          aria-hidden="true"
        />

        {/* Statistique Entreprises */}
        <li className="flex items-center gap-2 sm:gap-3 text-center sm:text-left">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-500/10 rounded-full flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <Icon name="building" size={20} className="sm:w-6 sm:h-6 text-cyan-400" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-100">
              {formatNumber(totalCompanies)}
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              entreprise{totalCompanies > 1 ? 's' : ''}
            </p>
          </div>
        </li>
      </ul>

      {/* Message accessible pour les lecteurs d'écran */}
      <div className="sr-only" aria-live="polite">
        {totalOffers} offre{totalOffers > 1 ? 's' : ''} disponible
        {totalOffers > 1 ? 's' : ''} dans {totalCompanies} entreprise
        {totalCompanies > 1 ? 's' : ''}
      </div>
    </div>
  );
};

