// src/pages/DashboardPage.tsx - Page de résultats
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApplications } from '../hooks/useApplications';
import { useOfferFilters } from '../hooks/useOfferFilters';
import type { ContractType, ExperienceLevel, RemotePolicy, DisabilityCategory } from '../types';
import { Navbar } from '../components/Navbar';
import { Breadcrumb } from '../components/Breadcrumb';
import { SearchBarCompact } from '../components/SearchBarCompact';
import { FiltersPanel } from '../components/FiltersPanel';
import { OfferCard } from '../components/OfferCard';
import { ApplicationModal } from '../components/ApplicationModal';
import { useTheme } from '../contexts/AccessibilityContext';
import { ScrollToTopButton } from '../components/ScrollToTopButton';
import { MenuIcon } from '../components/icons';

export const DashboardPage = () => {
    const navigate = useNavigate();
    const { colors } = useTheme();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Extraire les paramètres de recherche de l'URL
    const initialWhat = searchParams.get('what') || '';
    const initialWhere = searchParams.get('where') || '';
    const initialContract = searchParams.get('contract') as any;
    
    // Vérification de l'état de connexion
    const isLoggedIn = !!localStorage.getItem('token');

    // Hook pour les candidatures
    const {
        isLoading: isApplying,
        error: applicationError,
        successMessage,
        applyToOffer,
        clearMessages,
        hasApplied,
        fetchMyApplications,
    } = useApplications();
    
    // Hook pour les filtres et offres avec paramètres initiaux
    const {
        offers,
        isLoading: isLoadingOffers,
        error: offersError,
        applyFilters,
        clearFilters,
        activeFiltersCount,
        currentFilters,
    } = useOfferFilters();

    // État pour la modale de candidature
    const [selectedOffer, setSelectedOffer] = useState<{ id: number; title: string; company: { name: string } } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // État pour le panneau de filtres (fermé par défaut)
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    // Appliquer les filtres initiaux depuis l'URL au montage
    useEffect(() => {
        const initialFilters: any = {
            searchWhat: initialWhat,
            searchWhere: initialWhere,
        };
        
        // Si un contrat est spécifié dans l'URL
        if (initialContract) {
            initialFilters.contractTypes = [initialContract];
        }
        
        applyFilters(initialFilters);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        // Charger les candidatures si connecté
        if (isLoggedIn) {
            fetchMyApplications();
        }
    }, [isLoggedIn, fetchMyApplications]);

    const handleAuthAction = () => {
        if (isLoggedIn) {
            localStorage.removeItem('token');
            window.location.reload(); 
        } else {
            navigate('/login');
        }
    };

    /**
     * Gestion de la recherche depuis la SearchBarCompact
     */
    const handleSearch = ({ what, where }: { what: string; where: string }) => {
        // Mettre à jour l'URL
        const params = new URLSearchParams();
        if (what.trim()) params.append('what', what.trim());
        if (where.trim()) params.append('where', where.trim());
        setSearchParams(params);
        
        // Appliquer les filtres
        applyFilters({
            ...currentFilters,
            searchWhat: what,
            searchWhere: where,
        });
    };

    /**
     * Gestion du changement de filtres
     */
    const handleFilterChange = (newFilters: any) => {
        applyFilters({
            ...currentFilters,
            ...newFilters,
        });
    };

    /**
     * Gestion accessible de la candidature - Ouvre la modale
     */
    const handleApply = (offerId: number) => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        const offer = offers.find(o => o.id === offerId);
        if (offer) {
            setSelectedOffer({
                id: offer.id,
                title: offer.title,
                company: offer.company
            });
            setIsModalOpen(true);
        }
    };

    const handleModalSuccess = () => {
        fetchMyApplications();
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.bg, color: colors.text }}>
            {/* Navigation principale */}
            <Navbar variant="dashboard" />
            
            {/* Fil d'Ariane */}
            <Breadcrumb />

            {/* Header avec recherche compacte */}
            <header className="backdrop-blur-sm border-b p-4 shadow-lg" style={{ backgroundColor: `${colors.bg}F2`, borderColor: `${colors.border}33` }}>
                <div className="container mx-auto">
                    {/* SearchBar compacte */}
                    <SearchBarCompact 
                        onSearch={handleSearch}
                        isLoading={isLoadingOffers}
                        initialWhat={initialWhat}
                        initialWhere={initialWhere}
                    />
                </div>
            </header>

            {/* Contenu principal */}
            <main>

                {/* Messages d'alerte accessibles ARIA */}
                <div className="container mx-auto px-6 mt-6">
                    {applicationError && (
                        <div 
                            role="alert" 
                            aria-live="assertive"
                            className="mb-6 p-4 border-2 rounded-xl"
                            style={{ 
                                backgroundColor: colors.text === '#23022E' ? '#fca5a510' : '#ef444410',
                                borderColor: colors.text === '#23022E' ? '#fca5a550' : '#ef444450',
                                color: colors.text === '#23022E' ? '#dc2626' : '#fca5a5'
                            }}
                        >
                            <strong className="font-bold">Erreur : </strong>
                            <span>{applicationError}</span>
                            <button
                                type="button"
                                onClick={clearMessages}
                                className="ml-4 underline focus:outline-none focus:ring-2 focus:ring-red-500"
                                style={{ color: colors.text === '#23022E' ? '#dc2626' : '#ef4444', opacity: 0.7 }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
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
                            className="mb-6 p-4 border-2 rounded-xl"
                            style={{ 
                                backgroundColor: colors.text === '#23022E' ? '#86efac10' : '#22c55e10',
                                borderColor: colors.text === '#23022E' ? '#86efac50' : '#22c55e50',
                                color: colors.text === '#23022E' ? '#059669' : '#86efac'
                            }}
                        >
                            <strong className="font-bold">Succès : </strong>
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {offersError && (
                        <div 
                            role="alert" 
                            aria-live="assertive"
                            className="mb-6 p-4 border-2 rounded-xl"
                            style={{ 
                                backgroundColor: colors.text === '#23022E' ? '#fca5a510' : '#ef444410',
                                borderColor: colors.text === '#23022E' ? '#fca5a550' : '#ef444450',
                                color: colors.text === '#23022E' ? '#dc2626' : '#fca5a5'
                            }}
                        >
                            <strong className="font-bold">Erreur : </strong>
                            <span>{offersError}</span>
                        </div>
                    )}
                </div>

                {/* Layout principal avec filtres et offres */}
                <div className="container mx-auto px-6 py-8">
                    {/* Bouton burger pour ouvrir les filtres */}
                    <button
                        type="button"
                        onClick={() => setIsFiltersOpen(true)}
                        className="mb-4 flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2"
                        style={{
                            backgroundColor: colors.bg,
                            borderColor: colors.border,
                            color: colors.text
                        }}
                        aria-label="Ouvrir les filtres"
                    >
                        <MenuIcon size={20} />
                        <span className="font-semibold">Filtres</span>
                        {activeFiltersCount > 0 && (
                            <span 
                                className="ml-auto px-2 py-1 rounded-full text-xs font-bold"
                                style={{
                                    backgroundColor: colors.text,
                                    color: colors.bg
                                }}
                            >
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>

                    {/* Drawer de filtres - En position fixed, hors du flux normal */}
                    <FiltersPanel
                        filters={{
                            contractTypes: currentFilters.contractTypes as ContractType[] | undefined,
                            experienceLevels: currentFilters.experienceLevels as ExperienceLevel[] | undefined,
                            remote: currentFilters.remote as RemotePolicy[] | undefined,
                            disabilityCompatible: currentFilters.disabilityCompatible as DisabilityCategory[] | undefined,
                        }}
                        onFilterChange={handleFilterChange}
                        activeCount={activeFiltersCount}
                        isOpen={isFiltersOpen}
                        onClose={() => setIsFiltersOpen(false)}
                    />

                    {/* Contenu principal */}
                    <div>
                            {/* Section offres */}
                            <section aria-label="Liste des offres">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 
                                        className="text-2xl font-bold"
                                        style={{ color: colors.text }}
                                    >
                                        Offres disponibles
                                    </h2>
                                    {activeFiltersCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="text-sm underline focus:outline-none focus:ring-2 px-2 py-1 rounded-xl transition-opacity duration-200"
                                            style={{ 
                                                color: colors.text,
                                                opacity: 0.7
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                                        >
                                            Effacer les filtres
                                        </button>
                                    )}
                                </div>

                                {isLoadingOffers ? (
                                    <div 
                                        className="text-center py-20" 
                                        aria-live="polite"
                                        style={{ color: colors.text, opacity: 0.6 }}
                                    >
                                        Chargement des offres...
                                    </div>
                                ) : offers.length === 0 ? (
                                    <div 
                                        className="border-2 border-dashed rounded-2xl p-20 text-center"
                                        style={{ 
                                            backgroundColor: colors.bg,
                                            borderColor: colors.border + '50'
                                        }}
                                    >
                                        <p className="mb-4" style={{ color: colors.text, opacity: 0.7 }}>
                                            Aucune offre ne correspond à vos critères.
                                        </p>
                                        {activeFiltersCount > 0 && (
                                            <button
                                                type="button"
                                                onClick={clearFilters}
                                                className="underline focus:outline-none focus:ring-2 px-2 py-1 rounded-xl transition-opacity duration-200"
                                                style={{ 
                                                    color: colors.text,
                                                    opacity: 0.7
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                                            >
                                                Réinitialiser les filtres
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {offers.map((offer) => (
                                            <OfferCard
                                                key={offer.id}
                                                offer={{
                                                    ...offer,
                                                    contract: Array.isArray(offer.contract) 
                                                        ? offer.contract 
                                                        : [offer.contract]
                                                }}
                                                onApply={handleApply}
                                                isApplying={isApplying}
                                                hasApplied={hasApplied(offer.id)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>
                    </div>
                </div>
            </main>

            {/* Application Modal */}
            {selectedOffer && (
                <ApplicationModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedOffer(null);
                    }}
                    offerId={selectedOffer.id}
                    offerTitle={selectedOffer.title}
                    companyName={selectedOffer.company.name}
                    onSuccess={handleModalSuccess}
                />
            )}
            
            <ScrollToTopButton />
        </div>
    );
};