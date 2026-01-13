/**
 * StatsBar Component - Barre de statistiques accessible
 * Affiche le nombre d'offres et d'entreprises avec aria-live
 */

import { Icon } from './Icon';
import { useTheme } from '../contexts/AccessibilityContext';

interface StatsBarProps {
  totalOffers: number;
  totalCompanies: number;
  totalApplications: number;
  totalApplicants?: number;
  isLoading: boolean;
}

/**
 * Barre de statistiques accessible avec annonces aria-live
 * Conforme RGAA/WCAG AA
 */
export const StatsBar: React.FC<StatsBarProps> = ({
  totalOffers,
  totalCompanies,
  totalApplications = 0,
  totalApplicants = 0,
  isLoading,
}) => {
  const { colors, theme } = useTheme();
  
  const formatNumber = (num: number): string => {
    return num?.toLocaleString('fr-FR') || '0';
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
      className="py-6"
      aria-live="polite"
    >
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 list-none max-w-4xl mx-auto">
        {/* Statistique Offres */}
        <li className="flex items-center gap-3 text-center md:text-left">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: theme === 'dark' ? '#FFFFFF' : '#23022E', color: theme === 'dark' ? '#23022E' : '#FFFFFF' }}
            aria-hidden="true"
          >
            <Icon name="briefcase" size={24} />
          </div>
          <div>
            <p className="text-3xl font-bold" style={{ color: colors.text }}>
              {formatNumber(totalOffers)}
            </p>
            <p className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
              offre{totalOffers > 1 ? 's' : ''} active{totalOffers > 1 ? 's' : ''}
            </p>
          </div>
        </li>

        {/* Statistique Candidatures */}
        <li className="flex items-center gap-3 text-center md:text-left">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: theme === 'dark' ? '#FFFFFF' : '#23022E', color: theme === 'dark' ? '#23022E' : '#FFFFFF' }}
            aria-hidden="true"
          >
            <Icon name="document" size={24} />
          </div>
          <div>
            <p className="text-3xl font-bold" style={{ color: colors.text }}>
              {formatNumber(totalApplications)}
            </p>
            <p className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
              candidature{totalApplications > 1 ? 's' : ''}
            </p>
          </div>
        </li>

        {/* Statistique Entreprises */}
        <li className="flex items-center gap-3 text-center md:text-left">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: theme === 'dark' ? '#FFFFFF' : '#23022E', color: theme === 'dark' ? '#23022E' : '#FFFFFF' }}
            aria-hidden="true"
          >
            <Icon name="building" size={24} />
          </div>
          <div>
            <p className="text-3xl font-bold" style={{ color: colors.text }}>
              {formatNumber(totalCompanies)}
            </p>
            <p className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
              entreprise{totalCompanies > 1 ? 's' : ''}
            </p>
          </div>
        </li>

        {/* Statistique Candidats */}
        <li className="flex items-center gap-3 text-center md:text-left">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: theme === 'dark' ? '#FFFFFF' : '#23022E', color: theme === 'dark' ? '#23022E' : '#FFFFFF' }}
            aria-hidden="true"
          >
            <Icon name="users" size={24} />
          </div>
          <div>
            <p className="text-3xl font-bold" style={{ color: colors.text }}>
              {formatNumber(totalApplicants)}
            </p>
            <p className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
              candidat{totalApplicants > 1 ? 's' : ''} inscrit{totalApplicants > 1 ? 's' : ''}
            </p>
          </div>
        </li>
      </ul>

      {/* Message accessible pour les lecteurs d'écran */}
      <div className="sr-only" aria-live="polite">
        {totalOffers} offre{totalOffers > 1 ? 's' : ''} active{totalOffers > 1 ? 's' : ''}, {totalApplications} candidature{totalApplications > 1 ? 's' : ''}, {totalCompanies} entreprise{totalCompanies > 1 ? 's' : ''}, {totalApplicants} candidat{totalApplicants > 1 ? 's' : ''} inscrit{totalApplicants > 1 ? 's' : ''}
      </div>
    </div>
  );
};
