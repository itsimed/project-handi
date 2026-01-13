import { useEffect, useRef, useState } from 'react';
import { CloseIcon } from './icons';
import apiClient from '../api/apiClient';
import { toastService } from '../services/toastService';
import { useTheme } from '../contexts/AccessibilityContext';

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
  const { colors, theme } = useTheme();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cvInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Réinitialiser l'état quand la modale se ferme
  useEffect(() => {
    if (!isOpen) {
      setCvFile(null);
      setCoverLetterFile(null);
      setError(null);
      setSubmitting(false);
    }
  }, [isOpen]);

  const validateFile = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (file.size > maxSize) {
      throw new Error('Fichier trop volumineux (max 5MB)');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Type de fichier non autorisé (PDF, DOC, DOCX uniquement)');
    }
  };

  const handleFileSelect = (file: File, type: 'CV' | 'COVER_LETTER') => {
    try {
      validateFile(file);
      setError(null);

      if (type === 'CV') {
        setCvFile(file);
      } else {
        setCoverLetterFile(file);
      }
    } catch (err: any) {
      setError(err.message);
      toastService.error(err.message);
    }
  };

  const uploadDocument = async (
    applicationId: number,
    file: File,
    documentType: 'CV' | 'COVER_LETTER'
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('applicationId', applicationId.toString());
    formData.append('documentType', documentType);

    const token =
      localStorage.getItem('token') || localStorage.getItem('auth_token');

    const response = await fetch('http://localhost:4000/api/v1/documents/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Erreur lors de l'upload");
    }
  };

  const handleSubmit = async () => {
    if (!cvFile) {
      setError('Le CV est obligatoire pour postuler');
      toastService.error('Le CV est obligatoire pour postuler');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const applicationResponse = await apiClient.post('/applications', {
        offerId,
      });

      const createdApplicationId =
        applicationResponse.data.application?.id || applicationResponse.data.id;

      if (!createdApplicationId) {
        throw new Error('Application non créée');
      }

      await uploadDocument(createdApplicationId, cvFile, 'CV');

      if (coverLetterFile) {
        await uploadDocument(createdApplicationId, coverLetterFile, 'COVER_LETTER');
      }

      toastService.success('Candidature envoyée avec succès !');
      onSuccess();
      onClose();
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || 'Erreur lors de la candidature';
      setError(message);
      toastService.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="application-modal-title"
    >
      <div
        className="rounded-2xl border w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: `${colors.border}33` }}
        >
          <div>
            <h2
              id="application-modal-title"
              className="text-2xl font-bold"
              style={{ color: colors.text }}
            >
              Postuler à l'offre
            </h2>
            <p className="text-sm mt-1" style={{ color: `${colors.text}CC` }}>
              {offerTitle} - {companyName}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="p-2 rounded-lg transition-colors focus:outline-none focus:ring-2"
            style={{
              color: colors.text,
              backgroundColor: 'transparent',
              borderColor: `${colors.border}66`,
            }}
            aria-label="Fermer la fenêtre de candidature"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6" style={{ color: colors.text }}>
          <>
            {/* Instructions */}
            <div
              className="rounded-lg p-4 border"
              style={{
                backgroundColor:
                  theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(35,2,46,0.05)',
                borderColor: `${colors.border}33`,
              }}
            >
              <p className="text-sm" style={{ color: colors.text }}>
                <strong style={{ color: theme === 'dark' ? '#F7C9FF' : '#23022E' }}>
                  CV (obligatoire) :
                </strong>{' '}
                Veuillez sélectionner votre CV avant d'envoyer la candidature.
              </p>
              <p className="text-sm mt-2" style={{ color: `${colors.text}CC` }}>
                <strong>Lettre de motivation (optionnelle) :</strong> Vous pouvez également joindre une lettre de motivation.
              </p>
            </div>

            {/* CV Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-medium" style={{ color: colors.text }}>
                CV *
              </label>
              <div
                onClick={() => cvInputRef.current?.click()}
                className="relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200"
                style={{
                  borderColor: colors.border,
                  backgroundColor:
                    theme === 'dark' ? 'rgba(255,255,255,0.03)' : '#F8F5FB',
                  color: colors.text,
                }}
              >
                <input
                  ref={cvInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file, 'CV');
                  }}
                  aria-label="Sélectionner un CV"
                />
                {cvFile ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium" style={{ color: colors.text }}>
                      {cvFile.name}
                    </p>
                    <p className="text-xs" style={{ color: `${colors.text}B3` }}>
                      {(cvFile.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCvFile(null);
                      }}
                      className="mt-2 inline-flex items-center justify-center px-3 py-2 text-xs font-medium rounded-lg"
                      style={{
                        backgroundColor: theme === 'dark' ? '#FFFFFF' : '#23022E',
                        color: theme === 'dark' ? '#23022E' : '#FFFFFF',
                      }}
                    >
                      Retirer
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm" style={{ color: colors.text }}>
                      Glissez-déposez ou cliquez pour sélectionner
                    </p>
                    <p className="text-xs" style={{ color: `${colors.text}99` }}>
                      PDF, DOC, DOCX (max 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Letter Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-medium" style={{ color: colors.text }}>
                Lettre de motivation (optionnel)
              </label>
              <div
                onClick={() => coverInputRef.current?.click()}
                className="relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200"
                style={{
                  borderColor: colors.border,
                  backgroundColor:
                    theme === 'dark' ? 'rgba(255,255,255,0.03)' : '#F8F5FB',
                  color: colors.text,
                }}
              >
                <input
                  ref={coverInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file, 'COVER_LETTER');
                  }}
                  aria-label="Sélectionner une lettre de motivation"
                />
                {coverLetterFile ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium" style={{ color: colors.text }}>
                      {coverLetterFile.name}
                    </p>
                    <p className="text-xs" style={{ color: `${colors.text}B3` }}>
                      {(coverLetterFile.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCoverLetterFile(null);
                      }}
                      className="mt-2 inline-flex items-center justify-center px-3 py-2 text-xs font-medium rounded-lg"
                      style={{
                        backgroundColor: theme === 'dark' ? '#FFFFFF' : '#23022E',
                        color: theme === 'dark' ? '#23022E' : '#FFFFFF',
                      }}
                    >
                      Retirer
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm" style={{ color: colors.text }}>
                      Glissez-déposez ou cliquez pour sélectionner (optionnel)
                    </p>
                    <p className="text-xs" style={{ color: `${colors.text}99` }}>
                      PDF, DOC, DOCX (max 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                className="rounded-lg p-4 border"
                style={{ backgroundColor: 'rgba(255, 99, 99, 0.08)', borderColor: 'rgba(255, 99, 99, 0.35)' }}
              >
                <p className="text-sm" style={{ color: '#ff8a8a' }} role="alert">
                  {error}
                </p>
              </div>
            )}

            {/* Submit button */}
            <div
              className="flex gap-3 pt-4 border-t"
              style={{ borderColor: `${colors.border}33` }}
            >
              <button
                onClick={handleClose}
                disabled={submitting}
                className="flex-1 py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed border"
                style={{
                  backgroundColor: colors.bgSecondary,
                  color: colors.text,
                  borderColor: `${colors.border}66`,
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={!cvFile || submitting}
                className={`
                  flex-1 py-3 px-4 rounded-lg font-medium transition-colors
                  focus:outline-none focus:ring-2
                  ${!cvFile || submitting ? 'cursor-not-allowed opacity-60' : ''}
                `}
                style={{
                  backgroundColor: theme === 'dark' ? '#FFFFFF' : '#23022E',
                  color: theme === 'dark' ? '#23022E' : '#FFFFFF',
                  border: `1px solid ${theme === 'dark' ? '#23022E' : '#FFFFFF'}`,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                }}
                aria-label={
                  !cvFile
                    ? 'Le CV est obligatoire pour finaliser la candidature'
                    : 'Finaliser la candidature'
                }
              >
                {submitting ? 'Envoi...' : 'Finaliser la candidature'}
              </button>
            </div>
          </>
        </div>
      </div>
    </div>
  );
};
