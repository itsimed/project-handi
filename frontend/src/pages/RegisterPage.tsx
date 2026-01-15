/**
 * RegisterPage - Page d'inscription dédiée
 * Alternative à la LoginPage avec mode inscription
 * Conforme RGAA - Accessibilité complète
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services';
import type { UserRole } from '../types';
import { 
  isValidEmail, 
  isValidPassword, 
  isValidName 
} from '../utils';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_RULES,
  ROUTES,
} from '../constants';
import { useTheme } from '../contexts/AccessibilityContext';
import { ScrollToTopButton } from '../components/ScrollToTopButton';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  companyName: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  general?: string;
}

export const RegisterPage = () => {
  // ==================== STATE ====================
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'APPLICANT',
    companyName: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  // ==================== VALIDATION ====================
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Prénom
    if (!formData.firstName.trim()) {
      newErrors.firstName = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!isValidName(formData.firstName)) {
      newErrors.firstName = 'Le prénom doit contenir 2 à 50 caractères.';
    }

    // Nom
    if (!formData.lastName.trim()) {
      newErrors.lastName = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!isValidName(formData.lastName)) {
      newErrors.lastName = 'Le nom doit contenir 2 à 50 caractères.';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = ERROR_MESSAGES.INVALID_EMAIL;
    }

    // Mot de passe
    if (!formData.password) {
      newErrors.password = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = ERROR_MESSAGES.PASSWORD_TOO_SHORT;
    }

    // Confirmation mot de passe
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';
    }

    // Nom de l'entreprise (uniquement pour les recruteurs)
    if (formData.role === 'RECRUITER') {
      if (!formData.companyName.trim()) {
        newErrors.companyName = ERROR_MESSAGES.REQUIRED_FIELD;
      } else if (formData.companyName.trim().length < 2 || formData.companyName.trim().length > 100) {
        newErrors.companyName = 'Le nom de l\'entreprise doit contenir entre 2 et 100 caractères.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== HANDLERS ====================
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Nettoyer l'erreur du champ modifié
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Validation spéciale pour confirmation mot de passe
    if (field === 'confirmPassword' || field === 'password') {
      if (errors.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: undefined }));
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await authService.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        ...(formData.role === 'RECRUITER' && formData.companyName && { companyName: formData.companyName }),
      });

      setSuccessMessage(SUCCESS_MESSAGES.REGISTER_SUCCESS);
      
      // Redirection vers login après 2 secondes
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);

    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.error || 
        'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
      
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative" style={{ backgroundColor: colors.bg, color: colors.text }}>
      {/* Pattern de fond subtil */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${colors.text} 1px, transparent 0)`,
          backgroundSize: '48px 48px',
        }}
      />
      
      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
            Créer un compte
          </h1>
        </div>

        {/* Formulaire */}
        
        <div className="rounded-2xl shadow-2xl border-2 p-8" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
          {/* Message de succès */}
          {successMessage && (
            <div 
              role="alert" 
              aria-live="polite"
              className="mb-6 p-4 border-2 rounded-lg flex items-start gap-3"
              style={{ 
                backgroundColor: `${colors.text}10`,
                borderColor: `${colors.text}50`,
                color: colors.text
              }}
            >
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold">Inscription réussie !</p>
                <p className="text-sm mt-1">Vous allez être redirigé vers la page de connexion...</p>
              </div>
            </div>
          )}

          {/* Erreur générale */}
          {errors.general && (
            <div 
              role="alert" 
              aria-live="assertive"
              className="mb-6 p-4 border-2 rounded-lg flex items-start gap-3"
              style={{ 
                backgroundColor: `${colors.text}10`,
                borderColor: `${colors.text}50`,
                color: colors.text
              }}
            >
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold">Erreur</p>
                <p className="text-sm mt-1">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Type de compte */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: colors.text }}>
                Je souhaite créer un compte <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleInputChange('role', 'APPLICANT')}
                  disabled={isLoading}
                  className="p-4 rounded-lg transition-all focus:outline-none focus:ring-2"
                  style={{
                    borderWidth: formData.role === 'APPLICANT' ? '2px' : '0px',
                    borderColor: formData.role === 'APPLICANT' ? colors.text : 'transparent',
                    backgroundColor: formData.role === 'APPLICANT' ? `${colors.text}10` : colors.bg,
                    color: colors.text
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ color: colors.text }}
                    >
                      <path
                        d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 20.5c0-3.314 3.134-6 8-6s8 2.686 8 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-semibold" style={{ color: colors.text }}>
                      Candidat·e
                    </span>
                    <span className="text-xs" style={{ color: colors.text, opacity: 0.7 }}>Je cherche un emploi</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleInputChange('role', 'RECRUITER')}
                  disabled={isLoading}
                  className="p-4 rounded-lg transition-all focus:outline-none focus:ring-2"
                  style={{
                    borderWidth: formData.role === 'RECRUITER' ? '2px' : '0px',
                    borderColor: formData.role === 'RECRUITER' ? colors.text : 'transparent',
                    backgroundColor: formData.role === 'RECRUITER' ? `${colors.text}10` : colors.bg,
                    color: colors.text
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ color: colors.text }}
                    >
                      <path
                        d="M9 6V5a3 3 0 0 1 6 0v1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 9.5c0-1.105.895-2 2-2h12c1.105 0 2 .895 2 2v7c0 1.105-.895 2-2 2H6c-1.105 0-2-.895-2-2v-7Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 13.5v1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 12h16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-semibold" style={{ color: colors.text }}>
                      Recruteur·euse
                    </span>
                    <span className="text-xs" style={{ color: colors.text, opacity: 0.7 }}>Je recrute</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Prénom + Nom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Prénom */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  Prénom <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: colors.bg,
                    color: colors.text,
                    borderColor: errors.firstName ? '#ef4444' : colors.border
                  }}
                  placeholder="Marie"
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <p id="firstName-error" className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Nom */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  Nom <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: colors.bg,
                    color: colors.text,
                    borderColor: errors.lastName ? '#ef4444' : colors.border
                  }}
                  placeholder="Dupont"
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <p id="lastName-error" className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Nom de l'entreprise (uniquement pour les recruteurs) */}
            {formData.role === 'RECRUITER' && (
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  Nom de l'entreprise <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  autoComplete="organization"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: colors.bg,
                    color: colors.text,
                    borderColor: errors.companyName ? '#ef4444' : colors.border
                  }}
                  placeholder="Tech Inclusion"
                  aria-invalid={!!errors.companyName}
                  aria-describedby={errors.companyName ? 'companyName-error' : undefined}
                  disabled={isLoading}
                />
                {errors.companyName && (
                  <p id="companyName-error" className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                    {errors.companyName}
                  </p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                Adresse email <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: colors.bg,
                  color: colors.text,
                  borderColor: errors.email ? '#ef4444' : colors.border
                }}
                placeholder="marie.dupont@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                disabled={isLoading}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  Mot de passe <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-lg border transition-all focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: colors.bg,
                      color: colors.text,
                      borderColor: errors.password ? '#ef4444' : colors.border
                    }}
                    placeholder="••••••••"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : 'password-hint'}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none focus:ring-2 rounded p-1"
                    style={{ color: colors.text, opacity: 0.7 }}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                    {errors.password}
                  </p>
                )}
                {!errors.password && (
                  <p id="password-hint" className="mt-1 text-xs" style={{ color: colors.text, opacity: 0.6 }}>
                    Min. {VALIDATION_RULES.PASSWORD_MIN_LENGTH} caractères
                  </p>
                )}
              </div>

              {/* Confirmation */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  Confirmer <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-lg border transition-all focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: colors.bg,
                      color: colors.text,
                      borderColor: errors.confirmPassword ? '#ef4444' : colors.border
                    }}
                    placeholder="••••••••"
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none focus:ring-2 rounded p-1"
                    style={{ color: colors.text, opacity: 0.7 }}
                    aria-label={showConfirmPassword ? 'Masquer' : 'Afficher'}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* CGU (optionnel) */}
            <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: `${colors.text}08`, borderColor: `${colors.border}` }}>
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: colors.text }}>
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm" style={{ color: colors.text }}>
                En vous inscrivant, vous acceptez nos{' '}
                <Link to="/cgu" className="underline" style={{ color: colors.text }}>
                  conditions d'utilisation
                </Link>{' '}
                et notre{' '}
                <Link to="/confidentialite" className="underline" style={{ color: colors.text }}>
                  politique de confidentialité
                </Link>.
              </p>
            </div>

            {/* Bouton Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-[0.99] focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: colors.text,
                color: colors.bg
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Création du compte...
                </span>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          {/* Lien vers connexion */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
              Vous avez déjà un compte ?{' '}
              <Link
                to={ROUTES.LOGIN}
                className="font-semibold transition-colors focus:outline-none focus:underline"
                style={{ color: colors.text, opacity: 1 }}
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Retour à l'accueil */}
        <div className="mt-6 text-center">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-sm transition-colors focus:outline-none focus:ring-2 rounded px-3 py-2 hover:opacity-70"
            style={{ color: colors.text, opacity: 0.7 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'accueil
          </Link>
        </div>
      </div>
      
      <ScrollToTopButton />
    </div>
  );
};
