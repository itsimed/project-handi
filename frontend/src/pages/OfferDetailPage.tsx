/**
 * OfferDetailPage - Page de détail d'une offre d'emploi
 * Inspirée du layout HelloWork avec sections structurées
 * Conforme RGAA/WCAG AA
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplications } from '../hooks/useApplications';
import apiClient from '../api/apiClient';
import { Icon } from '../components/Icon';
import { Breadcrumb } from '../components/Breadcrumb';
import { Navbar } from '../components/Navbar';
import { ApplicationModal } from '../components/ApplicationModal';
import { CheckIcon } from '../components/icons';
import { useTheme } from '../contexts/AccessibilityContext';
import { ScrollToTopButton } from '../components/ScrollToTopButton';

interface OfferDetail {
  id: number;
  title: string;
  description: string;
  location: string;
  contract: string[];
  experience: string;
  remote: string;
  createdAt: string;
  disabilityCompatible: string[];
  company: {
    id: number;
    name: string;
    sector?: string | null;
  };
  recruiter?: {
    firstName: string;
    lastName: string;
  };
}

export const OfferDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [offer, setOffer] = useState<OfferDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarOffers, setSimilarOffers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    isLoading: isApplying,
    error: applicationError,
    successMessage,
    applyToOffer,
    clearMessages,
    hasApplied,
    fetchMyApplications,
  } = useApplications();

  const isLoggedIn = !!localStorage.getItem('token');

  // Charger l'offre
  useEffect(() => {
    const fetchOffer = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/offers/${id}`);
        setOffer(response.data);

        // Charger les offres similaires (3 premières offres différentes)
        const similarResponse = await apiClient.get('/offers');
        const filtered = similarResponse.data.filter((o: any) => o.id !== parseInt(id));
        setSimilarOffers(filtered.slice(0, 3));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Offre introuvable');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffer();
    if (isLoggedIn) {
      fetchMyApplications();
    }
  }, [id, isLoggedIn, fetchMyApplications]);

  const handleApply = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!offer) return;

    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchMyApplications();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    return contracts.map(c => getContractLabel(c)).join(', ');
  };

  const getRemoteLabel = (remote: string): string => {
    const labels: Record<string, string> = {
      NO_REMOTE: 'Présentiel',
      HYBRID: 'Télétravail partiel',
      FULL_REMOTE: 'Télétravail complet',
    };
    return labels[remote] || remote;
  };

  const getDisabilityLabel = (category: string): string => {
    const labels: Record<string, string> = {
      MOTEUR: 'Handicap moteur',
      VISUEL: 'Handicap visuel',
      AUDITIF: 'Handicap auditif',
      PSYCHIQUE: 'Handicap psychique',
      COGNITIF: 'Handicap cognitif',
      INVISIBLE: 'Handicap invisible',
    };
    return labels[category] || category;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
        <div style={{ color: colors.text, opacity: 0.6 }} aria-live="polite" role="status">
          Chargement de l'offre...
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#dc2626' }}>Offre introuvable</h1>
          <p className="mb-8" style={{ color: colors.text, opacity: 0.6 }}>{error || 'Cette offre n\'existe pas'}</p>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: colors.text, color: colors.bg }}
          >
            Retour aux offres
          </button>
        </div>
      </div>
    );
  }

  const alreadyApplied = hasApplied(offer.id);

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: colors.bg,
        color: colors.text,
        backgroundImage: `radial-gradient(circle at 2px 2px, ${colors.text} 1px, transparent 0)`,
        backgroundSize: '48px 48px'
      }}
    >
      <div className="min-h-screen" style={{ backgroundColor: colors.bg, opacity: 0.95 }}>
      <Navbar />
      <Breadcrumb />

      {/* Messages d'alerte */}
      <div className="container mx-auto px-6 mt-6">
        {applicationError && (
          <div 
            role="alert" 
            aria-live="assertive"
            className="mb-6 p-4 border rounded-xl"
            style={{ borderColor: colors.border, color: colors.text }}
          >
            <strong className="font-bold">Erreur : </strong>
            <span>{applicationError}</span>
            <button
              type="button"
              onClick={clearMessages}
              className="ml-4 underline hover:opacity-70"
              style={{ color: colors.text }}
              aria-label="Fermer le message d'erreur"
            >
              Fermer
            </button>
          </div>
        )}

        {successMessage && (
          <div 
            role="alert" 
            aria-live="polite"
            className="mb-6 p-4 border rounded-xl"
            style={{ borderColor: colors.border, color: colors.text }}
          >
            <strong className="font-bold">Succès : </strong>
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* En-tête de l'offre */}
          <article>
            <header className="mb-8">
              {/* Badges */}
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="text-sm font-bold px-4 py-2 rounded-full border-2" style={{ borderColor: colors.border, color: colors.text }}>
                  {getContractLabels(offer.contract)}
                </span>
                <span className="text-sm px-4 py-2 rounded-full border-2 flex items-center gap-2" style={{ borderColor: colors.border, color: colors.text }}>
                  <Icon name="location" size={16} style={{ color: colors.text }} /> {offer.location}
                </span>
                <span className="text-sm px-4 py-2 rounded-full border-2 flex items-center gap-2" style={{ borderColor: colors.border, color: colors.text }}>
                  <Icon name="briefcase" size={16} style={{ color: colors.text }} /> {offer.experience}
                </span>
                <span className="text-sm px-4 py-2 rounded-full border-2 flex items-center gap-2" style={{ borderColor: colors.border, color: colors.text }}>
                  <Icon name="home" size={16} style={{ color: colors.text }} /> {getRemoteLabel(offer.remote)}
                </span>
              </div>

              {/* Titre */}
              <h2 className="text-4xl font-bold mb-4" style={{ color: colors.text }}>
                {offer.title}
              </h2>

              {/* Entreprise */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 border-2" style={{ borderColor: colors.border }} aria-hidden="true">
                  <Icon name="building" size={32} style={{ color: colors.text }} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold" style={{ color: colors.text }}>
                    {offer.company.name}
                  </h3>
                  {offer.company.sector && (
                    <p style={{ color: colors.text, opacity: 0.7 }}>{offer.company.sector}</p>
                  )}
                </div>
              </div>

              {/* Date de publication */}
              <p className="text-sm" style={{ color: colors.text, opacity: 0.8 }}>
                Publiée le{' '}
                <time dateTime={offer.createdAt}>
                  {new Date(offer.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </p>
            </header>

            {/* Bouton d'action principal */}
            <div className="border-y-2 py-4 -mx-6 px-6 mb-8" style={{ backgroundColor: `${colors.bg}F2`, borderColor: colors.border }}>
              <button
                type="button"
                onClick={handleApply}
                disabled={isApplying || alreadyApplied}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 ${
                  isApplying ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                style={{
                  backgroundColor: alreadyApplied
                    ? colors.bg
                    : isApplying
                    ? colors.text
                    : colors.text,
                  color: alreadyApplied ? colors.text : colors.bg,
                  border: `2px solid ${colors.border}`,
                }}
                aria-label={alreadyApplied ? 'Vous avez déjà postulé à cette offre' : 'Envoyer votre candidature pour cette offre'}
              >
                {alreadyApplied ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckIcon size={18} aria-hidden="true" />
                    Candidature envoyée
                  </span>
                ) : isApplying ? (
                  'Envoi en cours...'
                ) : (
                  'Postuler maintenant'
                )}
              </button>
            </div>

            {/* Section Description */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 border-l-4 pl-4 flex items-center gap-3" style={{ color: colors.text, borderColor: colors.border }}>
                <Icon name="document" size={28} style={{ color: colors.text }} />
                Description du poste
              </h2>
              <div className="p-6 rounded-xl border-2" style={{ borderColor: colors.border }}>
                <p className="whitespace-pre-line leading-relaxed" style={{ color: colors.text }}>
                  {offer.description}
                </p>
              </div>
            </section>

            {/* Section Accessibilité */}
            {offer.disabilityCompatible && offer.disabilityCompatible.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 border-l-4 pl-4 flex items-center gap-3" style={{ color: colors.text, borderColor: '#10b981' }}>
                  <Icon name="accessibility" size={28} style={{ color: '#10b981' }} />
                  Accessibilité
                </h2>
                <div className="p-6 rounded-xl border-2" style={{ borderColor: '#10b981', backgroundColor: `${colors.bg}` }}>
                  <p className="mb-3 font-semibold" style={{ color: colors.text }}>
                    Ce poste est adapté aux personnes en situation de handicap :
                  </p>
                  <ul className="list-disc list-inside space-y-2" style={{ color: colors.text }}>
                    {offer.disabilityCompatible.map((category, index) => (
                      <li key={index}>{getDisabilityLabel(category)}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Informations pratiques */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 border-l-4 pl-4 flex items-center gap-3" style={{ color: colors.text, borderColor: colors.border }}>
                <Icon name="info" size={28} style={{ color: colors.text }} />
                Informations pratiques
              </h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border-2" style={{ borderColor: colors.border }}>
                  <dt className="text-sm mb-1" style={{ color: colors.text, opacity: 0.6 }}>Type de contrat</dt>
                  <dd className="font-semibold" style={{ color: colors.text }}>{getContractLabels(offer.contract)}</dd>
                </div>
                <div className="p-4 rounded-xl border-2" style={{ borderColor: colors.border }}>
                  <dt className="text-sm mb-1" style={{ color: colors.text, opacity: 0.6 }}>Localisation</dt>
                  <dd className="font-semibold" style={{ color: colors.text }}>{offer.location}</dd>
                </div>
                <div className="p-4 rounded-xl border-2" style={{ borderColor: colors.border }}>
                  <dt className="text-sm mb-1" style={{ color: colors.text, opacity: 0.6 }}>Expérience requise</dt>
                  <dd className="font-semibold" style={{ color: colors.text }}>{offer.experience}</dd>
                </div>
                <div className="p-4 rounded-xl border-2" style={{ borderColor: colors.border }}>
                  <dt className="text-sm mb-1" style={{ color: colors.text, opacity: 0.6 }}>Télétravail</dt>
                  <dd className="font-semibold" style={{ color: colors.text }}>{getRemoteLabel(offer.remote)}</dd>
                </div>
              </dl>
            </section>
          </article>

        </div>
      </main>

      {/* Application Modal */}
      {offer && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          offerId={offer.id}
          offerTitle={offer.title}
          companyName={offer.company.name}
          onSuccess={handleModalSuccess}
        />
      )}

      <ScrollToTopButton />
      </div>
    </div>
  );
};
