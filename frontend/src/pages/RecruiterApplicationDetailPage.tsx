/**
 * RecruiterApplicationDetailPage - Page de détail d'une candidature pour le recruteur
 * Affiche les informations complètes d'une candidature
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { Navbar } from '../components/Navbar';
import { Breadcrumb } from '../components/Breadcrumb';
import { Icon } from '../components/Icon';
import { useTheme } from '../contexts/AccessibilityContext';
import { ScrollToTopButton } from '../components/ScrollToTopButton';
import { toastService } from '../services/toastService';
import type { Application } from '../types';

export const RecruiterApplicationDetailPage = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { colors } = useTheme();
  
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetail();
    }
  }, [applicationId]);

  const fetchApplicationDetail = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/applications/${applicationId}`);
      setApplication(response.data);
      
      // Marquer comme consultée si ce n'est pas déjà le cas
      if (response.data.status === 'NOT_VIEWED') {
        await apiClient.put(`/applications/${applicationId}/status`, { status: 'VIEWED' });
        setApplication(prev => prev ? { ...prev, status: 'VIEWED' } : null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toastService.error('Erreur lors du chargement de la candidature');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadDocument = async (url: string, filename: string) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toastService.success('Téléchargement en cours...');
    } catch (error) {
      toastService.error('Erreur lors du téléchargement');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.bg }}>
        <Navbar variant="recruiter" />
        <Breadcrumb />
        <div className="container mx-auto px-6 py-12 max-w-7xl text-center" style={{ color: colors.text }}>
          Chargement...
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.bg }}>
        <Navbar variant="recruiter" />
        <Breadcrumb />
        <div className="container mx-auto px-6 py-12 max-w-7xl text-center" style={{ color: colors.text }}>
          Candidature non trouvée
        </div>
      </div>
    );
  }

  const statusBadge = application.status === 'VIEWED' ? {
    label: 'Consultée',
    bgColor: '#10b98133',
    textColor: '#10b981',
    borderColor: '#10b98166'
  } : {
    label: 'Non consultée',
    bgColor: '#eab30833',
    textColor: '#d97706',
    borderColor: '#d9770666'
  };

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
        <Navbar variant="recruiter" />
        <Breadcrumb />

        <main className="container mx-auto px-6 py-8 max-w-5xl">
          {/* Bouton retour */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 px-4 py-2 rounded-xl font-semibold transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 inline-flex items-center gap-2"
            style={{ 
              backgroundColor: colors.text,
              color: colors.bg
            }}
          >
            <Icon name="chevron-left" size={18} />
            Retour
          </button>

          {/* Informations du candidat */}
          <div className="border-2 rounded-2xl p-6 mb-6" style={{ borderColor: colors.border }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
                  {application.user?.firstName} {application.user?.lastName}
                </h1>
                <div className="flex items-center gap-2 text-sm" style={{ color: colors.text, opacity: 0.75 }}>
                  <Icon name="message" size={16} />
                  {application.user?.email}
                </div>
              </div>
              
              <span 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2"
                style={{
                  backgroundColor: statusBadge.bgColor,
                  color: statusBadge.textColor,
                  borderColor: statusBadge.borderColor
                }}
              >
                <Icon name={application.status === 'VIEWED' ? 'check' : 'clock'} size={12} />
                {statusBadge.label}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: colors.border }}>
              <div>
                <div className="text-sm mb-1" style={{ color: colors.text, opacity: 0.6 }}>Poste</div>
                <div className="font-semibold flex items-center gap-2" style={{ color: colors.text }}>
                  <Icon name="briefcase" size={16} />
                  {application.offer?.title}
                </div>
              </div>
              <div>
                <div className="text-sm mb-1" style={{ color: colors.text, opacity: 0.6 }}>Date de candidature</div>
                <div className="font-semibold flex items-center gap-2" style={{ color: colors.text }}>
                  <Icon name="calendar" size={16} />
                  {new Date(application.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="border-2 rounded-2xl p-6" style={{ borderColor: colors.border }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
              Documents de candidature
            </h2>

            <div className="space-y-4">
              {/* CV */}
              {application.cvUrl && (
                <div className="border-2 rounded-xl p-5" style={{ borderColor: colors.border }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: colors.text, opacity: 0.1 }}>
                        <Icon name="document" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold mb-1" style={{ color: colors.text }}>CV</h3>
                        <p className="text-sm" style={{ color: colors.text, opacity: 0.6 }}>
                          {application.cvUrl.split('/').pop()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadDocument(application.cvUrl!, 'CV.pdf')}
                      className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:opacity-90 flex items-center gap-2"
                      style={{ 
                        backgroundColor: colors.text,
                        color: colors.bg
                      }}
                    >
                      <Icon name="arrow-right" size={16} />
                      Télécharger
                    </button>
                  </div>
                </div>
              )}

              {/* Lettre de motivation */}
              {application.coverLetterUrl && (
                <div className="border-2 rounded-xl p-5" style={{ borderColor: colors.border }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: colors.text, opacity: 0.1 }}>
                        <Icon name="document" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold mb-1" style={{ color: colors.text }}>Lettre de motivation</h3>
                        <p className="text-sm" style={{ color: colors.text, opacity: 0.6 }}>
                          {application.coverLetterUrl.split('/').pop()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadDocument(application.coverLetterUrl!, 'Lettre_motivation.pdf')}
                      className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:opacity-90 flex items-center gap-2"
                      style={{ 
                        backgroundColor: colors.text,
                        color: colors.bg
                      }}
                    >
                      <Icon name="arrow-right" size={16} />
                      Télécharger
                    </button>
                  </div>
                </div>
              )}

              {/* Documents additionnels */}
              {application.additionalDocs && application.additionalDocs.length > 0 && (
                application.additionalDocs.map((docUrl: string, index: number) => (
                  <div key={index} className="border-2 rounded-xl p-5" style={{ borderColor: colors.border }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: colors.text, opacity: 0.1 }}>
                          <Icon name="document" size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold mb-1" style={{ color: colors.text }}>Document {index + 1}</h3>
                          <p className="text-sm" style={{ color: colors.text, opacity: 0.6 }}>
                            {docUrl.split('/').pop()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => downloadDocument(docUrl, `Document_${index + 1}.pdf`)}
                        className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:opacity-90 flex items-center gap-2"
                        style={{ 
                          backgroundColor: colors.text,
                          color: colors.bg
                        }}
                      >
                        <Icon name="arrow-right" size={16} />
                        Télécharger
                      </button>
                    </div>
                  </div>
                ))
              )}

              {!application.cvUrl && !application.coverLetterUrl && (!application.additionalDocs || application.additionalDocs.length === 0) && (
                <div className="text-center py-8" style={{ color: colors.text, opacity: 0.6 }}>
                  Aucun document disponible
                </div>
              )}
            </div>
          </div>
        </main>

        <ScrollToTopButton />
      </div>
    </div>
  );
};
