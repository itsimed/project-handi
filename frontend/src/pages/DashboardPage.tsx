// src/pages/DashboardPage.tsx - Page de résultats accessible RGAA
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApplications } from '../hooks/useApplications';
import { useOfferFilters } from '../hooks/useOfferFilters';
import { useCompanies } from '../hooks/useCompanies';
import { Navbar } from '../components/Navbar';
import { SearchBarCompact } from '../components/SearchBarCompact';
import { FiltersPanel } from '../components/FiltersPanel';
import { OfferCard } from '../components/OfferCard';
import { CompaniesSection } from '../components/CompaniesSection';

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
     * Gestion accessible de la candidature
     */
    const handleApply = async (offerId: number) => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        try {
            await applyToOffer(offerId);
            // Le successMessage sera affiché automatiquement via role="alert"
            // Redirection après 2s pour laisser le temps de lire le message
            setTimeout(() => {
                navigate('/mes-candidatures');
            }, 2000);
        } catch (error) {
            // L'erreur est déjà gérée par le hook et affichée via role="alert"
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Navigation principale */}
            <Navbar variant="dashboard" />

            {/* Header avec recherche compacte */}
            <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 p-4 shadow-lg">
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
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar filtres */}
                        <div className="lg:w-80 flex-shrink-0">
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
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-slate-200">
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
    );
};