/**
 * RecruiterOfferDetailPage - Détail d'une offre pour le recruteur
 * Gestion complet: pause, suppression, modification, consultation des candidatures
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { Navbar } from '../components/Navbar';
import { Breadcrumb } from '../components/Breadcrumb';
import { useTheme } from '../contexts/AccessibilityContext';
import { toastService } from '../services/toastService';
import type { Offer, Application } from '../types';
import { CheckIcon, CloseIcon, DocumentIcon } from '../components/icons';
import { Icon } from '../components/Icon';
import { ScrollToTopButton } from '../components/ScrollToTopButton';
import { ApplicationDocumentsModal } from '../components/ApplicationDocumentsModal';

interface OfferWithApplications extends Offer {
  applications?: Application[];
  status?: 'ACTIVE' | 'PAUSED';
}

export const RecruiterOfferDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { colors, theme } = useTheme();
  const [offer, setOffer] = useState<OfferWithApplications | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOfferDetail();
    }
  }, [id]);

  const fetchOfferDetail = async () => {
    try {
      setIsLoading(true);
      const [offerRes, appsRes] = await Promise.all([
        apiClient.get(`/offers/${id}`),
        apiClient.get(`/applications/offer/${id}`)
      ]);
      
      setOffer(offerRes.data);
      setApplications(appsRes.data || []);
    } catch (error: any) {
      toastService.error('Erreur lors du chargement de l\'offre');
      navigate('/recruteur/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePauseOffer = async () => {
    if (!offer) return;
    
    try {
      setIsActionLoading(true);
      const newStatus = offer.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
      const response = await apiClient.put(`/offers/${offer.id}`, { status: newStatus });
      
      // Mettre à jour l'offre avec les données retournées par l'API
      setOffer({ ...offer, status: newStatus });
      toastService.success(
        newStatus === 'PAUSED' 
          ? 'Offre mise en pause' 
          : 'Offre réactivée'
      );
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Erreur lors de la modification du statut';
      toastService.error(errorMessage);
      console.error('Erreur lors de la mise en pause/réactivation:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteOffer = async () => {
    if (!offer) return;
    
    try {
      setIsActionLoading(true);
      await apiClient.delete(`/offers/${offer.id}`);
      
      toastService.success('Offre supprimée avec succès');
      navigate('/recruteur/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Erreur lors de la suppression de l\'offre';
      toastService.error(errorMessage);
      console.error('Erreur lors de la suppression:', error);
      setShowDeleteConfirm(false);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEditOffer = () => {
    if (!offer) return;
    navigate(`/recruteur/modifier-offre/${offer.id}`);
  };

  const handleApplicationClick = (application: Application) => {
    setSelectedApplication(application);
    setIsDocumentsModalOpen(true);
  };

  const handleStatusUpdate = (applicationId: number, newStatus: 'VIEWED' | 'NOT_VIEWED') => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    ));
    // Mettre à jour aussi l'offre si elle contient les applications
    if (offer) {
      setOffer(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          applications: prev.applications?.map(app => 
            app.id === applicationId ? { ...app, status: newStatus } : app
          )
        };
      });
    }
  };


  const getContractLabel = (contract: string | string[]): string => {
    const labels: Record<string, string> = {
      CDI: 'CDI',
      CDD: 'CDD',
      STAGE: 'Stage',
      ALTERNANCE: 'Alternance',
      INTERIM: 'Intérim',
    };
    const contracts = Array.isArray(contract) ? contract : [contract];
    return contracts.map(c => labels[c] || c).join(', ');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.bg }}>
        <Navbar />
        <Breadcrumb />
        <div className="container mx-auto px-6 py-12">
          <div style={{ color: colors.text, opacity: 0.6 }}>Chargement...</div>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.bg }}>
        <Navbar />
        <Breadcrumb />
        <div className="container mx-auto px-6 py-12">
          <div style={{ color: colors.text }}>Offre introuvable</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.bg }}>
      <Navbar />
      <Breadcrumb />

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header avec titre et actions */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: colors.text }}>
              {offer.title}
            </h1>
            <p style={{ color: colors.text, opacity: 0.7 }}>
              {offer.company?.name} • {getContractLabel(offer.contract)}
            </p>
          </div>

          {/* Status Badge */}
          <span
            className="px-4 py-2 rounded-full text-sm font-semibold border"
            style={{
              backgroundColor:
                offer.status === 'PAUSED'
                  ? 'rgba(255,99,99,0.1)'
                  : 'rgba(16,185,129,0.1)',
              borderColor:
                offer.status === 'PAUSED'
                  ? 'rgba(255,99,99,0.35)'
                  : 'rgba(16,185,129,0.35)',
              color: offer.status === 'PAUSED' ? '#ff8a8a' : '#10b981'
            }}
          >
            {offer.status === 'PAUSED' ? 'En pause' : 'Active'}
          </span>
        </div>

        {/* Actions principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <button
            onClick={handleEditOffer}
            disabled={isActionLoading}
            className="px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
            style={{
              backgroundColor: colors.text,
              color: colors.bg
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Modifier
          </button>

          <button
            onClick={handlePauseOffer}
            disabled={isActionLoading}
            className="px-4 py-3 rounded-lg font-medium border transition-all flex items-center gap-2"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.bg,
              color: colors.text
            }}
          >
            {offer.status === 'ACTIVE' ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                Suspendre
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Réactiver
              </>
            )}
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isActionLoading}
            className="px-4 py-3 rounded-lg font-medium border transition-all flex items-center gap-2"
            style={{
              borderColor: 'rgba(255,99,99,0.5)',
              backgroundColor: 'rgba(255,99,99,0.05)',
              color: '#ff8a8a'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            Supprimer
          </button>
        </div>

        {/* Détails de l'offre */}
        <div className="border-2 rounded-xl p-6 mb-8" style={{ borderColor: colors.border }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
            Détails de l'offre
          </h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <dt className="font-semibold" style={{ color: colors.text }}>Localisation</dt>
              <dd style={{ color: colors.text, opacity: 0.7 }}>{offer.location}</dd>
            </div>
            <div>
              <dt className="font-semibold" style={{ color: colors.text }}>Expérience requise</dt>
              <dd style={{ color: colors.text, opacity: 0.7 }}>{offer.experience}</dd>
            </div>
            <div>
              <dt className="font-semibold" style={{ color: colors.text }}>Type de contrat</dt>
              <dd style={{ color: colors.text, opacity: 0.7 }}>{getContractLabel(offer.contract)}</dd>
            </div>
            <div>
              <dt className="font-semibold" style={{ color: colors.text }}>Télétravail</dt>
              <dd style={{ color: colors.text, opacity: 0.7 }}>
                {offer.remote === 'FULL_REMOTE' ? 'Complet' : offer.remote === 'HYBRID' ? 'Partiel' : 'Présentiel'}
              </dd>
            </div>
          </dl>

          <div className="mt-6 pt-6 border-t" style={{ borderColor: colors.border }}>
            <h3 className="font-semibold mb-3" style={{ color: colors.text }}>Description</h3>
            <p style={{ color: colors.text, opacity: 0.8, whiteSpace: 'pre-wrap' }}>
              {offer.description}
            </p>
          </div>
        </div>

        {/* Candidatures */}
        <div className="border-2 rounded-xl p-6" style={{ borderColor: colors.border }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
            Candidatures ({applications.length})
          </h2>

          {applications.length === 0 ? (
            <p style={{ color: colors.text, opacity: 0.6, textAlign: 'center', paddingY: '3rem' }}>
              Aucune candidature pour cette offre
            </p>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => handleApplicationClick(app)}
                  className="border rounded-lg p-4 transition-all cursor-pointer hover:border-opacity-100 hover:scale-[1.01]"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: app.status === 'NOT_VIEWED' ? `${colors.text}08` : 'transparent'
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleApplicationClick(app);
                    }
                  }}
                  aria-label={`Voir les documents de ${app.user?.firstName} ${app.user?.lastName}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold" style={{ color: colors.text }}>
                        {app.user?.firstName} {app.user?.lastName}
                      </h3>
                      <p style={{ color: colors.text, opacity: 0.6, fontSize: '0.875rem' }}>
                        {app.user?.email}
                      </p>
                    </div>

                    <span
                      className="px-3 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor:
                          app.status === 'VIEWED'
                            ? 'rgba(16,185,129,0.1)'
                            : 'rgba(255,193,7,0.1)',
                        color:
                          app.status === 'VIEWED' ? '#10b981' : '#ffc107',
                        border:
                          app.status === 'VIEWED'
                            ? '1px solid rgba(16,185,129,0.35)'
                            : '1px solid rgba(255,193,7,0.35)'
                      }}
                    >
                      {app.status === 'VIEWED' ? 'Consultée' : 'Non consultée'}
                    </span>
                  </div>

                  <p style={{ color: colors.text, opacity: 0.5, fontSize: '0.875rem', marginBottom: '1rem' }}>
                    Postulé le {new Date(app.createdAt).toLocaleDateString('fr-FR')}
                  </p>

                  {/* Document actions - Gardés comme alternative rapide */}
                  <div className="flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                    {app.cvUrl && (
                      <a
                        href={app.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded text-sm font-medium flex items-center gap-2"
                        style={{
                          backgroundColor: `${colors.text}15`,
                          color: colors.text,
                          border: `1px solid ${colors.border}`
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DocumentIcon size={16} aria-hidden="true" />
                        Voir le CV
                      </a>
                    )}
                    {app.coverLetterUrl && (
                      <a
                        href={app.coverLetterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded text-sm font-medium flex items-center gap-2"
                        style={{
                          backgroundColor: `${colors.text}15`,
                          color: colors.text,
                          border: `1px solid ${colors.border}`
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Icon name="document" size={16} aria-hidden="true" />
                        Voir lettre
                      </a>
                    )}
                  </div>

                  {/* Mark as viewed button */}
                  {app.status === 'NOT_VIEWED' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implémenter le marquer comme consulté
                        toastService.success('Marquée comme consultée');
                      }}
                      className="mt-3 w-full px-3 py-2 rounded text-sm font-medium transition-all flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: 'rgba(16,185,129,0.1)',
                        color: '#10b981',
                        border: '1px solid rgba(16,185,129,0.35)'
                      }}
                    >
                      <CheckIcon size={16} aria-hidden="true" />
                      Marquer comme consultée
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div
              className="rounded-lg border-2 w-full max-w-md p-6"
              style={{
                backgroundColor: colors.bg,
                borderColor: colors.border,
                color: colors.text
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-3" style={{ color: colors.text }}>
                Supprimer l'offre ?
              </h2>
              <p style={{ color: colors.text, opacity: 0.7, marginBottom: '1.5rem' }}>
                Cette action est irréversible. Toutes les candidatures associées seront supprimées.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isActionLoading}
                  className="flex-1 px-4 py-2 rounded-lg font-medium border"
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteOffer}
                  disabled={isActionLoading}
                  className="flex-1 px-4 py-2 rounded-lg font-medium"
                  style={{
                    backgroundColor: '#ff6363',
                    color: '#fff'
                  }}
                >
                  {isActionLoading ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Application Documents Modal */}
      <ApplicationDocumentsModal
        isOpen={isDocumentsModalOpen}
        onClose={() => {
          setIsDocumentsModalOpen(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
        onStatusUpdate={handleStatusUpdate}
      />

      <ScrollToTopButton />
    </div>
  );
};
