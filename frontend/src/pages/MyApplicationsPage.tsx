// src/pages/MyApplicationsPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '../hooks/useApplications';
import { Navbar } from '../components/Navbar';
import { Breadcrumb } from '../components/Breadcrumb';
import { useTheme } from '../contexts/AccessibilityContext';
import { ScrollToTopButton } from '../components/ScrollToTopButton';
import { Icon } from '../components/Icon';

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
    const getStatusLabel = (status: 'NOT_VIEWED' | 'VIEWED'): string => {
        switch (status) {
            case 'NOT_VIEWED':
                return 'Non consultée par le recruteur';
            case 'VIEWED':
                return 'Consultée par le recruteur';
        }
    };

    /**
     * Obtient le label visuel pour le statut
     */
    const getStatusText = (status: 'NOT_VIEWED' | 'VIEWED'): string => {
        switch (status) {
            case 'NOT_VIEWED':
                return 'Non consultée';
            case 'VIEWED':
                return 'Consultée';
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
            <header className="p-6 md:p-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: colors.text }}>
                                Mes Candidatures
                            </h1>
                            <p className="text-sm md:text-base" style={{ color: colors.text, opacity: 0.85 }}>
                                Suivez l'état de vos postulations en temps réel
                            </p>
                        </div>
                        
                        <nav aria-label="Navigation">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 flex items-center gap-2"
                                style={{ 
                                    backgroundColor: colors.text,
                                    color: colors.bg
                                }}
                                aria-label="Retour au tableau de bord"
                            >
                                <Icon name="chevron-left" size={18} />
                                Retour aux offres
                            </button>
                        </nav>
                    </div>

                    {/* Statistiques rapides */}
                    {!isLoading && applications.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="border-2 rounded-2xl p-4" style={{ borderColor: colors.border, backgroundColor: colors.bg }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3b82f620' }}>
                                        <Icon name="document" size={20} className="text-blue-500" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold" style={{ color: colors.text }}>
                                            {applications.length}
                                        </div>
                                        <div className="text-sm" style={{ color: colors.text, opacity: 0.75 }}>
                                            Candidature{applications.length > 1 ? 's' : ''} totale{applications.length > 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-2 rounded-2xl p-4" style={{ borderColor: colors.border, backgroundColor: colors.bg }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f59e0b20' }}>
                                        <Icon name="clock" size={20} className="text-amber-500" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold" style={{ color: colors.text }}>
                                            {applications.filter(app => app.status === 'NOT_VIEWED').length}
                                        </div>
                                        <div className="text-sm" style={{ color: colors.text, opacity: 0.75 }}>
                                            Non consultée{applications.filter(app => app.status === 'NOT_VIEWED').length > 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-2 rounded-2xl p-4" style={{ borderColor: colors.border, backgroundColor: colors.bg }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#10b98120' }}>
                                        <Icon name="check" size={20} className="text-green-500" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold" style={{ color: colors.text }}>
                                            {applications.filter(app => app.status === 'VIEWED').length}
                                        </div>
                                        <div className="text-sm" style={{ color: colors.text, opacity: 0.75 }}>
                                            Consultée{applications.filter(app => app.status === 'VIEWED').length > 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Contenu principal sémantique */}
            <main className="p-6 md:p-8">
                <div className="container mx-auto max-w-7xl">
                {/* Message d'erreur accessible */}
                {error && (
                    <div 
                        role="alert" 
                        aria-live="assertive"
                        className="mb-6 p-4 border-2 rounded-2xl flex items-start gap-3"
                        style={{ 
                            backgroundColor: `${colors.text}10`,
                            borderColor: `${colors.text}40`,
                            color: colors.text
                        }}
                    >
                        <Icon name="info" size={20} className="mt-0.5" />
                        <div>
                            <strong className="font-bold">Erreur : </strong>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                <section aria-label="Liste de vos candidatures">
                    {isLoading ? (
                        <div 
                            className="text-center py-20" 
                            style={{ color: colors.text, opacity: 0.8 }}
                            role="status" 
                            aria-live="polite"
                        >
                            <span>Chargement de vos candidatures...</span>
                        </div>
                    ) : applications.length === 0 ? (
                        <div 
                            className="border-2 border-dashed rounded-2xl p-12 md:p-20 text-center"
                            style={{ borderColor: colors.border }}
                        >
                            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: colors.text, opacity: 0.12 }}>
                                <Icon name="briefcase" size={40} className="opacity-70" />
                            </div>
                            <h2 className="text-xl font-bold mb-2" style={{ color: colors.text }}>
                                Aucune candidature pour le moment
                            </h2>
                            <p className="mb-6" style={{ color: colors.text, opacity: 0.8 }}>
                                Vous n'avez pas encore postulé à des offres.
                            </p>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 inline-flex items-center gap-2"
                                style={{ 
                                    backgroundColor: colors.text,
                                    color: colors.bg
                                }}
                            >
                                <Icon name="search" size={18} />
                                Voir les annonces disponibles
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Résumé accessible pour les lecteurs d'écran */}
                            <div className="sr-only" aria-live="polite">
                                Vous avez {applications.length} candidature{applications.length > 1 ? 's' : ''} en cours
                            </div>

                            {/* Version Desktop - Tableau */}
                            <div className="hidden md:block overflow-x-auto">
                                <table 
                                    className="w-full text-left border-separate border-spacing-y-3"
                                    aria-label="Tableau de vos candidatures"
                                >
                                    <thead>
                                        <tr className="uppercase text-xs font-semibold tracking-wider" style={{ color: colors.text, opacity: 0.65 }}>
                                            <th scope="col" className="px-6 py-3">
                                                Poste / Entreprise
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Type de contrat
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
                                                className="transition-all duration-200 cursor-pointer group"
                                                style={{ 
                                                    backgroundColor: colors.bg,
                                                    transition: 'all 0.2s'
                                                }}
                                                role="button"
                                                tabIndex={0}
                                                aria-label={`Voir les détails de votre candidature pour ${app.offer?.title || 'cette offre'}`}
                                            >
                                                {/* Cellule Poste/Entreprise */}
                                                <td 
                                                    className="px-6 py-5 rounded-l-2xl border-2 border-r-0"
                                                    style={{ borderColor: colors.border }}
                                                    headers="poste-entreprise"
                                                >
                                                    <div className="font-bold mb-1 flex items-center gap-2" style={{ color: colors.text }}>
                                                        <Icon name="briefcase" size={16} className="opacity-60" />
                                                        {app.offer?.title || 'Titre non disponible'}
                                                    </div>
                                                    <div className="text-sm flex items-center gap-2" style={{ color: colors.text, opacity: 0.75 }}>
                                                        <Icon name="building" size={14} className="opacity-65" />
                                                        {app.company?.name || 'Entreprise non disponible'}
                                                    </div>
                                                </td>

                                                {/* Cellule Contrat */}
                                                <td 
                                                    className="px-6 py-5 border-t-2 border-b-2 text-sm"
                                                    style={{ borderColor: colors.border }}
                                                    headers="contrat"
                                                >
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border-2" style={{ borderColor: colors.border, color: colors.text, backgroundColor: `${colors.text}15` }}>
                                                        {Array.isArray(app.offer?.contract) ? app.offer.contract.join(', ') : app.offer?.contract || 'N/A'}
                                                    </span>
                                                </td>

                                                {/* Cellule Date */}
                                                <td 
                                                    className="px-6 py-5 border-t-2 border-b-2 text-sm"
                                                    style={{ borderColor: colors.border, color: colors.text, opacity: 0.8 }}
                                                    headers="date"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Icon name="calendar" size={14} className="opacity-65" />
                                                        <time dateTime={app.createdAt}>
                                                            {new Date(app.createdAt).toLocaleDateString('fr-FR', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </time>
                                                    </div>
                                                </td>

                                                {/* Cellule Statut */}
                                                <td 
                                                    className="px-6 py-5 rounded-r-2xl border-2 border-l-0"
                                                    style={{ borderColor: colors.border }}
                                                    headers="statut"
                                                >
                                                    <span 
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2"
                                                        style={{
                                                            backgroundColor: app.status === 'VIEWED' ? '#10b98133' : '#eab30833',
                                                            color: app.status === 'VIEWED' ? '#10b981' : '#d97706',
                                                            borderColor: app.status === 'VIEWED' ? '#10b98166' : '#d9770666'
                                                        }}
                                                        role="status"
                                                        aria-label={getStatusLabel(app.status)}
                                                    >
                                                        <Icon name={app.status === 'VIEWED' ? 'check' : 'clock'} size={12} />
                                                        {getStatusText(app.status)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Version Mobile - Cartes */}
                            <div className="md:hidden grid gap-4">
                                {applications.map((app) => (
                                    <article
                                        key={app.id}
                                        onClick={() => navigate(`/mes-candidatures/${app.id}`)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                navigate(`/mes-candidatures/${app.id}`);
                                            }
                                        }}
                                        className="border-2 rounded-2xl p-5 cursor-pointer transition-all duration-200"
                                        style={{ 
                                            borderColor: colors.border,
                                            backgroundColor: colors.bg
                                        }}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`Voir les détails de votre candidature pour ${app.offer?.title || 'cette offre'}`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="font-bold mb-1 flex items-center gap-2" style={{ color: colors.text }}>
                                                    <Icon name="briefcase" size={16} className="opacity-60" />
                                                    {app.offer?.title || 'Titre non disponible'}
                                                </h3>
                                                <p className="text-sm flex items-center gap-2" style={{ color: colors.text, opacity: 0.75 }}>
                                                    <Icon name="building" size={14} className="opacity-65" />
                                                    {app.company?.name || 'Entreprise non disponible'}
                                                </p>
                                            </div>
                                            <span 
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 border-2"
                                                style={{
                                                    backgroundColor: app.status === 'VIEWED' ? '#10b98133' : '#eab30833',
                                                    color: app.status === 'VIEWED' ? '#10b981' : '#d97706',
                                                    borderColor: app.status === 'VIEWED' ? '#10b98166' : '#d9770666'
                                                }}
                                                role="status"
                                                aria-label={getStatusLabel(app.status)}
                                            >
                                                <Icon name={app.status === 'VIEWED' ? 'check' : 'clock'} size={12} />
                                                {getStatusText(app.status)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs pt-3 border-t" style={{ borderColor: colors.border, color: colors.text, opacity: 0.75 }}>
                                            <span className="flex items-center gap-1.5">
                                                <Icon name="calendar" size={12} />
                                                <time dateTime={app.createdAt}>
                                                    {new Date(app.createdAt).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </time>
                                            </span>
                                            {app.offer?.contract && (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border-2 text-xs font-semibold" style={{ borderColor: colors.border, backgroundColor: `${colors.text}15`, color: colors.text }}>
                                                    {Array.isArray(app.offer.contract) ? app.offer.contract.join(', ') : app.offer.contract}
                                                </span>
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </>
                    )}
                </section>
                </div>
            </main>
            
            <ScrollToTopButton />
            </div>
        </div>
    );
};
