/**
 * Constantes globales de l'application
 * Centralise toutes les valeurs constantes
 */

import type { ContractType, ExperienceLevel, ResourceType } from '../types';

// ============================================
// APP CONFIG
// ============================================

export const APP_NAME = 'TalentConnect';
export const APP_DESCRIPTION = 'Plateforme de recrutement inclusive';
export const APP_VERSION = '1.0.0';

// ============================================
// API CONFIG
// ============================================

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const API_TIMEOUT = 30000; // 30 seconds

// ============================================
// PAGINATION
// ============================================

export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_OPTIONS = [12, 24, 48, 96];

// ============================================
// CONTRACT TYPES
// ============================================

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  CDI: 'CDI - Contrat à Durée Indéterminée',
  CDD: 'CDD - Contrat à Durée Déterminée',
  Interim: 'Intérim',
  Stage: 'Stage',
  Alternance: 'Alternance',
  Freelance: 'Freelance',
};

// ============================================
// EXPERIENCE LEVELS
// ============================================

export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  junior: 'Junior (0-2 ans)',
  intermediate: 'Intermédiaire (2-5 ans)',
  senior: 'Senior (5-10 ans)',
  expert: 'Expert (10+ ans)',
};

// ============================================
// RESOURCE TYPES
// ============================================

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  guide: 'Guide pratique',
  article: 'Article',
  video: 'Vidéo',
  document: 'Document',
  formation: 'Formation',
};

// ============================================
// APPLICATION STATUS
// ============================================

export const APPLICATION_STATUS_LABELS = {
  pending: 'En attente',
  reviewing: 'En cours d\'examen',
  shortlisted: 'Présélectionné',
  interview: 'Entretien',
  accepted: 'Accepté',
  rejected: 'Refusé',
};

export const APPLICATION_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewing: 'bg-blue-100 text-blue-800',
  shortlisted: 'bg-purple-100 text-purple-800',
  interview: 'bg-indigo-100 text-indigo-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

// ============================================
// SKILLS
// ============================================

export const POPULAR_SKILLS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'PHP',
  'SQL',
  'MongoDB',
  'AWS',
  'Docker',
  'Git',
  'Agile',
  'Communication',
  'Gestion de projet',
  'Design UX/UI',
  'Marketing digital',
  'Comptabilité',
  'RH',
  'Vente',
];

// ============================================
// LANGUAGES
// ============================================

export const LANGUAGE_LEVELS = [
  { value: 'basic', label: 'Notions' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'fluent', label: 'Courant' },
  { value: 'native', label: 'Langue maternelle' },
];

// ============================================
// LOCATIONS (France)
// ============================================

export const FRENCH_REGIONS = [
  'Île-de-France',
  'Auvergne-Rhône-Alpes',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Hauts-de-France',
  'Provence-Alpes-Côte d\'Azur',
  'Grand Est',
  'Pays de la Loire',
  'Bretagne',
  'Normandie',
  'Bourgogne-Franche-Comté',
  'Centre-Val de Loire',
  'Corse',
];

export const MAJOR_CITIES = [
  'Paris',
  'Lyon',
  'Marseille',
  'Toulouse',
  'Nice',
  'Nantes',
  'Strasbourg',
  'Montpellier',
  'Bordeaux',
  'Lille',
  'Rennes',
  'Reims',
  'Le Havre',
  'Saint-Étienne',
  'Toulon',
];

// ============================================
// REMOTE WORK
// ============================================

export const REMOTE_OPTIONS = [
  { value: 'no', label: 'Sur site uniquement' },
  { value: 'hybrid', label: 'Hybride (télétravail partiel)' },
  { value: 'full', label: '100% télétravail' },
];

// ============================================
// COMPANY SIZES
// ============================================

export const COMPANY_SIZES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+',
];

// ============================================
// DISABILITIES TYPES
// ============================================

export const DISABILITY_TYPES = [
  'Motrice',
  'Visuelle',
  'Auditive',
  'Cognitive',
  'Psychique',
  'Maladie invalidante',
  'Autre',
];

// ============================================
// VALIDATION
// ============================================

export const PASSWORD_MIN_LENGTH = 8;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = {
  cv: ['.pdf', '.doc', '.docx'],
  image: ['.jpg', '.jpeg', '.png', '.webp'],
  document: ['.pdf', '.doc', '.docx', '.txt'],
};

// ============================================
// DATE FORMATS
// ============================================

export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// ============================================
// STORAGE KEYS
// ============================================

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',
} as const;

// ============================================
// ROUTES
// ============================================

export const ROUTES = {
  HOME: '/',
  
  // Auth
  LOGIN: '/auth/login',
  REGISTER_CANDIDATE: '/auth/register/candidate',
  REGISTER_RECRUITER: '/auth/register/recruiter',
  REGISTER_ORGANIZATION: '/auth/register/organization',
  FORGOT_PASSWORD: '/auth/forgot-password',
  
  // Candidate
  CANDIDATE_DASHBOARD: '/candidate/dashboard',
  CANDIDATE_PROFILE: '/candidate/profile',
  CANDIDATE_OFFERS: '/candidate/offers',
  CANDIDATE_OFFER_DETAIL: '/candidate/offers/:id',
  CANDIDATE_APPLICATIONS: '/candidate/applications',
  CANDIDATE_RESOURCES: '/candidate/resources',
  CANDIDATE_MESSAGES: '/candidate/messages',
  
  // Recruiter
  RECRUITER_DASHBOARD: '/recruiter/dashboard',
  RECRUITER_CREATE_OFFER: '/recruiter/create-offer',
  RECRUITER_OFFERS: '/recruiter/offers',
  RECRUITER_OFFER_DETAIL: '/recruiter/offers/:id',
  RECRUITER_CANDIDATES: '/recruiter/candidates',
  RECRUITER_MESSAGES: '/recruiter/messages',
  
  // Organization
  ORGANIZATION_DASHBOARD: '/organization/dashboard',
  ORGANIZATION_RESOURCES: '/organization/resources',
  ORGANIZATION_CREATE_RESOURCE: '/organization/resources/create',
  ORGANIZATION_RESOURCE_DETAIL: '/organization/resources/:id',
} as const;

// ============================================
// ERROR MESSAGES
// ============================================

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Ce champ est requis',
  INVALID_EMAIL: 'Adresse email invalide',
  PASSWORD_TOO_SHORT: `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères`,
  PASSWORDS_NOT_MATCH: 'Les mots de passe ne correspondent pas',
  INVALID_PHONE: 'Numéro de téléphone invalide',
  FILE_TOO_LARGE: 'Le fichier est trop volumineux',
  INVALID_FILE_TYPE: 'Type de fichier non autorisé',
  NETWORK_ERROR: 'Erreur de connexion. Veuillez réessayer.',
  UNKNOWN_ERROR: 'Une erreur est survenue. Veuillez réessayer.',
} as const;

// ============================================
// SUCCESS MESSAGES
// ============================================

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie',
  REGISTER_SUCCESS: 'Inscription réussie',
  PROFILE_UPDATED: 'Profil mis à jour',
  OFFER_CREATED: 'Offre créée avec succès',
  OFFER_UPDATED: 'Offre mise à jour',
  APPLICATION_SENT: 'Candidature envoyée',
  MESSAGE_SENT: 'Message envoyé',
  RESOURCE_CREATED: 'Ressource créée',
} as const;
