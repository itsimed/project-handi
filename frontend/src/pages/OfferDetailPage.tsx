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
import { ApplicationModal } from '../components/ApplicationModal';
import { CheckIcon } from '../components/icons';

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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400" aria-live="polite" role="status">
          Chargement de l'offre...
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-4">Offre introuvable</h1>
          <p className="text-slate-400 mb-8">{error || 'Cette offre n\'existe pas'}</p>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Retour aux offres
          </button>
        </div>
      </div>
    );
  }

  const alreadyApplied = hasApplied(offer.id);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header simplifié */}
      <header className="border-b border-slate-800 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-sky-400 cursor-pointer hover:text-sky-300 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-2 py-1"
            tabIndex={0}
            role="button"
            aria-label="Retour à l'accueil"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/');
              }
            }}
          >
            Project Handi
          </h1>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-slate-300 hover:text-sky-400 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 px-4 py-2 rounded-lg"
            aria-label="Retour à la liste des offres"
          >
            ← Retour aux offres
          </button>
        </div>
      </header>
      
      {/* Fil d'Ariane */}
      <Breadcrumb />

      {/* Messages d'alerte */}
      <div className="container mx-auto px-6 mt-6">
        {applicationError && (
          <div 
            role="alert" 
            aria-live="assertive"
            className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-300 rounded-lg"
          >
            <strong className="font-bold">Erreur : </strong>
            <span>{applicationError}</span>
            <button
              type="button"
              onClick={clearMessages}
              className="ml-4 text-red-400 hover:text-red-200 underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
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
            className="mb-6 p-4 bg-green-500/10 border border-green-500/50 text-green-300 rounded-lg"
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
                <span className="bg-sky-500/10 text-sky-400 text-sm font-bold px-4 py-2 rounded-full border border-sky-500/30">
                  {getContractLabels(offer.contract)}
                </span>
                <span className="bg-slate-800 text-slate-300 text-sm px-4 py-2 rounded-full border border-slate-700 flex items-center gap-2">
                  <Icon name="location" size={16} className="text-sky-400" /> {offer.location}
                </span>
                <span className="bg-slate-800 text-slate-300 text-sm px-4 py-2 rounded-full border border-slate-700 flex items-center gap-2">
                  <Icon name="briefcase" size={16} className="text-sky-400" /> {offer.experience}
                </span>
                <span className="bg-slate-800 text-slate-300 text-sm px-4 py-2 rounded-full border border-slate-700 flex items-center gap-2">
                  <Icon name="home" size={16} className="text-sky-400" /> {getRemoteLabel(offer.remote)}
                </span>
              </div>

              {/* Titre */}
              <h2 className="text-4xl font-bold mb-4 text-slate-100">
                {offer.title}
              </h2>

              {/* Entreprise */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-sky-500/10 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Icon name="building" size={32} className="text-sky-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-200">
                    {offer.company.name}
                  </h3>
                  {offer.company.sector && (
                    <p className="text-slate-400">{offer.company.sector}</p>
                  )}
                </div>
              </div>

              {/* Date de publication */}
              <p className="text-slate-500 text-sm">
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

            {/* Bouton d'action principal sticky */}
            <div className="sticky top-6 z-40 bg-slate-900/95 backdrop-blur-sm border-y border-slate-800 py-4 -mx-6 px-6 mb-8">
              <button
                type="button"
                onClick={handleApply}
                disabled={isApplying || alreadyApplied}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                  alreadyApplied
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : isApplying
                    ? 'bg-slate-700 text-slate-400 cursor-wait'
                    : 'bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20'
                }`}
                aria-label={alreadyApplied ? 'Vous avez déjà postulé à cette offre' : 'Envoyer votre candidature pour cette offre'}
              >
                {alreadyApplied ? (
                  <span className="flex items-center gap-2">
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
              <h2 className="text-2xl font-bold mb-4 text-slate-100 border-l-4 border-sky-500 pl-4 flex items-center gap-3">
                <Icon name="document" size={28} className="text-sky-400" />
                Description du poste
              </h2>
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                  {offer.description}
                </p>
              </div>
            </section>

            {/* Section Accessibilité */}
            {offer.disabilityCompatible && offer.disabilityCompatible.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-slate-100 border-l-4 border-green-500 pl-4 flex items-center gap-3">
                  <Icon name="accessibility" size={28} className="text-green-400" />
                  Accessibilité
                </h2>
                <div className="bg-green-500/10 p-6 rounded-xl border border-green-500/30">
                  <p className="text-green-300 mb-3 font-semibold">
                    Ce poste est adapté aux personnes en situation de handicap :
                  </p>
                  <ul className="list-disc list-inside text-slate-300 space-y-2">
                    {offer.disabilityCompatible.map((category, index) => (
                      <li key={index}>{getDisabilityLabel(category)}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Informations pratiques */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-slate-100 border-l-4 border-purple-500 pl-4 flex items-center gap-3">
                <Icon name="info" size={28} className="text-purple-400" />
                Informations pratiques
              </h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <dt className="text-slate-500 text-sm mb-1">Type de contrat</dt>
                  <dd className="text-slate-100 font-semibold">{getContractLabels(offer.contract)}</dd>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <dt className="text-slate-500 text-sm mb-1">Localisation</dt>
                  <dd className="text-slate-100 font-semibold">{offer.location}</dd>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <dt className="text-slate-500 text-sm mb-1">Expérience requise</dt>
                  <dd className="text-slate-100 font-semibold">{offer.experience}</dd>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <dt className="text-slate-500 text-sm mb-1">Télétravail</dt>
                  <dd className="text-slate-100 font-semibold">{getRemoteLabel(offer.remote)}</dd>
                </div>
              </dl>
            </section>
          </article>

          {/* Offres similaires */}
          {similarOffers.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6 text-slate-100">
                Ces offres pourraient aussi vous intéresser
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similarOffers.map((similarOffer) => (
                  <article 
                    key={similarOffer.id}
                    className="bg-slate-800 p-5 rounded-xl border border-slate-700 hover:border-sky-500 transition-all cursor-pointer group"
                    onClick={() => {
                      navigate(`/offres/${similarOffer.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Voir l'offre ${similarOffer.title} chez ${similarOffer.company.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/offres/${similarOffer.id}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                  >
                    <h3 className="font-bold text-slate-100 mb-2 group-hover:text-sky-400 transition-colors">
                      {similarOffer.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-3">
                      {similarOffer.company.name}
                    </p>
                    <div className="flex gap-2 text-xs flex-wrap">
                      <span className="bg-sky-500/10 text-sky-400 px-2 py-1 rounded">
                        {getContractLabel(similarOffer.contract)}
                      </span>
                      <span className="text-slate-500">
                        {similarOffer.location}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
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
    </div>
  );
};

