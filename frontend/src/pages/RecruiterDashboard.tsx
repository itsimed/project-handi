/**
 * RecruiterDashboard - Dashboard pour les recruteurs
 * Gestion des offres publiées et consultation des candidatures
 * Architecture: React 18 + TypeScript + Tailwind CSS
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { Navbar } from '../components/Navbar';
import { Breadcrumb } from '../components/Breadcrumb';
import { SearchBarCompact } from '../components/SearchBarCompact';
import { STORAGE_KEYS } from '../constants';
import type { User, Offer, Application } from '../types';
import { CheckIcon, CloseIcon, WaveIcon, DocumentIcon, LocationIcon, UsersIcon, ClockIcon } from '../components/icons';
import { toastService } from '../services/toastService';
import { useTheme } from '../contexts/AccessibilityContext';
import { ScrollToTopButton } from '../components/ScrollToTopButton';

interface OfferWithApplications extends Offer {
  applications: Application[];
  _count?: {
    applications: number;
  };
}

export const RecruiterDashboard = () => {
  // ==================== STATE ====================
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { colors } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [offers, setOffers] = useState<OfferWithApplications[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(true);
  const [stats, setStats] = useState({
    totalOffers: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });
  
  // Lire les paramètres de recherche depuis l'URL
  const searchWhat = searchParams.get('what') || '';
  const searchWhere = searchParams.get('where') || '';

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

  // ==================== API CALLS ====================
  const fetchRecruiterOffers = useCallback(async () => {
    try {
      setIsLoadingOffers(true);
      // Utiliser l'endpoint spécifique recruteur qui retourne toutes les offres (ACTIVE et PAUSED)
      const response = await apiClient.get('/offers/recruiter');
      
      // Les offres retournées sont déjà filtrées par le backend pour ce recruteur
      let recruiterOffers = response.data;
      
      // Appliquer le filtrage par recherche (titre OU localisation)
      if (searchWhat || searchWhere) {
        recruiterOffers = recruiterOffers.filter((offer: Offer) => {
          const matchesTitle = !searchWhat || 
            offer.title.toLowerCase().includes(searchWhat.toLowerCase());
          const matchesLocation = !searchWhere || 
            offer.location.toLowerCase().includes(searchWhere.toLowerCase());
          
          // Logique OU : correspond si titre OU localisation match
          return matchesTitle || matchesLocation;
        });
      }
      
      setOffers(recruiterOffers);
      
      // Calculer les stats (sur toutes les offres du recruteur, pas seulement les filtrées)
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
  }, [user?.id, searchWhat, searchWhere]);

  const fetchRecruiterApplications = useCallback(async () => {
    try {
      const response = await apiClient.get('/applications/recruiter');
      const allApplications = response.data;
      
      const notViewed = allApplications.filter(
        (app: Application) => app.status === 'NOT_VIEWED'
      ).length;
      
      setStats(prev => ({ ...prev, pendingApplications: notViewed }));
    } catch (error) {
      console.error('Error fetching recruiter applications:', error);
      toastService.error('Erreur lors du chargement des candidatures');
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchRecruiterOffers();
      fetchRecruiterApplications();
    }
  }, [user, fetchRecruiterOffers, fetchRecruiterApplications]);

  const handleViewOffer = (offer: OfferWithApplications) => {
    navigate(`/recruteur/offres/${offer.id}`);
  };

  const handleCreateOffer = () => {
    navigate('/recruteur/publier-offre');
  };

  /**
   * Gestion de la recherche depuis la SearchBarCompact
   */
  const handleSearch = ({ what, where }: { what: string; where: string }) => {
    const params = new URLSearchParams();
    if (what.trim()) params.append('what', what.trim());
    if (where.trim()) params.append('where', where.trim());
    setSearchParams(params);
  };

  // ==================== RENDER ====================
  const getStatusBadge = (status: string) => {
    const badges = {
      VIEWED: { label: 'Consultée', color: 'bg-green-500/10 text-green-400 border-green-500/30' },
      NOT_VIEWED: { label: 'Non consultée', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
    };
    return badges[status as keyof typeof badges] || badges.NOT_VIEWED;
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
      {/* ==================== HEADER ==================== */}
      <Navbar variant="recruiter" />
      
      {/* Fil d'Ariane */}
      <Breadcrumb />

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
            Bonjour {user.firstName}
          </h2>
          <p style={{ color: colors.text, opacity: 0.7 }}>
            Gérez vos offres d'emploi et consultez les candidatures reçues
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border-2 rounded-2xl p-6" style={{ borderColor: colors.border }}>
            <div className="flex items-center justify-between mb-3">
              <DocumentIcon size={40} style={{ color: colors.text }} aria-hidden="true" />
              <div className="text-3xl font-bold" style={{ color: colors.text }}>
                {stats.totalOffers}
              </div>
            </div>
            <p className="font-semibold" style={{ color: colors.text }}>Offres publiées</p>
          </div>

          <div className="border-2 rounded-2xl p-6" style={{ borderColor: colors.border }}>
            <div className="flex items-center justify-between mb-3">
              <UsersIcon size={40} style={{ color: colors.text }} aria-hidden="true" />
              <div className="text-3xl font-bold" style={{ color: colors.text }}>
                {stats.totalApplications}
              </div>
            </div>
            <p className="font-semibold" style={{ color: colors.text }}>Candidatures reçues</p>
          </div>

          <div className="border-2 rounded-2xl p-6" style={{ borderColor: colors.border }}>
            <div className="flex items-center justify-between mb-3">
              <ClockIcon size={40} style={{ color: colors.text }} aria-hidden="true" />
              <div className="text-3xl font-bold" style={{ color: colors.text }}>
                {stats.pendingApplications}
              </div>
            </div>
            <p className="font-semibold" style={{ color: colors.text }}>Non consultées</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBarCompact
            onSearch={handleSearch}
            initialWhat={searchWhat}
            initialWhere={searchWhere}
          />
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <button
            onClick={handleCreateOffer}
            className="px-6 py-3 font-semibold rounded-xl transition-all duration-200 hover:scale-105"
            style={{ 
              backgroundColor: colors.text,
              color: colors.bg
            }}
          >
            + Publier une nouvelle offre
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Offers List */}
          <div className="md:col-span-3 border-2 rounded-2xl p-6" style={{ borderColor: colors.border }}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ color: colors.text }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Mes offres ({offers.length})
            </h3>

            {isLoadingOffers ? (
              <div className="text-center py-12" style={{ color: colors.text, opacity: 0.6 }}>
                Chargement...
              </div>
            ) : offers.length === 0 ? (
              <div className="text-center py-12" style={{ color: colors.text, opacity: 0.6 }}>
                {searchWhat || searchWhere ? (
                  <>
                    <p className="mb-2">Aucune offre ne correspond à votre recherche</p>
                    <p className="text-sm">Essayez avec d'autres mots-clés</p>
                  </>
                ) : (
                  <>
                    <p className="mb-2">Aucune offre publiée</p>
                    <p className="text-sm">Cliquez sur le bouton ci-dessus pour créer votre première offre</p>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offers.map((offer) => (
                  <button
                    key={offer.id}
                    onClick={() => handleViewOffer(offer)}
                    className={`text-left p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02]`}
                    style={{
                      backgroundColor: colors.bg,
                      borderColor: colors.border
                    }}
                  >
                    <div className="mb-3">
                      <h4 className="font-semibold mb-1" style={{ color: colors.text }}>
                        {offer.title}
                      </h4>
                      <p className="text-sm flex items-center gap-2" style={{ color: colors.text, opacity: 0.7 }}>
                        <LocationIcon size={14} aria-hidden="true" />
                        {offer.location}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: colors.border }}>
                      <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
                        {getContractLabel(offer.contract)}
                      </span>
                      <span className="text-sm font-semibold flex items-center gap-1" style={{ color: colors.text, opacity: 0.7 }}>
                        <UsersIcon size={16} aria-hidden="true" />
                        {offer._count?.applications || 0}
                      </span>
                    </div>
                  </button>
                ))}
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
