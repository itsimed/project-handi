// project-handi/frontend/src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyApplicationsPage } from './pages/MyApplicationsPage';
import { ApplicationDetailPage } from './pages/ApplicationDetailPage';
import { OfferDetailPage } from './pages/OfferDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { RecruiterOfferDetailPage } from './pages/RecruiterOfferDetailPage';
import { PublishOfferPage } from './pages/PublishOfferPage';
import { EditOfferPage } from './pages/EditOfferPage';
import { ApplicationDocumentsPage } from './pages/ApplicationDocumentsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
// import { RoleBasedRoute } from './components/RoleBasedRoute';
import { ScrollToTop } from './components/ScrollToTop';
import { AccessibilityButton } from './components/AccessibilityButton';

function App() 
{
    return (
        <Router>
            <ScrollToTop />
            <Toaster />
            <AccessibilityButton />
            <Routes>
                {/* 1. Page d'accueil avec hero et recherche */}
                <Route path="/" element={<HomePage />} />
                
                {/* 2. Page de résultats avec filtres - PUBLIQUE (tous les utilisateurs) */}
                <Route path="/dashboard" element={<DashboardPage />} />
                
                {/* 3. Page de détail d'une offre */}
                <Route path="/offres/:id" element={<OfferDetailPage />} />
                
                {/* 4. Authentification */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* 5. Dashboard recruteur (protégé) */}
                <Route path="/recruteur/dashboard" element={<ProtectedRoute><RecruiterDashboard /></ProtectedRoute>} />

                {/* 5.1. Détail d'une offre pour recruteur (protégé) */}
                <Route path="/recruteur/offres/:id" element={<ProtectedRoute><RecruiterOfferDetailPage /></ProtectedRoute>} />

                {/* 6. Publier une offre - Recruteur uniquement (protégé) */}
                <Route path="/recruteur/publier-offre" element={<ProtectedRoute><PublishOfferPage /></ProtectedRoute>} />

                {/* 6.1. Modifier une offre - Recruteur uniquement (protégé) */}
                <Route path="/recruteur/modifier-offre/:id" element={<ProtectedRoute><EditOfferPage /></ProtectedRoute>} />

                {/* 7. Profil utilisateur (protégé) */}
                <Route path="/profil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                {/* 8. Paramètres utilisateur (protégé) */}
                <Route path="/parametres" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

                {/* 9. Documents de candidature (protégée) */}
                <Route path="/mes-candidatures/:applicationId/documents" element={<ProtectedRoute><ApplicationDocumentsPage /></ProtectedRoute>} />

                {/* 10. Liste de mes candidatures (protégée) */}
                <Route path="/mes-candidatures" element={<ProtectedRoute><MyApplicationsPage /></ProtectedRoute>}/>
                
                {/* 11. Détail d'une candidature (protégée) */}
                <Route path="/mes-candidatures/:id" element={<ProtectedRoute><ApplicationDetailPage /></ProtectedRoute>}/>
                
                {/* 11. Gestion de l'erreur 404 */}
                <Route path="*" element={
                    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
                        <h1 className="text-6xl font-bold text-sky-500 mb-4">404</h1>
                        <p className="text-xl text-slate-400 mb-8">Oups ! Cette page n'existe pas.</p>
                        <button
                            type="button"
                            onClick={() => window.location.href = '/'}
                            className="text-sky-400 hover:text-sky-300 underline focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 px-2 py-1 rounded"
                        >
                            Retourner à l'accueil
                        </button>
                    </div>
                } />
            </Routes>
        </Router>
    );
}

export default App;