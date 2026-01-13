/**
 * LoginPage - Page de connexion
 * Conforme RGAA - Accessibilité renforcée
 * Validation des champs, gestion des erreurs, toggle mot de passe
 */

import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services';
import { 
  isValidEmail, 
  isValidPassword 
} from '../utils';
import {
  ERROR_MESSAGES,
  VALIDATION_RULES,
  STORAGE_KEYS,
} from '../constants';
import { CloseIcon, LightbulbIcon } from '../components/icons';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export const LoginPage = () => {
  // ==================== STATE ====================
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // ==================== VALIDATION ====================
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email
    if (!formData.email) {
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
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Connexion
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      // Stocker le token et les données utilisateur
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

      // Redirection
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.error || 
        'Email ou mot de passe incorrect.';
      
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Project Handi
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Plateforme inclusive de recrutement
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-6 sm:p-8">
          {/* Titre */}
          <h2 className="text-xl sm:text-2xl font-bold text-sky-400 mb-4 sm:mb-6 text-center">
            Connexion
          </h2>

          {/* Erreur générale */}
          {errors.general && (
            <div 
              role="alert" 
              aria-live="assertive"
              className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-sm flex items-center gap-2"
            >
              <CloseIcon size={16} aria-hidden="true" />
              {errors.general}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Adresse email <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-slate-700 text-white border ${
                  errors.email ? 'border-red-500' : 'border-slate-600'
                } focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50 outline-none transition-all`}
                placeholder="marie.dupont@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                disabled={isLoading}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Mot de passe <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base rounded-lg bg-slate-700 text-white border ${
                    errors.password ? 'border-red-500' : 'border-slate-600'
                  } focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50 outline-none transition-all`}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : 'password-hint'}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded p-1"
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
                <p id="password-error" className="mt-1 text-sm text-red-400">
                  {errors.password}
                </p>
              )}
              {!errors.password && (
                <p id="password-hint" className="mt-1 text-xs text-slate-400">
                  Minimum {VALIDATION_RULES.PASSWORD_MIN_LENGTH} caractères
                </p>
              )}
            </div>

            {/* Bouton Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm sm:text-base font-semibold py-2.5 sm:py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Connexion...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Lien vers inscription */}
          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="text-sm text-slate-400 hover:text-sky-400 transition-colors focus:outline-none focus:underline"
            >
              Pas encore de compte ? <span className="font-semibold text-sky-400">S'inscrire</span>
            </Link>
          </div>

          {/* Retour à l'accueil */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 rounded px-2 py-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à l'accueil
            </Link>
          </div>
        </div>

        {/* Comptes de test (dev uniquement) */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400 mb-2 font-semibold flex items-center gap-2">
            <LightbulbIcon size={14} aria-hidden="true" />
            Comptes de test :
          </p>
          <div className="text-xs text-slate-500 space-y-1">
            <p>• Candidat : marie.dupont@example.com / password123</p>
            <p>• Recruteur : recruiter@techinclusion.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};