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
import { ScrollToTopButton } from '../components/ScrollToTopButton';
import { useCompanies } from '../hooks/useCompanies';
import apiClient from '../api/apiClient';
import { toastService } from '../services/toastService';
import { useTheme } from '../contexts/AccessibilityContext';
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
  totalApplications: number;
  activeRecruiters?: number;
}

interface QuickAccessButton {
  id: string;
  label: string;
  icon: 'graduation' | 'target' | 'briefcase' | 'lightning';
  contract: string;
  gradient: string;
}

interface ContractCounts {
  STAGE: number;
  ALTERNANCE: number;
  CDI: number;
  INTERIM: number;
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

export const HomePage = () => {
  // ==================== HOOKS ====================
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [stats, setStats] = useState<Stats>({
    totalOffers: 0,
    totalCompanies: 0,
    totalApplications: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [contractCounts, setContractCounts] = useState<ContractCounts>({
    STAGE: 0,
    ALTERNANCE: 0,
    CDI: 0,
    INTERIM: 0
  });
  const { companies, isLoading: isLoadingCompanies } = useCompanies();
  const isLoggedIn = !!localStorage.getItem('token');
  const { colors, theme } = useTheme();

  // Helper pour rendre les icônes avec la bonne couleur selon le thème
  const renderIcon = (iconType: string, size: number = 40) => {
    const iconProps = { size, className: theme === 'dark' ? 'text-white' : 'text-[#23022E]' };
    
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
        const response = await apiClient.get('/stats');
        
        setStats({
          totalOffers: response.data.totalOffers,
          totalCompanies: response.data.totalCompanies,
          totalApplications: response.data.totalApplications,
          activeRecruiters: response.data.totalApplicants,
        });
      } catch (error) {
        toastService.error('Impossible de charger les statistiques');
        setStats({ totalOffers: 0, totalCompanies: 0, totalApplications: 0 });
      } finally {
        setIsLoadingStats(false);
      }
    };
    
    fetchStats();
  }, []);

  // Fetch contract counts
  useEffect(() => {
    const fetchContractCounts = async () => {
      try {
        const response = await apiClient.get('/offers');
        const offers = response.data;
        
        const counts: ContractCounts = {
          STAGE: 0,
          ALTERNANCE: 0,
          CDI: 0,
          INTERIM: 0
        };
        
        offers.forEach((offer: any) => {
          // Le champ s'appelle "contract" dans le schéma Prisma
          if (offer.contract && Array.isArray(offer.contract)) {
            offer.contract.forEach((type: string) => {
              if (type in counts) {
                counts[type as keyof ContractCounts]++;
              }
            });
          }
        });
        
        setContractCounts(counts);
      } catch (error) {
        console.error('Erreur lors du chargement des comptages de contrats:', error);
      }
    };
    
    fetchContractCounts();
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
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: colors.bg, color: colors.text }}>
      {/* ==================== HEADER ==================== */}
      <Navbar variant="home" />

      {/* ==================== HERO SECTION ==================== */}
      <main>
        <section
          ref={heroRef}
          aria-label="Recherche d'offres d'emploi"
          className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: colors.bg }}
        >
          {/* Pattern de fond subtil */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, ${colors.text} 1px, transparent 0)`,
              backgroundSize: '48px 48px',
            }}
          />

          {/* Image Hero en arrière-plan - Bandeau pleine largeur */}
          <div className="absolute inset-0 z-0">
            <picture>
              <source media="(max-width: 768px)" srcSet="/hero%20mobile.webp" />
              <source media="(min-width: 769px)" srcSet="/hero.webp" />
              <img
                src="/hero.webp"
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover opacity-80"
                style={{ 
                  borderRadius: '0',
                  maxHeight: 'none'
                }}
              />
            </picture>
            {/* Overlay sombre pour mobile uniquement */}
            <div 
              className="absolute inset-0 md:hidden" 
              style={{ 
                background: 'linear-gradient(to bottom, rgba(35, 2, 46, 0.3), rgba(35, 2, 46, 0.5))'
              }}
            />
          </div>

          <div className="relative z-10 container mx-auto px-6 py-20">
            {/* Hero Content */}
            <div className="text-left mb-12 space-y-6 max-w-3xl">
              

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white md:text-[#23022E]">
                Trouvez le job qui vous
                <br />
                correspond vraiment parmi
              </h2>

              <div className="flex items-center justify-start gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white md:border-[#23022E]">
                  <span className="text-3xl font-bold text-white md:text-[#23022E]">
                    {isLoadingStats ? '...' : stats.totalOffers.toLocaleString('fr-FR')}
                  </span>
                  <span className="text-sm font-medium text-white/70 md:text-[#23022E]/70">offres actives</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white md:border-[#23022E]">
                  <span className="text-3xl font-bold text-white md:text-[#23022E]">
                    {isLoadingStats ? '...' : stats.totalCompanies.toLocaleString('fr-FR')}
                  </span>
                  <span className="text-sm font-medium text-white/70 md:text-[#23022E]/70">entreprises</span>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mt-20 sm:mt-19 lg:mt-20">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Stats Bar */}
            <div className="mt-8 max-w-4xl mx-auto">
              <StatsBar
                totalOffers={stats.totalOffers}
                totalCompanies={stats.totalCompanies}
                totalApplications={stats.totalApplications}
                totalApplicants={stats.activeRecruiters}
                isLoading={isLoadingStats}
              />
            </div>
          </div>
        </section>

        {/* ==================== QUICK ACCESS FILTERS ==================== */}
        <section className="relative py-16" style={{ backgroundColor: colors.bg }}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold mb-3" style={{ color: colors.text }}>
                Recherches populaires
              </h3>
              <p style={{ color: colors.text, opacity: 0.7 }}>Explorez les offres par type de contrat</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {QUICK_ACCESS_FILTERS.map((filter, index) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => navigate(`/dashboard?contract=${filter.contract}`)}
                  className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: colors.bg,
                    border: `2px solid ${colors.border}`
                  }}
                >
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-auto">
                      <div className="transform group-hover:scale-110 transition-transform duration-200">
                        {renderIcon(filter.icon, 40)}
                      </div>
                      <h4 className="text-lg font-semibold" style={{ color: colors.text }}>
                        {filter.label}
                      </h4>
                    </div>
                    <p className="text-2xl font-bold mt-4" style={{ color: colors.text }}>
                      {contractCounts[filter.contract as keyof ContractCounts]} offres
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== BENEFITS SECTION ==================== */}
        <section className="py-20" style={{ backgroundColor: colors.bg }}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
                Pourquoi choisir Project Handi ?
              </h3>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text, opacity: 0.7 }}>
                Une plateforme pensée pour faciliter votre recherche d'emploi
                et garantir une expérience optimale pour tous.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {BENEFITS.map((benefit, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-2xl transition-all duration-200 border-2"
                  style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                >
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-200">
                    {renderIcon(benefit.icon, 48)}
                  </div>
                  <h4 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                    {benefit.title}
                  </h4>
                  <p className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
                    {benefit.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== CTA SECTION ==================== */}
        <section className="relative py-20 overflow-hidden" style={{ backgroundColor: colors.text }}>
          {/* Pattern de fond subtil */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${colors.bg} 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />

          <div className="relative container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium mb-6" style={{ borderColor: colors.bg, color: colors.bg }}>
                Démarquez-vous auprès des recruteurs
              </div>

              <h3 className="text-4xl font-bold mb-6" style={{ color: colors.bg }}>
                Déposez votre CV et soyez visible par les entreprises
              </h3>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  type="button"
                  onClick={() => isLoggedIn ? handleNavigateToDashboard() : navigate('/register')}
                  className="px-8 py-4 font-bold rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {isLoggedIn ? 'Parcourir les offres' : 'Créer mon compte gratuit'}
                </button>

                <button
                  type="button"
                  onClick={handleNavigateToDashboard}
                  className="px-8 py-4 font-semibold rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{ backgroundColor: colors.text, color: colors.bg, borderColor: colors.bg }}
                >
                  Explorer les offres
                </button>
              </div>

              
            </div>
          </div>
        </section>

        
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="relative border-t py-12" style={{ backgroundColor: colors.bg, borderColor: `${colors.border}1A` }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="mb-4">
                  <h3 className="text-lg font-bold" style={{ color: colors.text }}>
                    Project Handi
                  </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: colors.text, opacity: 0.7 }}>
                La plateforme de recrutement qui met l'accessibilité
                et l'inclusion au cœur de son ADN.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4" style={{ color: colors.text }}>Navigation</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={handleNavigateToDashboard}
                    className="transition-colors text-sm focus:outline-none focus:underline"
                    style={{ color: colors.text, opacity: 0.7 }}
                  >
                    Offres d'emploi
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/register')}
                    className="transition-colors text-sm focus:outline-none focus:underline"
                    style={{ color: colors.text, opacity: 0.7 }}
                  >
                    Créer un compte
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/login')}
                    className="transition-colors text-sm focus:outline-none focus:underline"
                    style={{ color: colors.text, opacity: 0.7 }}
                  >
                    Se connecter
                  </button>
                </li>
              </ul>
            </div>

            {/* Compliance */}
            <div>
              <h4 className="font-semibold mb-4" style={{ color: colors.text }}>Accessibilité</h4>
              <div className="flex items-start gap-2 text-sm mb-3" style={{ color: colors.text, opacity: 0.7 }}>
                <Icon name="accessibility" size={18} className="mt-0.5 flex-shrink-0" />
                <span>Conforme RGAA / WCAG 2.1 AA</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: colors.text, opacity: 0.5 }}>
                Cette plateforme respecte les standards d'accessibilité
                pour garantir une expérience inclusive pour tous.
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t text-center" style={{ borderColor: `${colors.border}1A` }}>
            <p className="text-sm" style={{ color: colors.text, opacity: 0.5 }}>
              © {new Date().getFullYear()} Project Handi. Tous droits réservés.
              Plateforme de recrutement inclusive.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Bouton scroll to top */}
      <ScrollToTopButton />
    </div>
  );
};

