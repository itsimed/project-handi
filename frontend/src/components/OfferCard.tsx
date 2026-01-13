/**
 * OfferCard Component - Carte d'offre accessible RGAA
 * Article sémantique avec tous les éléments accessibles
 */

import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { CheckIcon } from './icons';

interface OfferCardProps {
  offer: {
    id: number;
    title: string;
    location: string;
    contract: string[];
    createdAt: string;
    company: {
      name: string;
    };
  };
  onApply: (offerId: number) => void;
  isApplying: boolean;
  hasApplied: boolean;
}

/**
 * Carte d'offre sémantique avec structure article accessible
 * Conforme RGAA/WCAG AA
 */
export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onApply,
  isApplying,
  hasApplied,
}) => {
  const navigate = useNavigate();

  const getContractLabel = (contract: string): string => {
    const labels: Record<string, string> = {
      CDI: 'CDI',
      CDD: 'CDD',
      INTERIM: 'Intérim',
      STAGE: 'Stage',
      ALTERNANCE: 'Alternance',
    };
    return labels[contract] || contract;
  };

  const getContractLabels = (contracts: string[]): string => {
    return contracts.map(c => getContractLabel(c)).join(' • ');
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <article className="bg-slate-800 p-4 sm:p-6 rounded-2xl border border-slate-700 hover:border-sky-500 hover:shadow-xl hover:shadow-sky-500/10 transition-all group">
      {/* Header avec badge et date */}
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <span
          className="bg-sky-500/10 text-sky-400 text-xs font-bold px-2 sm:px-3 py-1 rounded-full border border-sky-500/30"
          aria-label={`Types de contrat: ${getContractLabels(offer.contract)}`}
        >
          {getContractLabels(offer.contract)}
        </span>
        <time
          dateTime={offer.createdAt}
          className="text-slate-500 text-xs sm:text-sm"
        >
          {formatDate(offer.createdAt)}
        </time>
      </div>

      {/* Titre de l'offre - Cliquable */}
      <h3 className="text-lg sm:text-xl font-bold mb-2">
        <button
          type="button"
          onClick={() => navigate(`/offres/${offer.id}`)}
          className="text-slate-100 hover:text-sky-400 transition-colors text-left w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded px-1 -ml-1"
          aria-label={`Voir les détails de l'offre ${offer.title}`}
        >
          {offer.title}
        </button>
      </h3>

      {/* Nom de l'entreprise */}
      <p className="text-sm sm:text-base text-slate-300 mb-4 sm:mb-6">{offer.company.name}</p>

      {/* Localisation */}
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Icon name="location" size={18} className="sm:w-5 sm:h-5 text-slate-500" />
        <span className="text-xs sm:text-sm text-slate-300">{offer.location}</span>
      </div>

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => navigate(`/offres/${offer.id}`)}
          className="flex-1 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-bold bg-slate-700 hover:bg-slate-600 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          aria-label={`Voir les détails de l'offre ${offer.title}`}
        >
          Voir l'offre
        </button>
        
        <button
          type="button"
          onClick={() => onApply(offer.id)}
          disabled={isApplying || hasApplied}
          className={`flex-1 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 flex items-center justify-center ${
            hasApplied
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : isApplying
              ? 'bg-slate-700 text-slate-400 cursor-wait'
              : 'bg-sky-600 hover:bg-sky-500 text-white'
          }`}
          aria-label={
            hasApplied
              ? `Vous avez déjà postulé à ${offer.title}`
              : `Postuler à l'offre ${offer.title} chez ${offer.company.name}`
          }
        >
          {hasApplied ? (
            <span className="flex items-center justify-center gap-2">
              <CheckIcon size={16} aria-hidden="true" />
              Postulé
            </span>
          ) : isApplying ? (
            'Envoi...'
          ) : (
            'Postuler'
          )}
        </button>
      </div>
    </article>
  );
};

