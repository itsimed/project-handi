// src/pages/MyApplicationsPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '../hooks/useApplications';
import { Navbar } from '../components/Navbar';

/**
 * Page conforme RGAA pour afficher les candidatures de l'utilisateur
 * Utilise HTML sémantique, ARIA labels et focus visible
 */
export const MyApplicationsPage = () => {
    const navigate = useNavigate();
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
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Navigation */}
            <Navbar variant="dashboard" />

            {/* Header sémantique accessible */}
            <header className="border-b border-slate-800/50 bg-slate-900/50 p-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-sky-400">Mes Candidatures</h1>
                        <p className="text-slate-300 mt-1">Suivez l'état de vos postulations en temps réel</p>
                    </div>
                    
                    <nav aria-label="Navigation">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-2 bg-sky-500 text-white rounded-full font-semibold hover:bg-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
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
                        className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-300 rounded-lg"
                    >
                        <strong className="font-bold">Erreur : </strong>
                        <span>{error}</span>
                    </div>
                )}

                <section aria-label="Liste de vos candidatures">
                    {isLoading ? (
                        <div 
                            className="text-center py-20 text-slate-400" 
                            role="status" 
                            aria-live="polite"
                        >
                            <span>Chargement de vos candidatures...</span>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="bg-slate-800 border border-dashed border-slate-700 rounded-2xl p-20 text-center">
                            <p className="text-slate-300 mb-4">Vous n'avez pas encore postulé à des offres.</p>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="text-sky-400 hover:text-sky-300 underline focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 px-2 py-1 rounded"
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
                                        <tr className="text-slate-400 uppercase text-xs">
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
                                                className="bg-slate-800 hover:bg-slate-750 transition-colors focus-within:ring-2 focus-within:ring-sky-500 cursor-pointer"
                                                role="button"
                                                tabIndex={0}
                                                aria-label={`Voir les détails de votre candidature pour ${app.offer?.title || 'cette offre'}`}
                                            >
                                                {/* Cellule Poste/Entreprise */}
                                                <td 
                                                    className="px-6 py-4 rounded-l-xl border-l border-t border-b border-slate-700"
                                                    headers="poste-entreprise"
                                                >
                                                    <div className="font-bold text-slate-100">
                                                        {app.offer?.title || 'Titre non disponible'}
                                                    </div>
                                                    <div className="text-sm text-slate-300">
                                                        {app.company?.name || 'Entreprise non disponible'}
                                                    </div>
                                                </td>

                                                {/* Cellule Date */}
                                                <td 
                                                    className="px-6 py-4 border-t border-b border-slate-700 text-sm text-slate-300"
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
                                                    className="px-6 py-4 rounded-r-xl border-r border-t border-b border-slate-700"
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
        </div>
    );
};