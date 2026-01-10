/**
 * RecruiterDashboard - Dashboard pour les recruteurs
 * Gestion des offres publiées et consultation des candidatures
 * Architecture: React 18 + TypeScript + Tailwind CSS
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { Navbar } from '../components/Navbar';
import { Breadcrumb } from '../components/Breadcrumb';
import { STORAGE_KEYS } from '../constants';
import type { User, Offer, Application } from '../types';
import { CheckIcon, CloseIcon, WaveIcon, DocumentIcon, LocationIcon, UsersIcon, ClockIcon } from '../components/icons';
import { toastService } from '../services/toastService';

interface OfferWithApplications extends Offer {
  applications: Application[];
  _count?: {
    applications: number;
  };
}

export const RecruiterDashboard = () => {
  // ==================== STATE ====================
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [offers, setOffers] = useState<OfferWithApplications[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<OfferWithApplications | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(true);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [stats, setStats] = useState({
    totalOffers: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });

  // ==================== EFFECTS ====================
  useEffect(() => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'RECRUITER') {
        navigate('/dashboard');
        return;
      }
      setUser(parsedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchRecruiterOffers();
      fetchRecruiterApplications();
    }
  }, [user]);

  // ==================== API CALLS ====================
  const fetchRecruiterOffers = async () => {
    try {
      setIsLoadingOffers(true);
      const response = await apiClient.get('/offers');
      
      // Filtrer les offres du recruteur connecté
      const recruiterOffers = response.data.filter(
        (offer: Offer) => offer.recruiterId === user?.id
      );
      
      setOffers(recruiterOffers);
      
      // Calculer les stats
      const totalApps = recruiterOffers.reduce(
        (acc: number, offer: any) => acc + (offer._count?.applications || 0),
        0
      );
      
      setStats({
        totalOffers: recruiterOffers.length,
        totalApplications: totalApps,
        pendingApplications: 0, // sera calculé après récupération des candidatures
      });
    } catch (error) {
      toastService.error('Erreur lors du chargement des offres');
    } finally {
      setIsLoadingOffers(false);
    }
  };

  const fetchRecruiterApplications = async () => {
    try {
      const response = await apiClient.get('/applications/recruiter');
      const allApplications = response.data;
      
      setApplications(allApplications);
      
      const pending = allApplications.filter(
        (app: Application) => app.status === 'PENDING'
      ).length;
      
      setStats(prev => ({ ...prev, pendingApplications: pending }));
    } catch (error) {
      toastService.error('Erreur lors du chargement des candidatures');
    }
  };

  const fetchApplicationsForOffer = async (offerId: number) => {
    try {
      setIsLoadingApplications(true);
      
      // Filtrer les candidatures pour cette offre depuis les données déjà récupérées
      const offerApplications = applications.filter(
        (app: Application) => app.offerId === offerId
      );
      
      const offer = offers.find(o => o.id === offerId);
      if (offer) {
        setSelectedOffer({ ...offer, applications: offerApplications });
      }
    } catch (error) {
      toastService.error('Erreur lors du chargement des candidatures de l\'offre');
    } finally {
      setIsLoadingApplications(false);
    }
  };

  const updateApplicationStatus = async (
    applicationId: number,
    status: 'ACCEPTED' | 'REJECTED'
  ) => {
    try {
      await apiClient.put(`/applications/${applicationId}/status`, { status });
      
      // Rafraîchir les données
      await fetchRecruiterApplications();
      if (selectedOffer) {
        await fetchApplicationsForOffer(selectedOffer.id);
      }
    } catch (error) {
      toastService.error('Erreur lors de la mise à jour du statut');
    }
  };

  // ==================== HANDLERS ====================
  const handleViewOffer = (offer: OfferWithApplications) => {
    fetchApplicationsForOffer(offer.id);
  };

  const handleCreateOffer = () => {
    navigate('/recruteur/publier-offre');
  };

  // ==================== RENDER ====================
  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: { label: 'En attente', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
      ACCEPTED: { label: 'Acceptée', color: 'bg-green-500/10 text-green-400 border-green-500/30' },
      REJECTED: { label: 'Refusée', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
    };
    return badges[status as keyof typeof badges] || badges.PENDING;
  };

  const getContractLabel = (contract: string) => {
    const labels: Record<string, string> = {
      CDI: 'CDI',
      CDD: 'CDD',
      STAGE: 'Stage',
      ALTERNANCE: 'Alternance',
      INTERIM: 'Intérim',
    };
    return labels[contract] || contract;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ==================== HEADER ==================== */}
      <Navbar variant="recruiter" />
      
      {/* Fil d'Ariane */}
      <Breadcrumb />

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-100 mb-2 flex items-center gap-3">
            Bonjour {user.firstName}
            <WaveIcon size={28} className="text-sky-400" aria-label="Salutation" />
          </h2>
          <p className="text-slate-400">
            Gérez vos offres d'emploi et consultez les candidatures reçues
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-sky-500/10 to-blue-500/10 border border-sky-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <DocumentIcon size={40} className="text-sky-400" aria-hidden="true" />
              <div className="text-3xl font-bold text-sky-400">
                {stats.totalOffers}
              </div>
            </div>
            <p className="text-slate-300 font-semibold">Offres publiées</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <UsersIcon size={40} className="text-purple-400" aria-hidden="true" />
              <div className="text-3xl font-bold text-purple-400">
                {stats.totalApplications}
              </div>
            </div>
            <p className="text-slate-300 font-semibold">Candidatures reçues</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <ClockIcon size={40} className="text-yellow-400" aria-hidden="true" />
              <div className="text-3xl font-bold text-yellow-400">
                {stats.pendingApplications}
              </div>
            </div>
            <p className="text-slate-300 font-semibold">En attente</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <button
            onClick={handleCreateOffer}
            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-sky-500/30 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            + Publier une nouvelle offre
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Offers List */}
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Mes offres ({offers.length})
            </h3>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {isLoadingOffers ? (
                <div className="text-center py-12 text-slate-400">
                  Chargement...
                </div>
              ) : offers.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="mb-2">Aucune offre publiée</p>
                  <p className="text-sm">Cliquez sur le bouton ci-dessus pour créer votre première offre</p>
                </div>
              ) : (
                offers.map((offer) => (
                  <button
                    key={offer.id}
                    onClick={() => handleViewOffer(offer)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      selectedOffer?.id === offer.id
                        ? 'bg-sky-500/10 border-sky-500/50'
                        : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-slate-100 flex-1 pr-3">
                        {offer.title}
                      </h4>
                      <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-lg whitespace-nowrap">
                        {getContractLabel(offer.contract)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-3 flex items-center gap-2">
                      <LocationIcon size={14} aria-hidden="true" />
                      {offer.location}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>👥 {offer._count?.applications || 0} candidatures</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Column - Applications for Selected Offer */}
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Candidatures
              {selectedOffer && ` (${selectedOffer.applications?.length || 0})`}
            </h3>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {!selectedOffer ? (
                <div className="text-center py-12 text-slate-400">
                  <p>Sélectionnez une offre pour voir les candidatures</p>
                </div>
              ) : isLoadingApplications ? (
                <div className="text-center py-12 text-slate-400">
                  Chargement...
                </div>
              ) : selectedOffer.applications?.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p>Aucune candidature pour cette offre</p>
                </div>
              ) : (
                selectedOffer.applications?.map((app) => {
                  const badge = getStatusBadge(app.status);
                  return (
                    <div
                      key={app.id}
                      className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h5 className="font-semibold text-slate-100 mb-1">
                            {app.user?.firstName} {app.user?.lastName}
                          </h5>
                          <p className="text-sm text-slate-400">
                            {app.user?.email}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mb-3">
                        Postulé le {new Date(app.createdAt).toLocaleDateString('fr-FR')}
                      </p>

                      {app.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'ACCEPTED')}
                            className="flex-1 px-3 py-2 bg-green-500/10 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center gap-2"
                          >
                            <CheckIcon size={16} aria-hidden="true" />
                            Accepter
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'REJECTED')}
                            className="flex-1 px-3 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center gap-2"
                          >
                            <CloseIcon size={16} aria-hidden="true" />
                            Refuser
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
