/**
 * StatsBar Component - Barre de statistiques accessible
 * Affiche le nombre d'offres et d'entreprises avec aria-live
 */

import { Icon } from './Icon';
import { useTheme } from '../contexts/AccessibilityContext';

interface StatsBarProps {
  totalOffers: number;
  totalCompanies?: number;
  totalApplications: number;
  totalApplicants?: number;
  pendingApplications?: number;
  viewedApplications?: number;
  isLoading: boolean;
  isRecruiter?: boolean;
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
  pendingApplications = 0,
  viewedApplications = 0,
  isLoading,
  isRecruiter = false,
}) => {
  const { theme } = useTheme();
  
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
        {isRecruiter ? (
          <>
            {/* Statistique Offres publiées */}
            <li className="flex items-center gap-3 text-center md:text-left">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: theme === 'dark' ? '#23022E' : '#23022E', color: theme === 'dark' ? '#FFFFFF' : '#FFFFFF' }}
                aria-hidden="true"
              >
                <Icon name="briefcase" size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold" style={{ color: '#23022E' }}>
                  {formatNumber(totalOffers)}
                </p>
                <p className="text-sm" style={{ color: '#23022E', opacity: 0.7 }}>
                  offre{totalOffers > 1 ? 's' : ''} publiée{totalOffers > 1 ? 's' : ''}
                </p>
              </div>
            </li>

            {/* Statistique Candidatures reçues */}
            <li className="flex items-center gap-3 text-center md:text-left">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: theme === 'dark' ? '#23022E' : '#23022E', color: theme === 'dark' ? '#FFFFFF' : '#FFFFFF' }}
                aria-hidden="true"
              >
                <Icon name="document" size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold" style={{ color: '#23022E' }}>
                  {formatNumber(totalApplications)}
                </p>
                <p className="text-sm" style={{ color: '#23022E', opacity: 0.7 }}>
                  candidature{totalApplications > 1 ? 's' : ''} reçue{totalApplications > 1 ? 's' : ''}
                </p>
              </div>
            </li>

            {/* Statistique Non consultées */}
            <li className="flex items-center gap-3 text-center md:text-left">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: theme === 'dark' ? '#23022E' : '#23022E', color: theme === 'dark' ? '#FFFFFF' : '#FFFFFF' }}
                aria-hidden="true"
              >
                <Icon name="clock" size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold" style={{ color: '#23022E' }}>
                  {formatNumber(pendingApplications)}
                </p>
                <p className="text-sm" style={{ color: '#23022E', opacity: 0.7 }}>
                  non consultée{pendingApplications > 1 ? 's' : ''}
                </p>
              </div>
            </li>

            {/* Statistique Consultées */}
            <li className="flex items-center gap-3 text-center md:text-left">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: theme === 'dark' ? '#23022E' : '#23022E', color: theme === 'dark' ? '#FFFFFF' : '#FFFFFF' }}
                aria-hidden="true"
              >
                <Icon name="check" size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold" style={{ color: '#23022E' }}>
                  {formatNumber(viewedApplications)}
                </p>
                <p className="text-sm" style={{ color: '#23022E', opacity: 0.7 }}>
                  consultée{viewedApplications > 1 ? 's' : ''}
                </p>
              </div>
            </li>
          </>
        ) : (
          <>
            {/* Statistique Offres */}
            <li className="flex items-center gap-3 text-center md:text-left">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: theme === 'dark' ? '#23022E' : '#23022E', color: theme === 'dark' ? '#FFFFFF' : '#FFFFFF' }}
                aria-hidden="true"
              >
                <Icon name="briefcase" size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold" style={{ color: '#23022E' }}>
                  {formatNumber(totalOffers)}
                </p>
                <p className="text-sm" style={{ color: '#23022E', opacity: 0.7 }}>
                  offre{totalOffers > 1 ? 's' : ''} active{totalOffers > 1 ? 's' : ''}
                </p>
              </div>
            </li>

            {/* Statistique Candidatures */}
            <li className="flex items-center gap-3 text-center md:text-left">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: theme === 'dark' ? '#23022E' : '#23022E', color: theme === 'dark' ? '#FFFFFF' : '#FFFFFF' }}
                aria-hidden="true"
              >
                <Icon name="document" size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold" style={{ color: '#23022E' }}>
                  {formatNumber(totalApplications)}
                </p>
                <p className="text-sm" style={{ color: '#23022E', opacity: 0.7 }}>
                  candidature{totalApplications > 1 ? 's' : ''}
                </p>
              </div>
            </li>

            {/* Statistique Entreprises */}
            <li className="flex items-center gap-3 text-center md:text-left">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: theme === 'dark' ? '#23022E' : '#23022E', color: theme === 'dark' ? '#FFFFFF' : '#FFFFFF' }}
                aria-hidden="true"
              >
                <Icon name="building" size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold" style={{ color: '#23022E' }}>
                  {formatNumber(totalCompanies || 0)}
                </p>
                <p className="text-sm" style={{ color: '#23022E', opacity: 0.7 }}>
                  entreprise{(totalCompanies || 0) > 1 ? 's' : ''}
                </p>
              </div>
            </li>

            {/* Statistique Candidats */}
            <li className="flex items-center gap-3 text-center md:text-left">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: theme === 'dark' ? '#23022E' : '#23022E', color: theme === 'dark' ? '#FFFFFF' : '#FFFFFF' }}
                aria-hidden="true"
              >
                <Icon name="users" size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold" style={{ color: '#23022E' }}>
                  {formatNumber(totalApplicants || 0)}
                </p>
                <p className="text-sm" style={{ color: '#23022E', opacity: 0.7 }}>
                  candidat{(totalApplicants || 0) > 1 ? 's' : ''} inscrit{(totalApplicants || 0) > 1 ? 's' : ''}
                </p>
              </div>
            </li>
          </>
        )}
      </ul>

      {/* Message accessible pour les lecteurs d'écran */}
      <div className="sr-only" aria-live="polite">
        {isRecruiter ? (
          <>
            {totalOffers} offre{totalOffers > 1 ? 's' : ''} publiée{totalOffers > 1 ? 's' : ''}, {totalApplications} candidature{totalApplications > 1 ? 's' : ''} reçue{totalApplications > 1 ? 's' : ''}, {pendingApplications} non consultée{pendingApplications > 1 ? 's' : ''}, {viewedApplications} consultée{viewedApplications > 1 ? 's' : ''}
          </>
        ) : (
          <>
            {totalOffers} offre{totalOffers > 1 ? 's' : ''} active{totalOffers > 1 ? 's' : ''}, {totalApplications} candidature{totalApplications > 1 ? 's' : ''}, {totalCompanies || 0} entreprise{(totalCompanies || 0) > 1 ? 's' : ''}, {totalApplicants || 0} candidat{(totalApplicants || 0) > 1 ? 's' : ''} inscrit{(totalApplicants || 0) > 1 ? 's' : ''}
          </>
        )}
      </div>
    </div>
  );
};
