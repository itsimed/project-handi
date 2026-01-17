/**
 * ApplicationDocumentsModal - Modal pour afficher les documents d'une candidature
 * Permet aux recruteurs de consulter et télécharger le CV et la lettre de motivation
 * Conforme RGAA/WCAG AA
 */

import { useEffect, useRef } from 'react';
import { CloseIcon, DocumentIcon } from './icons';
import { Icon } from './Icon';
import { useTheme } from '../contexts/AccessibilityContext';
import type { Application } from '../types';
import { applicationService } from '../services';
import { API_CONFIG } from '../constants';

interface ApplicationDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onStatusUpdate?: (applicationId: number, newStatus: 'VIEWED' | 'NOT_VIEWED') => void;
}

export const ApplicationDocumentsModal: React.FC<ApplicationDocumentsModalProps> = ({
  isOpen,
  onClose,
  application,
  onStatusUpdate,
}) => {
  const { colors } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Gérer la fermeture avec Escape et la navigation clavier
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Gérer le focus trap (navigation clavier dans le modal)
    const handleTab = (e: KeyboardEvent) => {
      if (!modalRef.current || e.key !== 'Tab') return;
      
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);
    
    // Focus sur le bouton de fermeture à l'ouverture
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
    };
  }, [isOpen, onClose]);

  // Empêcher le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Mettre à jour le statut automatiquement quand le modal s'ouvre
  useEffect(() => {
    if (isOpen && application && application.status === 'NOT_VIEWED') {
      const updateStatus = async () => {
        try {
          await applicationService.updateApplicationStatus(application.id, { status: 'VIEWED' });
          // Notifier le parent pour mettre à jour l'état local
          onStatusUpdate?.(application.id, 'VIEWED');
        } catch (error) {
          console.error('Erreur lors de la mise à jour du statut:', error);
          // Erreur silencieuse pour ne pas perturber l'expérience utilisateur
        }
      };
      updateStatus();
    }
  }, [isOpen, application, onStatusUpdate]);

  if (!isOpen || !application) return null;


  const downloadDocument = async (documentId: number, filename: string) => {
    try {
      // Utiliser apiClient pour avoir l'authentification automatique
      const response = await fetch(`${API_CONFIG.BASE_URL}/documents/${documentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      // Fallback : ouvrir dans un nouvel onglet
      openInNewTab(documentId);
    }
  };

  const openInNewTab = async (documentId: number) => {
    try {
      // Charger le document avec authentification
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Erreur : Token d\'authentification manquant');
        return;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/documents/${documentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
        console.error('Erreur lors du chargement du document:', errorData);
        alert(`Erreur : ${errorData.error || 'Erreur lors du chargement du document'}`);
        return;
      }

      // Créer un blob URL
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Créer un lien <a> invisible et le cliquer pour ouvrir dans un nouvel onglet
      // Cette approche est généralement mieux acceptée par les navigateurs que window.open()
      const link = document.createElement('a');
      link.href = blobUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Nettoyer le blob URL après un délai
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (error: any) {
      console.error('Erreur lors de l\'ouverture du document:', error);
      alert(`Erreur lors de l'ouverture du document: ${error.message || 'Erreur inconnue'}`);
    }
  };

  // Récupérer les documents CV et lettre de motivation depuis la relation documents
  const cvDocument = application.documents?.find((d: any) => d.documentType === 'CV');
  const coverLetterDocument = application.documents?.find((d: any) => d.documentType === 'COVER_LETTER');

  const candidateName = application.user 
    ? `${application.user.firstName} ${application.user.lastName}`
    : 'Candidat';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="rounded-xl border-2 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{
          backgroundColor: colors.bg,
          borderColor: colors.border,
          color: colors.text,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2" style={{ borderColor: colors.border }}>
          <div>
            <h2 id="modal-title" className="text-2xl font-bold" style={{ color: colors.text }}>
              Documents de {candidateName}
            </h2>
            <p className="text-sm mt-1" style={{ color: colors.text, opacity: 0.7 }}>
              {application.user?.email}
            </p>
            <p className="text-xs mt-1" style={{ color: colors.text, opacity: 0.6 }}>
              Candidature du {new Date(application.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 rounded-lg transition-all hover:opacity-70 focus:outline-none focus:ring-2"
            style={{ color: colors.text }}
            aria-label="Fermer le modal"
          >
            <CloseIcon size={24} aria-hidden="true" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* CV Section */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: colors.text }}>
              <DocumentIcon size={24} aria-hidden="true" />
              CV
            </h3>
            
            {cvDocument ?
            (
              <div className="border-2 rounded-lg p-6" style={{ borderColor: colors.border }}>
                <div className="flex-col">
                  <button
                    onClick={() => openInNewTab(cvDocument.id)}
                    className="px-4 py-2 rounded-lg font-medium border-2 transition-all flex items-center mb-3 gap-2 hover:opacity-80"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.bg,
                      color: colors.text
                    }}
                    aria-label="Consulter le CV"
                  >
                    <Icon name="arrow-right" size={16} aria-hidden={true} />
                    Consulter
                  </button>
                  <button
                    onClick={() => downloadDocument(cvDocument.id, cvDocument.fileName || `${candidateName}_CV.pdf`)}
                    className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:opacity-80"
                    style={{
                      backgroundColor: colors.text,
                      color: colors.bg
                    }}
                    aria-label="Télécharger le CV"
                  >
                    <Icon name="arrow-right" size={16} aria-hidden={true} className="rotate-[90deg]" />
                    Télécharger
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 rounded-lg p-8 text-center" style={{ borderColor: colors.border }}>
                <p style={{ color: colors.text, opacity: 0.6 }}>
                  CV non disponible
                </p>
              </div>
            )}
          </section>

          {/* Cover Letter Section */}
          {coverLetterDocument && (
            <section>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: colors.text }}>
                    <Icon name="document" size={24} aria-hidden={true} />
                Lettre de motivation
              </h3>
              
              <div className="border-2 rounded-lg p-6" style={{ borderColor: colors.border }}>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => openInNewTab(coverLetterDocument.id)}
                    className="px-4 py-2 rounded-lg font-medium border-2 transition-all flex items-center gap-2 hover:opacity-80"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.bg,
                      color: colors.text
                    }}
                    aria-label="Consulter la lettre de motivation"
                  >
                    <Icon name="arrow-right" size={16} aria-hidden={true} />
                    Consulter
                  </button>
                  <button
                    onClick={() => downloadDocument(coverLetterDocument.id, coverLetterDocument.fileName || `${candidateName}_Lettre_Motivation.pdf`)}
                    className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:opacity-80"
                    style={{
                      backgroundColor: colors.text,
                      color: colors.bg
                    }}
                    aria-label="Télécharger la lettre de motivation"
                  >
                    <Icon name="arrow-right" size={16} aria-hidden={true} className="rotate-[-90deg]" />
                    Télécharger
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t-2" style={{ borderColor: colors.border }}>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-medium border-2 transition-all hover:opacity-80"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.bg,
              color: colors.text
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
