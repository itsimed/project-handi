/**
 * OfferApplicationsPage - Page pour afficher les candidatures d'une offre spécifique
 * Accessible uniquement aux recruteurs
 * Met automatiquement à jour le statut des candidatures en "VIEWED"
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
import type { Application, Offer } from '../types';

export const OfferApplicationsPage = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const navigate = useNavigate();
  const { colors } = useTheme();
  
  const [offer, setOffer] = useState<Offer | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (offerId) {
      fetchOfferAndApplications();
    }
  }, [offerId]);

  const fetchOfferAndApplications = async () => {
    try {
      setIsLoading(true);
      
      // Récupérer les détails de l'offre
      const offerResponse = await apiClient.get(`/offers/${offerId}`);
      setOffer(offerResponse.data);
      
      // Récupérer toutes les candidatures pour cette offre
      const appsResponse = await apiClient.get(`/applications/offer/${offerId}`);
      const apps = appsResponse.data;
      setApplications(apps);
      
      // Marquer toutes les candidatures non vues comme consultées
      const notViewedApps = apps.filter((app: Application) => app.status === 'NOT_VIEWED');
      
      if (notViewedApps.length > 0) {
        try {
          // Mettre à jour le statut de chaque candidature non vue
          await Promise.all(
            notViewedApps.map((app: Application) => 
              apiClient.put(`/applications/${app.id}/status`, { status: 'VIEWED' })
            )
          );
          
          // Actualiser la liste après mise à jour
          const updatedAppsResponse = await apiClient.get(`/applications/offer/${offerId}`);
          setApplications(updatedAppsResponse.data);
        } catch (statusError) {
          console.error('Erreur lors de la mise à jour des statuts:', statusError);
          // On continue même si la mise à jour échoue
        }
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement:', error);
      console.error('Détails de l\'erreur:', error.response?.data);
      toastService.error(error.response?.data?.error || 'Erreur lors du chargement des candidatures');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewApplication = (applicationId: number) => {
    navigate(`/recruteur/candidatures/${applicationId}`);
  };

  const getStatusBadge = (status: 'NOT_VIEWED' | 'VIEWED') => {
    if (status === 'VIEWED') {
      return {
        label: 'Consultée',
        bgColor: '#10b98133',
        textColor: '#10b981',
        borderColor: '#10b98166'
      };
    }
    return {
      label: 'Non consultée',
      bgColor: '#eab30833',
      textColor: '#d97706',
      borderColor: '#d9770666'
    };
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

  if (!offer) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.bg }}>
        <Navbar variant="recruiter" />
        <Breadcrumb />
        <div className="container mx-auto px-6 py-12 max-w-7xl text-center" style={{ color: colors.text }}>
          Offre non trouvée
        </div>
      </div>
    );
  }

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

        <main className="container mx-auto px-6 py-8 max-w-7xl">
          {/* En-tête avec informations de l'offre */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/recruteur/dashboard')}
              className="mb-4 px-4 py-2 rounded-xl font-semibold transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 inline-flex items-center gap-2"
              style={{ 
                backgroundColor: colors.text,
                color: colors.bg
              }}
            >
              <Icon name="chevron-left" size={18} />
              Retour au tableau de bord
            </button>

            <div className="border-2 rounded-2xl p-6" style={{ borderColor: colors.border }}>
              <h1 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
                {offer.title}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Icon name="location" size={18} />
                  <span style={{ color: colors.text, opacity: 0.8 }}>{offer.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="briefcase" size={18} />
                  <span style={{ color: colors.text, opacity: 0.8 }}>
                    {Array.isArray(offer.contract) ? offer.contract.join(', ') : offer.contract}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="users" size={18} />
                  <span style={{ color: colors.text, opacity: 0.8 }}>
                    {applications.length} candidature{applications.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="border-2 rounded-2xl p-4" style={{ borderColor: colors.border }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3b82f620' }}>
                  <Icon name="users" size={20} className="text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ color: colors.text }}>
                    {applications.length}
                  </div>
                  <div className="text-sm" style={{ color: colors.text, opacity: 0.75 }}>
                    Total candidatures
                  </div>
                </div>
              </div>
            </div>

            <div className="border-2 rounded-2xl p-4" style={{ borderColor: colors.border }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#10b98120' }}>
                  <Icon name="check" size={20} className="text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ color: colors.text }}>
                    {applications.filter(app => app.status === 'VIEWED').length}
                  </div>
                  <div className="text-sm" style={{ color: colors.text, opacity: 0.75 }}>
                    Consultées
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des candidatures */}
          <div className="border-2 rounded-2xl p-6" style={{ borderColor: colors.border }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
              Candidatures reçues
            </h2>

            {applications.length === 0 ? (
              <div className="text-center py-12" style={{ color: colors.text, opacity: 0.6 }}>
                <Icon name="users" size={48} className="mx-auto mb-4 opacity-40" />
                <p>Aucune candidature reçue pour cette offre</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleViewApplication(app.id)}
                    className="w-full text-left border-2 rounded-xl p-5 transition-all duration-200 hover:scale-[1.01]"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.bg
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon name="users" size={20} />
                          <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                            {app.user?.firstName} {app.user?.lastName}
                          </h3>
                        </div>
                        
                        <div className="space-y-1 text-sm" style={{ color: colors.text, opacity: 0.75 }}>
                          {app.user?.email && (
                            <div className="flex items-center gap-2">
                              <Icon name="message" size={14} />
                              <span>{app.user.email}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Icon name="calendar" size={14} />
                            <span>
                              Candidature du {new Date(app.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2"
                          style={{
                            backgroundColor: getStatusBadge(app.status).bgColor,
                            color: getStatusBadge(app.status).textColor,
                            borderColor: getStatusBadge(app.status).borderColor
                          }}
                        >
                          <Icon name={app.status === 'VIEWED' ? 'check' : 'clock'} size={12} />
                          {getStatusBadge(app.status).label}
                        </span>
                        
                        <span className="text-sm px-3 py-1 rounded-lg border" style={{ borderColor: colors.border, color: colors.text }}>
                          Voir détails →
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>

        <ScrollToTopButton />
      </div>
    </div>
  );
};
