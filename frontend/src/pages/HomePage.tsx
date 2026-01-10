/**
 * HomePage - Plateforme Project Handi
 * Architecture professionnelle avec micro-interactions et animations optimisées
 * Stack: React 18 + TypeScript + Tailwind CSS
 * Standards: RGAA/WCAG 2.1 AA, Performance-first
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { StatsBar } from '../components/StatsBar';
import { CompaniesSection } from '../components/CompaniesSection';
import { Navbar } from '../components/Navbar';
import { Icon } from '../components/Icon';
import { useCompanies } from '../hooks/useCompanies';
import apiClient from '../api/apiClient';
import { 
  AccessibilityIcon, 
  GraduationIcon, 
  TargetIcon, 
  BriefcaseIcon, 
  LightningIcon, 
  LockIcon 
} from '../components/icons';

// ==================== TYPES ====================
interface Stats {
  totalOffers: number;
  totalCompanies: number;
  activeRecruiters?: number;
}

interface QuickAccessButton {
  id: string;
  label: string;
  icon: 'graduation' | 'target' | 'briefcase' | 'lightning';
  contract: string;
  gradient: string;
}

// ==================== CONFIGURATION ====================
const QUICK_ACCESS_FILTERS: QuickAccessButton[] = [
  { id: 'stage', label: 'Stages & Jobs étudiants', icon: 'graduation', contract: 'STAGE', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'alternance', label: 'Alternance', icon: 'target', contract: 'ALTERNANCE', gradient: 'from-purple-500 to-pink-500' },
  { id: 'cdi', label: 'CDI', icon: 'briefcase', contract: 'CDI', gradient: 'from-emerald-500 to-teal-500' },
  { id: 'interim', label: 'Missions Intérim', icon: 'lightning', contract: 'INTERIM', gradient: 'from-orange-500 to-red-500' },
];

const BENEFITS = [
  { icon: 'accessibility', title: 'Accessibilité universelle', desc: 'Entreprises engagées dans l\'inclusion' },
  { icon: 'target', title: 'Matching intelligent', desc: 'Offres adaptées à votre profil' },
  { icon: 'lock', title: 'Confidentialité garantie', desc: 'Vos données personnelles protégées' },
  { icon: 'lightning', title: 'Candidature rapide', desc: 'Postulez en quelques clics' },
];

// Helper pour rendre les icônes
const renderIcon = (iconType: string, size: number = 40) => {
  const iconProps = { size, className: 'text-white' };
  
  switch (iconType) {
    case 'graduation':
      return <GraduationIcon {...iconProps} />;
    case 'target':
      return <TargetIcon {...iconProps} />;
    case 'briefcase':
      return <BriefcaseIcon {...iconProps} />;
    case 'lightning':
      return <LightningIcon {...iconProps} />;
    case 'accessibility':
      return <AccessibilityIcon {...iconProps} />;
    case 'lock':
      return <LockIcon {...iconProps} />;
    default:
      return null;
  }
};

export const HomePage = () => {
  // ==================== HOOKS ====================
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [stats, setStats] = useState<Stats>({
    totalOffers: 0,
    totalCompanies: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const { companies, isLoading: isLoadingCompanies } = useCompanies();
  const isLoggedIn = !!localStorage.getItem('token');

  // ==================== EFFECTS ====================
  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch statistics with error handling
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [offersResponse, companiesResponse] = await Promise.all([
          apiClient.get('/offers'),
          apiClient.get('/companies'),
        ]);
        
        setStats({
          totalOffers: offersResponse.data.length,
          totalCompanies: companiesResponse.data.length,
          activeRecruiters: Math.floor(companiesResponse.data.length * 1.5), // Estimation
        });
      } catch (error) {
        toastService.error('Impossible de charger les statistiques');
        setStats({ totalOffers: 0, totalCompanies: 0 });
      } finally {
        setIsLoadingStats(false);
      }
    };
    
    fetchStats();
  }, []);

  // ==================== HANDLERS ====================
  const handleAuthAction = () => {
    if (isLoggedIn) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.href = '/';
    } else {
      navigate('/login');
    }
  };

  const handleNavigateToDashboard = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      // Rediriger vers le bon dashboard selon le rôle
      navigate(user.role === 'RECRUITER' ? '/recruteur/dashboard' : '/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleNavigateToApplications = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      // Les recruteurs ne doivent pas avoir accès aux candidatures candidat
      if (user.role === 'RECRUITER') {
        navigate('/recruteur/dashboard');
      } else {
        navigate('/mes-candidatures');
      }
    } else {
      navigate('/login');
    }
  };

  const handleSearch = ({ what, where }: { what: string; where: string }) => {
    const params = new URLSearchParams();
    if (what.trim()) params.append('what', what.trim());
    if (where.trim()) params.append('where', where.trim());
    
    const userData = localStorage.getItem('userData');
    let basePath = '/dashboard';
    
    if (userData) {
      const user = JSON.parse(userData);
      basePath = user.role === 'RECRUITER' ? '/recruteur/dashboard' : '/dashboard';
    }
    
    navigate(params.toString() ? `${basePath}?${params.toString()}` : basePath);
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* ==================== HEADER ==================== */}
      <Navbar variant="home" />

      {/* ==================== HERO SECTION ==================== */}
      <main>
        <section
          ref={heroRef}
          aria-label="Recherche d'offres d'emploi"
          className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
        >
          {/* Animated background gradient */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
            style={{
              transform: `translateY(${scrollY * 0.5}px)`,
            }}
          >
            {/* Animated orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="relative z-10 container mx-auto px-6 py-20">
            {/* Hero Content */}
            <div className="text-center mb-12 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 border border-sky-500/20 rounded-full text-sky-400 text-sm font-medium mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
                Plateforme 100% inclusive
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-50 leading-tight">
                Trouvez le job qui vous
                <br />
                <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  correspond vraiment
                </span>
              </h2>

              <div className="flex items-center justify-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <span className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                    {isLoadingStats ? '...' : stats.totalOffers.toLocaleString('fr-FR')}
                  </span>
                  <span className="text-slate-400 text-sm font-medium">offres actives</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                    {isLoadingStats ? '...' : stats.totalCompanies.toLocaleString('fr-FR')}
                  </span>
                  <span className="text-slate-400 text-sm font-medium">entreprises</span>
                </div>
              </div>

              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Des opportunités professionnelles adaptées à tous les profils,
                avec un engagement fort pour l'accessibilité et l'inclusion.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Stats Bar */}
            <div className="mt-8">
              <StatsBar
                totalOffers={stats.totalOffers}
                totalCompanies={stats.totalCompanies}
                isLoading={isLoadingStats}
              />
            </div>
          </div>
        </section>

        {/* ==================== QUICK ACCESS FILTERS ==================== */}
        <section className="relative py-16 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-slate-100 mb-3">
                Recherches populaires
              </h3>
              <p className="text-slate-400">Explorez les offres par type de contrat</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {QUICK_ACCESS_FILTERS.map((filter, index) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => navigate(`/dashboard?contract=${filter.contract}`)}
                  className="group relative overflow-hidden bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-sky-500/10 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${filter.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    <div className="mb-3 transform group-hover:scale-110 transition-transform duration-300">
                      {renderIcon(filter.icon, 40)}
                    </div>
                    <h4 className="text-lg font-semibold text-slate-100 mb-1">
                      {filter.label}
                    </h4>
                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                      Voir les offres →
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== BENEFITS SECTION ==================== */}
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-slate-100 mb-4">
                Pourquoi choisir Project Handi ?
              </h3>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Une plateforme pensée pour faciliter votre recherche d'emploi
                et garantir une expérience optimale pour tous.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {BENEFITS.map((benefit, index) => (
                <div
                  key={index}
                  className="group p-6 bg-slate-800/30 border border-slate-700/50 rounded-2xl hover:bg-slate-800/50 hover:border-sky-500/30 transition-all duration-300"
                >
                  <div className="mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    {renderIcon(benefit.icon, 48)}
                  </div>
                  <h4 className="text-lg font-semibold text-slate-100 mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-slate-400 text-sm">
                    {benefit.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== CTA SECTION ==================== */}
        <section className="relative py-20 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-slate-950" />
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(148 163 184 / 0.1) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />

          <div className="relative container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 border border-sky-500/20 rounded-full text-sky-400 text-sm font-medium mb-6">
                <span>⭐</span>
                Démarquez-vous auprès des recruteurs
              </div>

              <h3 className="text-4xl font-bold text-slate-100 mb-6">
                Déposez votre CV et soyez visible par les entreprises
              </h3>

              <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
                En moyenne, un CV publié sur notre plateforme est consulté par{' '}
                <span className="text-sky-400 font-semibold">30 recruteurs</span> actifs.
                Multipliez vos chances d'être contacté !
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  type="button"
                  onClick={() => isLoggedIn ? handleNavigateToDashboard() : navigate('/register')}
                  className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-sky-500/30 hover:shadow-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  {isLoggedIn ? 'Parcourir les offres' : 'Créer mon compte gratuit'}
                </button>

                <button
                  type="button"
                  onClick={handleNavigateToDashboard}
                  className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  Explorer les offres
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>100% gratuit</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Sans engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Inscription en 2 min</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== COMPANIES SECTION ==================== */}
        {!isLoadingCompanies && companies.length > 0 && (
          <section className="py-20 bg-slate-900">
            <div className="container mx-auto px-6">
              <CompaniesSection
                companies={companies}
                isLoading={isLoadingCompanies}
              />
            </div>
          </section>
        )}
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="relative border-t border-slate-800/50 bg-slate-950 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="mb-4">
                  <h3 className="text-lg font-bold bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
                    Project Handi
                  </h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                La plateforme de recrutement qui met l'accessibilité
                et l'inclusion au cœur de son ADN.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-slate-300 font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={handleNavigateToDashboard}
                    className="text-slate-400 hover:text-sky-400 transition-colors text-sm focus:outline-none focus:underline"
                  >
                    Offres d'emploi
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/register')}
                    className="text-slate-400 hover:text-sky-400 transition-colors text-sm focus:outline-none focus:underline"
                  >
                    Créer un compte
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-slate-400 hover:text-sky-400 transition-colors text-sm focus:outline-none focus:underline"
                  >
                    Se connecter
                  </button>
                </li>
              </ul>
            </div>

            {/* Compliance */}
            <div>
              <h4 className="text-slate-300 font-semibold mb-4">Accessibilité</h4>
              <div className="flex items-start gap-2 text-slate-400 text-sm mb-3">
                <Icon name="accessibility" size={18} className="mt-0.5 flex-shrink-0" />
                <span>Conforme RGAA / WCAG 2.1 AA</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Cette plateforme respecte les standards d'accessibilité
                pour garantir une expérience inclusive pour tous.
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-slate-800/50 text-center">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Project Handi. Tous droits réservés.
              Plateforme de recrutement inclusive.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

