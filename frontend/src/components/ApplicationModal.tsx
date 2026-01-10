import { useState, useEffect } from 'react';
import { FileUpload } from './FileUpload';
import { CloseIcon } from './icons';
import apiClient from '../api/apiClient';
import { toastService } from '../services/toastService';
import type { ApplicationDocument } from '../types';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerId: number;
  offerTitle: string;
  companyName: string;
  onSuccess: () => void;
}

export const ApplicationModal = ({
  isOpen,
  onClose,
  offerId,
  offerTitle,
  companyName,
  onSuccess,
}: ApplicationModalProps) => {
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [creatingApplication, setCreatingApplication] = useState(false);
  const [cvUploaded, setCvUploaded] = useState(false);
  const [coverLetterUploaded, setCoverLetterUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Créer la candidature quand la modale s'ouvre
  useEffect(() => {
    if (isOpen && !applicationId && !creatingApplication) {
      createApplication();
    }
  }, [isOpen]);

  // Réinitialiser l'état quand la modale se ferme
  useEffect(() => {
    if (!isOpen) {
      setApplicationId(null);
      setCvUploaded(false);
      setCoverLetterUploaded(false);
      setError(null);
    }
  }, [isOpen]);

  const createApplication = async () => {
    setCreatingApplication(true);
    setError(null);

    try {
      const response = await apiClient.post('/applications', { offerId });
      setApplicationId(response.data.application.id);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erreur lors de la création de la candidature';
      setError(errorMessage);
      toastService.error(errorMessage);
      // Fermer la modale en cas d'erreur
      setTimeout(() => {
        onClose();
      }, 2000);
    } finally {
      setCreatingApplication(false);
    }
  };

  const handleCvUploadSuccess = (document: ApplicationDocument) => {
    setCvUploaded(true);
    toastService.success('CV uploadé avec succès');
  };

  const handleCoverLetterUploadSuccess = (document: ApplicationDocument) => {
    setCoverLetterUploaded(true);
    toastService.success('Lettre de motivation uploadée avec succès');
  };

  const handleSubmit = async () => {
    if (!cvUploaded) {
      setError('Le CV est obligatoire pour postuler');
      toastService.error('Le CV est obligatoire pour postuler');
      return;
    }

    // La candidature est déjà créée et le CV est uploadé
    // On peut fermer la modale maintenant
    toastService.success('Candidature envoyée avec succès !');
    onSuccess();
    onClose();
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="application-modal-title"
    >
      <div
        className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2
              id="application-modal-title"
              className="text-2xl font-bold text-white"
            >
              Postuler à l'offre
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {offerTitle} - {companyName}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Fermer la fenêtre de candidature"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {creatingApplication ? (
            <div className="text-center py-8">
              <p className="text-slate-400">Création de la candidature...</p>
            </div>
          ) : !applicationId ? (
            <div className="text-center py-8">
              <p className="text-red-400" role="alert">
                {error || 'Erreur lors de la création de la candidature'}
              </p>
            </div>
          ) : (
            <>
              {/* Instructions */}
              <div className="bg-sky-500/10 border border-sky-500/30 rounded-lg p-4">
                <p className="text-sm text-slate-300">
                  <strong className="text-sky-400">CV (obligatoire) :</strong> Veuillez uploader votre CV pour finaliser votre candidature.
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  <strong>Lettre de motivation (optionnelle) :</strong> Vous pouvez également joindre une lettre de motivation.
                </p>
              </div>

              {/* CV Upload */}
              <div>
                <FileUpload
                  applicationId={applicationId}
                  documentType="CV"
                  existingDocument={null}
                  onUploadSuccess={handleCvUploadSuccess}
                  label="CV *"
                />
              </div>

              {/* Cover Letter Upload */}
              <div>
                <FileUpload
                  applicationId={applicationId}
                  documentType="COVER_LETTER"
                  existingDocument={null}
                  onUploadSuccess={handleCoverLetterUploadSuccess}
                  label="Lettre de motivation"
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-sm text-red-400" role="alert">
                    {error}
                  </p>
                </div>
              )}

              {/* Submit button */}
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={handleClose}
                  disabled={submitting}
                  className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!cvUploaded || submitting}
                  className={`
                    flex-1 py-3 px-4 rounded-lg font-medium transition-colors
                    focus:outline-none focus:ring-2 focus:ring-sky-500
                    ${
                      !cvUploaded || submitting
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-sky-600 hover:bg-sky-500 text-white'
                    }
                  `}
                  aria-label={
                    !cvUploaded
                      ? 'Le CV est obligatoire pour finaliser la candidature'
                      : 'Finaliser la candidature'
                  }
                >
                  {submitting ? 'Envoi...' : 'Finaliser la candidature'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
