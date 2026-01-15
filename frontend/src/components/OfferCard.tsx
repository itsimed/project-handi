/**
 * OfferCard Component - Carte d'offre accessible RGAA
 * Article sémantique avec tous les éléments accessibles
 */

import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { CheckIcon } from './icons';
import { useTheme } from '../contexts/AccessibilityContext';

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
const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
};

export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onApply,
  isApplying,
  hasApplied,
}) => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const isLoggedIn = !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

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
    <article 
      className="p-6 rounded-2xl border-2 hover:shadow-xl transition-all duration-200 group"
      style={{ 
        backgroundColor: colors.bg,
        borderColor: colors.border
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.borderColor = colors.text;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.borderColor = colors.border;
      }}
    >
      {/* Header avec badge et date */}
      <div className="flex justify-between items-start mb-4">
        <span
          className="text-xs font-bold px-3 py-1 rounded-full border-2"
          style={{ 
            backgroundColor: colors.bg,
            borderColor: colors.border,
            color: colors.text
          }}
          aria-label={`Types de contrat: ${getContractLabels(offer.contract)}`}
        >
          {getContractLabels(offer.contract)}
        </span>
        <time
          dateTime={offer.createdAt}
          className="text-sm"
          style={{ color: colors.text, opacity: 0.8 }}
        >
          {formatDate(offer.createdAt)}
        </time>
      </div>

      {/* Titre de l'offre - Cliquable */}
      <h3 className="text-xl font-bold mb-2">
        <button
          type="button"
          onClick={() => navigate(`/offres/${offer.id}`)}
          className="text-left w-full focus:outline-none focus:ring-2 rounded-xl px-1 -ml-1 transition-opacity duration-200"
          style={{ color: colors.text }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          aria-label={`Voir les détails de l'offre ${offer.title}`}
        >
          {offer.title}
        </button>
      </h3>

      {/* Nom de l'entreprise */}
      <p className="mb-6" style={{ color: colors.text, opacity: 0.7 }}>
        {offer.company.name}
      </p>

      {/* Localisation */}
      <div className="flex items-center gap-2 mb-6">
        <Icon name="location" size={20} className="opacity-50" />
        <span className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
          {offer.location}
        </span>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => navigate(`/offres/${offer.id}`)}
          className="flex-1 py-3 rounded-xl font-bold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2"
          style={{ 
            backgroundColor: colors.bg,
            color: colors.text,
            border: `2px solid ${colors.border}`
          }}
          aria-label={`Voir les détails de l'offre ${offer.title}`}
        >
          Voir l'offre
        </button>
        
        {isLoggedIn ? (
        <button
          type="button"
          onClick={() => onApply(offer.id)}
          disabled={isApplying || hasApplied}
          className="flex-1 py-3 rounded-xl font-bold transition-all duration-200 focus:outline-none focus:ring-2 flex items-center justify-center"
          style={{ 
            backgroundColor: hasApplied || isApplying ? colors.bg : colors.text,
            color: hasApplied || isApplying ? colors.text : colors.bg,
            border: `2px solid ${hasApplied || isApplying ? colors.border : colors.text}`,
            opacity: hasApplied || isApplying ? 0.5 : 1,
            cursor: hasApplied || isApplying ? 'not-allowed' : 'pointer',
            transform: hasApplied || isApplying ? 'none' : undefined
          }}
          onMouseEnter={(e) => {
            if (!hasApplied && !isApplying) {
              e.currentTarget.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (!hasApplied && !isApplying) {
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
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
        ) : (
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="flex-1 py-3 rounded-xl font-bold transition-all duration-200 focus:outline-none focus:ring-2 hover:scale-105"
          style={{ 
            backgroundColor: colors.text,
            color: colors.bg,
            border: `2px solid ${colors.text}`
          }}
          aria-label={`Se connecter pour postuler à ${offer.title}`}
        >
          Se connecter
        </button>
        )}
      </div>
    </article>
  );
};

