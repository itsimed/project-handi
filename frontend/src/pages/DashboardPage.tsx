// src/pages/DashboardPage.tsx - Page de résultats accessible RGAA
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApplications } from '../hooks/useApplications';
import { useOfferFilters } from '../hooks/useOfferFilters';
import { useCompanies } from '../hooks/useCompanies';
import { Navbar } from '../components/Navbar';
import { Breadcrumb } from '../components/Breadcrumb';
import { SearchBarCompact } from '../components/SearchBarCompact';
import { FiltersPanel } from '../components/FiltersPanel';
import { OfferCard } from '../components/OfferCard';
import { CompaniesSection } from '../components/CompaniesSection';
import { ApplicationModal } from '../components/ApplicationModal';
import { Icon } from '../components/Icon';
import { CloseIcon } from '../components/icons';

export const DashboardPage = () => {
    const navigate = useNavigate();
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
    
    // Hook pour les entreprises
    const {
        companies,
        isLoading: isLoadingCompanies,
    } = useCompanies(offers);

    // État pour la modale de candidature
    const [selectedOffer, setSelectedOffer] = useState<{ id: number; title: string; company: { name: string } } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        // Charger les candidatures si connecté (optionnel, pas de redirection)
        if (isLoggedIn) {
            fetchMyApplications();
        }
    }, [isLoggedIn, fetchMyApplications]);

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
        // Fermer le drawer mobile après changement de filtre
        setIsFiltersOpen(false);
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
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Navigation principale */}
            <Navbar variant="dashboard" />
            
            {/* Fil d'Ariane */}
            <Breadcrumb />

            {/* Header avec recherche compacte */}
            <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 p-3 sm:p-4 shadow-lg">
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
                <div className="container mx-auto px-4 sm:px-6 mt-4 sm:mt-6">
                    {applicationError && (
                        <div 
                            role="alert" 
                            aria-live="assertive"
                            className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-300 rounded-lg"
                        >
                            <strong className="font-bold">Erreur : </strong>
                            <span>{applicationError}</span>
                            <button
                                type="button"
                                onClick={clearMessages}
                                className="ml-4 text-red-400 hover:text-red-200 underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
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
                            className="mb-6 p-4 bg-green-500/10 border border-green-500/50 text-green-300 rounded-lg"
                        >
                            <strong className="font-bold">Succès : </strong>
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {offersError && (
                        <div 
                            role="alert" 
                            aria-live="assertive"
                            className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-300 rounded-lg"
                        >
                            <strong className="font-bold">Erreur : </strong>
                            <span>{offersError}</span>
                        </div>
                    )}
                </div>

                {/* Layout principal avec filtres et offres */}
                <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    {/* Bouton flottant pour ouvrir les filtres sur mobile */}
                    <button
                        type="button"
                        onClick={() => setIsFiltersOpen(true)}
                        className="lg:hidden fixed bottom-6 right-6 z-[60] bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 rounded-full shadow-2xl shadow-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-950 flex items-center gap-2 min-w-[120px] justify-center"
                        aria-label="Ouvrir les filtres"
                    >
                        <Icon name="filter" size={20} />
                        <span className="text-sm font-semibold">Filtres</span>
                        {activeFiltersCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-slate-950">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>

                    {/* Drawer mobile pour les filtres */}
                    {isFiltersOpen && (
                        <>
                            {/* Overlay */}
                            <div
                                className="lg:hidden fixed inset-0 bg-black/50 z-[55]"
                                onClick={() => setIsFiltersOpen(false)}
                                aria-hidden="true"
                            />
                            {/* Drawer */}
                            <div className="lg:hidden fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-slate-900 z-[60] shadow-xl overflow-y-auto">
                                <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                        <Icon name="filter" size={20} className="text-sky-400" />
                                        Filtres
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => setIsFiltersOpen(false)}
                                        className="p-2 text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-lg"
                                        aria-label="Fermer les filtres"
                                    >
                                        <CloseIcon size={20} aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <FiltersPanel
                                        filters={currentFilters}
                                        onFilterChange={handleFilterChange}
                                        activeCount={activeFiltersCount}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                        {/* Sidebar filtres - Desktop */}
                        <div className="lg:w-80 flex-shrink-0 hidden lg:block">
                            <FiltersPanel
                                filters={currentFilters}
                                onFilterChange={handleFilterChange}
                                activeCount={activeFiltersCount}
                            />
                        </div>

                        {/* Contenu principal */}
                        <div className="flex-1">
                            {/* Section offres */}
                            <section aria-label="Liste des offres">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-200">
                                        Offres disponibles
                                    </h2>
                                    {activeFiltersCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="text-sm text-sky-400 hover:text-sky-300 underline focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 px-2 py-1 rounded"
                                        >
                                            Effacer les filtres
                                        </button>
                                    )}
                                </div>

                                {isLoadingOffers ? (
                                    <div className="text-center py-20 text-slate-400" aria-live="polite">
                                        Chargement des offres...
                                    </div>
                                ) : offers.length === 0 ? (
                                    <div className="bg-slate-800 border border-dashed border-slate-700 rounded-2xl p-20 text-center">
                                        <p className="text-slate-300 mb-4">Aucune offre ne correspond à vos critères.</p>
                                        {activeFiltersCount > 0 && (
                                            <button
                                                type="button"
                                                onClick={clearFilters}
                                                className="text-sky-400 hover:text-sky-300 underline focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 px-2 py-1 rounded"
                                            >
                                                Réinitialiser les filtres
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                                        {offers.map((offer) => (
                                            <OfferCard
                                                key={offer.id}
                                                offer={offer}
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
        </div>
    );
};