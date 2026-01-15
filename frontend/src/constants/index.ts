/**
 * Constantes de configuration - Project Handi
 * Centralisation de toutes les constantes de l'application
 */

// ==================== API ====================

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1',
  TIMEOUT: 10000,
} as const;

// ==================== ROUTES ====================

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  REGISTER: '/register',
  OFFERS: '/offres',
  OFFER_DETAIL: (id: number | string) => `/offres/${id}`,
  MY_APPLICATIONS: '/mes-candidatures',
  APPLICATION_DETAIL: (id: number | string) => `/mes-candidatures/${id}`,
} as const;

// ==================== LABELS ====================

export const CONTRACT_LABELS: Record<string, string> = {
  CDI: 'CDI',
  CDD: 'CDD',
  INTERIM: 'Intérim',
  STAGE: 'Stage',
  ALTERNANCE: 'Alternance',
};

export const EXPERIENCE_LABELS: Record<string, string> = {
  JUNIOR: 'Junior (0-2 ans)',
  CONFIRME: 'Confirmé (2-5 ans)',
  SENIOR: 'Senior (5+ ans)',
};

export const REMOTE_LABELS: Record<string, string> = {
  NO_REMOTE: 'Présentiel',
  HYBRID: 'Hybride',
  FULL_REMOTE: 'Full Remote',
};

export const DISABILITY_LABELS: Record<string, string> = {
  MOTEUR: 'Handicap moteur',
  VISUEL: 'Déficience visuelle',
  AUDITIF: 'Déficience auditive',
  PSYCHIQUE: 'Handicap psychique',
  COGNITIF: 'Handicap cognitif',
  INVISIBLE: 'Handicap invisible',
};

export const STATUS_LABELS: Record<string, string> = {
  NOT_VIEWED: 'Non consultée',
  VIEWED: 'Consultée',
};

export const ROLE_LABELS: Record<string, string> = {
  APPLICANT: 'Candidat',
  RECRUITER: 'Recruteur',
  ADMIN: 'Administrateur',
};

// ==================== COLORS ====================

export const STATUS_COLORS: Record<string, string> = {
  NOT_VIEWED: 'bg-yellow-100 text-yellow-800',
  VIEWED: 'bg-green-100 text-green-800',
};

export const CONTRACT_COLORS: Record<string, string> = {
  CDI: 'bg-blue-100 text-blue-800',
  CDD: 'bg-purple-100 text-purple-800',
  INTERIM: 'bg-orange-100 text-orange-800',
  STAGE: 'bg-pink-100 text-pink-800',
  ALTERNANCE: 'bg-cyan-100 text-cyan-800',
};

// ==================== ACCESSIBILITY ====================

export const ARIA_LABELS = {
  SEARCH_OFFERS: 'Rechercher des offres d\'emploi',
  FILTER_PANEL: 'Panneau de filtres',
  OFFER_CARD: (title: string) => `Offre d'emploi : ${title}`,
  APPLICATION_STATUS: (status: string) => `Statut de la candidature : ${STATUS_LABELS[status]}`,
  CLOSE_MODAL: 'Fermer la fenêtre',
  MAIN_NAV: 'Navigation principale',
} as const;

// ==================== VALIDATION ====================

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 2000,
} as const;

// ==================== MESSAGES ====================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion au serveur. Veuillez réessayer.',
  UNAUTHORIZED: 'Vous devez être connecté pour accéder à cette page.',
  FORBIDDEN: 'Vous n\'avez pas les droits pour effectuer cette action.',
  NOT_FOUND: 'La ressource demandée est introuvable.',
  SERVER_ERROR: 'Une erreur serveur s\'est produite. Réessayez plus tard.',
  INVALID_EMAIL: 'L\'adresse email n\'est pas valide.',
  PASSWORD_TOO_SHORT: `Le mot de passe doit contenir au moins ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caractères.`,
  REQUIRED_FIELD: 'Ce champ est requis.',
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie !',
  REGISTER_SUCCESS: 'Inscription réussie ! Vous pouvez maintenant vous connecter.',
  APPLICATION_SENT: 'Votre candidature a été envoyée avec succès !',
  PROFILE_UPDATED: 'Votre profil a été mis à jour.',
} as const;

// ==================== LOCAL STORAGE KEYS ====================

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  USER_DATA: 'userData',
  THEME: 'theme',
  LAST_SEARCH: 'lastSearch',
} as const;

// ==================== PAGINATION ====================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  OFFERS_PER_PAGE: 12,
  APPLICATIONS_PER_PAGE: 20,
} as const;
