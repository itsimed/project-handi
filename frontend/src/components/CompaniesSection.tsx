/**
 * CompaniesSection Component - Section entreprises qui recrutent
 * Grille accessible avec logos et compteurs d'offres
 */

import { Icon } from './Icon';

interface Company {
  id: number;
  name: string;
  sector?: string | null;
  offersCount?: number;
}

interface CompaniesSectionProps {
  companies: Company[];
  isLoading: boolean;
}

/**
 * Section entreprises accessible avec grille responsive
 * Conforme RGAA/WCAG AA
 */
export const CompaniesSection: React.FC<CompaniesSectionProps> = ({
  companies,
  isLoading,
}) => {
  /**
   * Génère une couleur de fond basée sur le nom
   */
  const getColorClass = (name: string): string => {
    const colors = [
      'bg-sky-600',
      'bg-cyan-600',
      'bg-indigo-600',
      'bg-purple-600',
      'bg-pink-600',
      'bg-emerald-600',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (isLoading) {
    return (
      <section
        aria-labelledby="companies-heading"
        className="mt-16 mb-8"
      >
        <h2
          id="companies-heading"
          className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-slate-200"
        >
          Entreprises qui recrutent
        </h2>
        <div className="text-center py-10 text-slate-400" aria-live="polite">
          Chargement des entreprises...
        </div>
      </section>
    );
  }

  if (companies.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="companies-heading"
      className="mt-16 mb-8"
    >
      <h2
        id="companies-heading"
        className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-slate-200"
      >
        Entreprises qui recrutent
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
        {companies.map((company) => (
          <a
            key={company.id}
            href={`#company-${company.id}`}
            className="bg-slate-800 p-4 sm:p-6 rounded-xl border border-slate-700 hover:border-sky-500 transition-all group flex flex-col items-center justify-center text-center focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label={`Voir les ${company.offersCount || 0} offres de ${
              company.name
            }`}
          >
            {/* Logo placeholder */}
            <div
              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${getColorClass(
                company.name
              )} flex items-center justify-center text-white mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}
              aria-hidden="true"
            >
              <Icon name="building" size={20} className="sm:w-7 sm:h-7 text-white" />
            </div>

            {/* Nom de l'entreprise */}
            <h3 className="text-xs sm:text-sm font-semibold text-slate-200 mb-1 sm:mb-2 group-hover:text-sky-400 transition-colors">
              {company.name}
            </h3>

            {/* Compteur d'offres */}
            {company.offersCount !== undefined && company.offersCount > 0 && (
              <p className="text-xs text-slate-400">
                {company.offersCount} offre{company.offersCount > 1 ? 's' : ''}
              </p>
            )}

            {/* Secteur (si disponible) */}
            {company.sector && (
              <p className="text-xs text-slate-500 mt-1">{company.sector}</p>
            )}
          </a>
        ))}
      </div>

      {/* Lien pour voir toutes les entreprises */}
      <div className="mt-4 sm:mt-6 text-center">
        <a
          href="#all-companies"
          className="inline-block text-sm sm:text-base text-sky-400 hover:text-sky-300 font-medium underline focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 px-2 py-1 rounded"
        >
          Voir toutes les entreprises →
        </a>
      </div>
    </section>
  );
};

