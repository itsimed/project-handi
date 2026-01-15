/**
 * ApplicationDetailPage - Détail d'une candidature
 * Affiche : CV, documents, offre associée, statut
 * Conforme RGAA/WCAG AA
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import apiClient from '../api/apiClient';
import { Breadcrumb } from '../components/Breadcrumb';
import { useTheme } from '../contexts/AccessibilityContext';
import { ScrollToTopButton } from '../components/ScrollToTopButton';

interface ApplicationDetail {
  id: number;
  status: 'NOT_VIEWED' | 'VIEWED';
  createdAt: string;
  cvUrl?: string | null;
  coverLetterUrl?: string | null;
  additionalDocs?: string[];
  offer: {
    id: number;
    title: string;
    description: string;
    location: string;
    contract: string;
    experience: string;
    remote: string;
    company: {
      id: number;
      name: string;
      sector?: string | null;
    };
  };
  company: {
    id: number;
    name: string;
    sector?: string | null;
  };
}

export const ApplicationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await apiClient.get(`/applications/${id}`);
        setApplication(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Candidature introuvable');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
        <p style={{ color: colors.text, opacity: 0.6 }} role="status" aria-live="polite">
          Chargement...
        </p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#dc2626' }}>Candidature introuvable</h1>
          <p className="mb-6" style={{ color: colors.text, opacity: 0.6 }}>{error || 'Cette candidature n\'existe pas'}</p>
          <button
            type="button"
            onClick={() => navigate('/mes-candidatures')}
            className="underline hover:opacity-70 px-2 py-1 rounded"
            style={{ color: colors.text }}
          >
            Retour à mes candidatures
          </button>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'VIEWED':
        return { 
          color: 'bg-green-500/10 text-green-400 border-green-500/30', 
          label: 'Candidature consultée par le recruteur',
          icon: 'check' as const
        };
      case 'NOT_VIEWED':
      default:
        return { 
          color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', 
          label: 'Non consultée par le recruteur',
          icon: 'clock' as const
        };
    }
  };

  const statusConfig = getStatusConfig(application.status);

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
      {/* Header */}
      <header className="border-b-2 p-6" style={{ borderColor: colors.border }}>
        <div className="container mx-auto">
          <button
            type="button"
            onClick={() => navigate('/mes-candidatures')}
            className="mb-4 flex items-center gap-2 rounded px-2 py-1 -ml-2 transition-opacity hover:opacity-70"
            style={{ color: colors.text }}
            aria-label="Retour à mes candidatures"
          >
            <Icon name="chevron-left" size={20} />
            Retour à mes candidatures
          </button>
          
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
            Ma candidature
          </h1>
        </div>
      </header>
      
      {/* Fil d'Ariane */}
      <Breadcrumb />

      {/* Contenu principal */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        
        {/* En-tête de la candidature */}
        <section className="rounded-2xl border-2 p-6 mb-6" style={{ borderColor: colors.border }}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
                {application.offer.title}
              </h2>
              <p className="flex items-center gap-2 mb-2" style={{ color: colors.text, opacity: 0.8 }}>
                <Icon name="building" size={18} />
                {application.offer.company.name}
              </p>
              {application.offer.company.sector && (
                <p className="text-sm" style={{ color: colors.text, opacity: 0.6 }}>
                  {application.offer.company.sector}
                </p>
              )}
            </div>
            
            <span 
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${statusConfig.color} self-start`}
              role="status"
              aria-label={statusConfig.label}
            >
              <Icon name={statusConfig.icon} size={16} />
              {statusConfig.label}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm border-t pt-4" style={{ color: colors.text, opacity: 0.6, borderColor: colors.border }}>
            <Icon name="calendar" size={16} />
            Postulée le {new Date(application.createdAt).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </section>

        {/* Documents de candidature */}
        <section className="mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.text }}>
            <Icon name="document" size={24} className="opacity-100" />
            Documents de candidature
          </h3>
          
          {!application.cvUrl && !application.coverLetterUrl && (!application.additionalDocs || application.additionalDocs.length === 0) ? (
            <div className="rounded-xl border border-dashed p-8 text-center" style={{ borderColor: colors.border }}>
              <p style={{ color: colors.text, opacity: 0.6 }}>
                Aucun document n'a été joint à cette candidature
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CV */}
              {application.cvUrl && (
                <article className="rounded-xl border-2 p-6 hover:opacity-90 transition-all" style={{ borderColor: colors.border }}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: colors.text, opacity: 0.1 }}>
                      <Icon name="document" size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold mb-1" style={{ color: colors.text }}>CV</h4>
                      <p className="text-sm mb-3 break-all" style={{ color: colors.text, opacity: 0.6 }}>
                        {application.cvUrl.split('/').pop()}
                      </p>
                      <div className="flex gap-2">
                        <a
                          href={application.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                          style={{ backgroundColor: colors.text, color: colors.bg, opacity: 0.9 }}
                        >
                          Voir
                        </a>
                        <a
                          href={application.cvUrl}
                          download
                          className="text-xs px-3 py-1.5 border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                          style={{ borderColor: colors.border, color: colors.text }}
                        >
                          Télécharger
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* Lettre de motivation */}
              {application.coverLetterUrl && (
                <article className="rounded-xl border-2 p-6 hover:opacity-90 transition-all" style={{ borderColor: colors.border }}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: colors.text, opacity: 0.1 }}>
                      <Icon name="document" size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold mb-1" style={{ color: colors.text }}>Lettre de motivation</h4>
                      <p className="text-sm mb-3 break-all" style={{ color: colors.text, opacity: 0.6 }}>
                        {application.coverLetterUrl.split('/').pop()}
                      </p>
                      <div className="flex gap-2">
                        <a
                          href={application.coverLetterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                          style={{ backgroundColor: colors.text, color: colors.bg, opacity: 0.9 }}
                        >
                          Voir
                        </a>
                        <a
                          href={application.coverLetterUrl}
                          download
                          className="text-xs px-3 py-1.5 border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                          style={{ borderColor: colors.border, color: colors.text }}
                        >
                          Télécharger
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* Pièces jointes supplémentaires */}
              {application.additionalDocs?.map((docUrl, index) => (
                <article 
                  key={index}
                  className="rounded-xl border-2 p-6 hover:opacity-90 transition-all"
                  style={{ borderColor: colors.border }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: colors.text, opacity: 0.1 }}>
                      <Icon name="document" size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold mb-1" style={{ color: colors.text }}>Document {index + 1}</h4>
                      <p className="text-sm mb-3 break-all" style={{ color: colors.text, opacity: 0.6 }}>
                        {docUrl.split('/').pop()}
                      </p>
                      <div className="flex gap-2">
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                          style={{ backgroundColor: colors.text, color: colors.bg, opacity: 0.9 }}
                        >
                          Voir
                        </a>
                        <a
                          href={docUrl}
                          download
                          className="text-xs px-3 py-1.5 border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                          style={{ borderColor: colors.border, color: colors.text }}
                        >
                          Télécharger
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Offre d'emploi associée */}
        <section className="mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.text }}>
            <Icon name="briefcase" size={24} className="opacity-100" />
            Offre d'emploi associée
          </h3>
          
          <article 
            className="rounded-xl border-2 p-6 hover:opacity-90 transition-all cursor-pointer"
            style={{ borderColor: colors.border }}
            onClick={() => navigate(`/offres/${application.offer.id}`)}
            role="button"
            tabIndex={0}
            aria-label={`Voir l'offre complète pour ${application.offer.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate(`/offres/${application.offer.id}`);
              }
            }}
          >
            <h4 className="text-lg font-bold mb-2" style={{ color: colors.text }}>
              {application.offer.title}
            </h4>
            <div className="flex flex-wrap gap-2 mb-3 text-sm" style={{ color: colors.text, opacity: 0.6 }}>
              <span className="flex items-center gap-1">
                <Icon name="location" size={14} />
                {application.offer.location}
              </span>
              <span>•</span>
              <span>{application.offer.contract}</span>
              <span>•</span>
              <span>{application.offer.experience}</span>
            </div>
            <p className="mb-4 line-clamp-3" style={{ color: colors.text, opacity: 0.8 }}>
              {application.offer.description}
            </p>
            <div className="inline-flex items-center gap-2 font-medium transition-colors" style={{ color: colors.text }}>
              Voir l'offre complète
              <Icon name="arrow-right" size={16} />
            </div>
          </article>
        </section>

      </main>
      
      <ScrollToTopButton />
      </div>
    </div>
  );
};

