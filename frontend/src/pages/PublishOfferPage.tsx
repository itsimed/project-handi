/**
 * PublishOfferPage - Page de publication d'offre d'emploi pour recruteurs
 * Permet aux recruteurs de créer et publier de nouvelles offres
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Breadcrumb } from '../components/Breadcrumb';
import apiClient from '../api/apiClient';
import { STORAGE_KEYS } from '../constants';
import { CheckIcon } from '../components/icons';
import { useTheme } from '../contexts/AccessibilityContext';
import { ScrollToTopButton } from '../components/ScrollToTopButton';

interface FormData {
  title: string;
  description: string;
  location: string;
  contract: string[];
  experience: string;
  remote: string;
  disabilityCompatible: string[];
  companyId: number | null;
}

export const PublishOfferPage = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    location: '',
    contract: [],
    experience: 'CONFIRME',
    remote: 'HYBRID',
    disabilityCompatible: [],
    companyId: null,
  });

  // Vérifier que l'utilisateur est un recruteur
  useEffect(() => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role !== 'RECRUITER') {
        navigate('/dashboard');
        return;
      }
      // Récupérer l'ID de l'entreprise du recruteur
      if (user.company?.id) {
        setFormData(prev => ({ ...prev, companyId: user.company.id }));
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDisabilityToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      disabilityCompatible: prev.disabilityCompatible.includes(category)
        ? prev.disabilityCompatible.filter(c => c !== category)
        : [...prev.disabilityCompatible, category],
    }));
  };

  const handleContractToggle = (contractType: string) => {
    setFormData(prev => ({
      ...prev,
      contract: prev.contract.includes(contractType)
        ? prev.contract.filter(c => c !== contractType)
        : [...prev.contract, contractType],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation : au moins un type de contrat
    if (formData.contract.length === 0) {
      setError('Veuillez sélectionner au moins un type de contrat');
      return;
    }

    // Validation : au moins une option de compensation handicap
    if (formData.disabilityCompatible.length === 0) {
      setError('Veuillez sélectionner au moins une option de compensation handicap');
      return;
    }

    // Validation : companyId requis
    if (!formData.companyId || formData.companyId === 0) {
      setError('Erreur : Aucune entreprise associée à votre compte. Veuillez contacter un administrateur.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Envoyer tous les contrats sélectionnés
      await apiClient.post('/offers', formData);
      setSuccess(true);
      
      // Redirection après 2 secondes
      setTimeout(() => {
        navigate('/recruteur/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la publication de l\'offre');
      setIsSubmitting(false);
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
      <Navbar variant="recruiter" />
      
      {/* Fil d'Ariane */}
      <Breadcrumb />

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3" style={{ color: colors.text }}>
            Publier une offre d'emploi
          </h1>
          <p className="text-lg" style={{ color: colors.text, opacity: 0.7 }}>
            Créez une nouvelle offre d'emploi accessible et inclusive
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 border rounded-xl" style={{ borderColor: colors.border, color: colors.text }}>
            <strong className="font-bold">Erreur : </strong>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 border rounded-xl" style={{ borderColor: colors.border, color: colors.text }}>
            <strong className="font-bold">Succès ! </strong>
            <span>Votre offre a été publiée avec succès. Redirection...</span>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="border-2 rounded-2xl p-8 space-y-6" style={{ borderColor: colors.border }}>
          {/* Titre de l'offre */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
              Titre de l'offre *
            </label>
            <input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none"
              style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }}
              placeholder="Ex: Développeur Full Stack"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
              Description du poste *
            </label>
            <textarea
              id="description"
              required
              rows={8}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none resize-none"
              style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }}
              placeholder="Décrivez le poste, les missions, les compétences requises..."
            />
          </div>

          {/* Localisation */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
              Localisation *
            </label>
            <input
              id="location"
              type="text"
              required
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none"
              style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }}
              placeholder="Ex: Paris, Lyon, Remote..."
            />
          </div>

          {/* Type de contrat */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: colors.text }}>
              Type de contrat * (au moins un)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'CDI', label: 'CDI' },
                { value: 'CDD', label: 'CDD' },
                { value: 'INTERIM', label: 'Intérim' },
                { value: 'STAGE', label: 'Stage' },
                { value: 'ALTERNANCE', label: 'Alternance' },
              ].map((contractType) => (
                <button
                  key={contractType.value}
                  type="button"
                  onClick={() => handleContractToggle(contractType.value)}
                  className="p-3 rounded-lg border-2 transition-all duration-200 font-medium focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: formData.contract.includes(contractType.value) ? colors.bg : `${colors.bg}80`,
                    borderColor: formData.contract.includes(contractType.value) ? colors.text : colors.border,
                    color: colors.text,
                    opacity: formData.contract.includes(contractType.value) ? 1 : 0.7
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span>{contractType.label}</span>
                    {formData.contract.includes(contractType.value) && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: colors.text }}>
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Niveau d'expérience */}
          <div>
            <label htmlFor="experience" className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
              Niveau d'expérience requis *
            </label>
            <select
              id="experience"
              required
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none"
              style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }}
            >
              <option value="JUNIOR">Junior (0-2 ans)</option>
              <option value="CONFIRME">Confirmé (2-5 ans)</option>
              <option value="SENIOR">Senior (5+ ans)</option>
            </select>
          </div>

          {/* Politique de télétravail */}
          <div>
            <label htmlFor="remote" className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
              Politique de télétravail *
            </label>
            <select
              id="remote"
              required
              value={formData.remote}
              onChange={(e) => handleInputChange('remote', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none"
              style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }}
            >
              <option value="FULL_REMOTE">100% Télétravail</option>
              <option value="HYBRID">Hybride</option>
              <option value="NO_REMOTE">Sur site</option>
            </select>
          </div>

          {/* Compensation handicap */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: colors.text }}>
              Compensation handicap *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'MOTEUR', label: 'Handicap moteur' },
                { value: 'VISUEL', label: 'Handicap visuel' },
                { value: 'AUDITIF', label: 'Handicap auditif' },
                { value: 'COGNITIF', label: 'Handicap cognitif' },
                { value: 'PSYCHIQUE', label: 'Handicap psychique' },
                { value: 'NO_COMPENSATION', label: 'Aucune compensation' },
              ].map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleDisabilityToggle(category.value)}
                  className="p-3 rounded-lg border-2 transition-all duration-200 text-left font-medium focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: formData.disabilityCompatible.includes(category.value) ? colors.bg : `${colors.bg}80`,
                    borderColor: formData.disabilityCompatible.includes(category.value) ? colors.text : colors.border,
                    color: colors.text,
                    opacity: formData.disabilityCompatible.includes(category.value) ? 1 : 0.7
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span>{category.label}</span>
                    {formData.disabilityCompatible.includes(category.value) && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: colors.text }}>
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Publication en cours...
                </span>
              ) : success ? (
                <span className="flex items-center gap-2">
                  <CheckIcon size={18} aria-hidden="true" />
                  Offre publiée
                </span>
              ) : (
                'Publier l\'offre'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/recruteur/dashboard')}
              disabled={isSubmitting}
              className="px-6 py-3 font-semibold rounded-xl border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: colors.border, color: colors.text }}
            >
              Annuler
            </button>
          </div>
        </form>
      </main>
      
      <ScrollToTopButton />
      </div>
    </div>
  );
};
