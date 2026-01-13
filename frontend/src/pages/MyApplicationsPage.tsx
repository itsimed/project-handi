// src/pages/MyApplicationsPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '../hooks/useApplications';
import { Navbar } from '../components/Navbar';
import { Breadcrumb } from '../components/Breadcrumb';
import { useTheme } from '../contexts/ThemeContext';
import { ScrollToTopButton } from '../components/ScrollToTopButton';

/**
 * Page conforme RGAA pour afficher les candidatures de l'utilisateur
 * Utilise HTML sémantique, ARIA labels et focus visible
 */
export const MyApplicationsPage = () => {
    const navigate = useNavigate();
    const { colors } = useTheme();
    const { 
        applications, 
        isLoading, 
        error,
        fetchMyApplications 
    } = useApplications();

    useEffect(() => {
        fetchMyApplications();
    }, []);

    /**
     * Obtient le label accessible pour le statut
     */
    const getStatusLabel = (status: 'PENDING' | 'ACCEPTED' | 'REJECTED'): string => {
        switch (status) {
            case 'PENDING':
                return 'En attente de réponse';
            case 'ACCEPTED':
                return 'Candidature acceptée';
            case 'REJECTED':
                return 'Candidature refusée';
        }
    };

    /**
     * Obtient le label visuel pour le statut
     */
    const getStatusText = (status: 'PENDING' | 'ACCEPTED' | 'REJECTED'): string => {
        switch (status) {
            case 'PENDING':
                return 'En attente';
            case 'ACCEPTED':
                return 'Accepté';
            case 'REJECTED':
                return 'Refusé';
        }
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
            {/* Navigation */}
            <Navbar variant="dashboard" />
            
            {/* Fil d'Ariane */}
            <Breadcrumb />

            {/* Header sémantique accessible */}
            <header 
                className="border-b-2 p-8"
                style={{ borderColor: colors.border }}
            >
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: colors.text }}>Mes Candidatures</h1>
                        <p className="mt-1" style={{ color: colors.text, opacity: 0.7 }}>Suivez l'état de vos postulations en temps réel</p>
                    </div>
                    
                    <nav aria-label="Navigation">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-2 rounded-full font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2"
                            style={{ 
                                backgroundColor: colors.text,
                                color: colors.bg
                            }}
                            aria-label="Retour au tableau de bord"
                        >
                            ← Retour aux offres
                        </button>
                    </nav>
                </div>
            </header>

            {/* Contenu principal sémantique */}
            <main className="p-8">
                {/* Message d'erreur accessible */}
                {error && (
                    <div 
                        role="alert" 
                        aria-live="assertive"
                        className="mb-6 p-4 border rounded-xl"
                        style={{ 
                            backgroundColor: `${colors.text}15`,
                            borderColor: `${colors.text}50`,
                            color: colors.text
                        }}
                    >
                        <strong className="font-bold">Erreur : </strong>
                        <span>{error}</span>
                    </div>
                )}

                <section aria-label="Liste de vos candidatures">
                    {isLoading ? (
                        <div 
                            className="text-center py-20" 
                            style={{ color: colors.text, opacity: 0.6 }}
                            role="status" 
                            aria-live="polite"
                        >
                            <span>Chargement de vos candidatures...</span>
                        </div>
                    ) : applications.length === 0 ? (
                        <div 
                            className="border-2 border-dashed rounded-2xl p-20 text-center"
                            style={{ borderColor: colors.border, backgroundColor: colors.bg }}
                        >
                            <p className="mb-4" style={{ color: colors.text, opacity: 0.7 }}>Vous n'avez pas encore postulé à des offres.</p>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="underline px-2 py-1 rounded hover:scale-105 transition-transform duration-200"
                                style={{ color: colors.text }}
                            >
                                Voir les annonces disponibles
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Résumé accessible pour les lecteurs d'écran */}
                            <div className="sr-only" aria-live="polite">
                                Vous avez {applications.length} candidature{applications.length > 1 ? 's' : ''} en cours
                            </div>

                            <div className="overflow-x-auto">
                                <table 
                                    className="w-full text-left border-separate border-spacing-y-3"
                                    aria-label="Tableau de vos candidatures"
                                >
                                    <thead>
                                        <tr className="uppercase text-xs" style={{ color: colors.text, opacity: 0.6 }}>
                                            <th scope="col" className="px-6 py-3">
                                                Poste / Entreprise
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Date de candidature
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Statut
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map((app) => (
                                            <tr 
                                                key={app.id} 
                                                onClick={() => navigate(`/mes-candidatures/${app.id}`)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        navigate(`/mes-candidatures/${app.id}`);
                                                    }
                                                }}
                                                className="transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                                                style={{ backgroundColor: colors.bg }}
                                                role="button"
                                                tabIndex={0}
                                                aria-label={`Voir les détails de votre candidature pour ${app.offer?.title || 'cette offre'}`}
                                            >
                                                {/* Cellule Poste/Entreprise */}
                                                <td 
                                                    className="px-6 py-4 rounded-l-xl border-2 border-r-0"
                                                    style={{ borderColor: colors.border }}
                                                    headers="poste-entreprise"
                                                >
                                                    <div className="font-bold" style={{ color: colors.text }}>
                                                        {app.offer?.title || 'Titre non disponible'}
                                                    </div>
                                                    <div className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
                                                        {app.company?.name || 'Entreprise non disponible'}
                                                    </div>
                                                </td>

                                                {/* Cellule Date */}
                                                <td 
                                                    className="px-6 py-4 border-t-2 border-b-2 text-sm"
                                                    style={{ borderColor: colors.border, color: colors.text, opacity: 0.7 }}
                                                    headers="date"
                                                >
                                                    <time dateTime={app.createdAt}>
                                                        {new Date(app.createdAt).toLocaleDateString('fr-FR', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </time>
                                                </td>

                                                {/* Cellule Statut */}
                                                <td 
                                                    className="px-6 py-4 rounded-r-xl border-2 border-l-0"
                                                    style={{ borderColor: colors.border }}
                                                    headers="statut"
                                                >
                                                    <span 
                                                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                                            app.status === 'ACCEPTED' 
                                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                                                : app.status === 'REJECTED' 
                                                                ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                                                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                        }`}
                                                        role="status"
                                                        aria-label={getStatusLabel(app.status)}
                                                    >
                                                        {getStatusText(app.status)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </section>
            </main>
            
            <ScrollToTopButton />
            </div>
        </div>
    );
};