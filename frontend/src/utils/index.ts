/**
 * Utilitaires - Project Handi
 * Fonctions helper réutilisables
 */

import {
  CONTRACT_LABELS,
  EXPERIENCE_LABELS,
  REMOTE_LABELS,
  DISABILITY_LABELS,
  STATUS_LABELS,
  ROLE_LABELS,
} from '../constants';

import type {
  ContractType,
  ExperienceLevel,
  RemotePolicy,
  DisabilityCategory,
  ApplicationStatus,
  UserRole,
} from '../types';

// ==================== FORMATAGE ====================

/**
 * Formate une date ISO en format lisible français
 * @example formatDate('2024-01-15') => '15 janvier 2024'
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

/**
 * Formate une date en format court
 * @example formatDateShort('2024-01-15') => '15/01/2024'
 */
export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR').format(date);
};

/**
 * Calcule le temps écoulé depuis une date
 * @example getTimeAgo('2024-01-15') => 'Il y a 2 jours'
 */
export const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    an: 31536000,
    mois: 2592000,
    semaine: 604800,
    jour: 86400,
    heure: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `Il y a ${interval} ${unit}${interval > 1 ? 's' : ''}`;
    }
  }

  return 'À l\'instant';
};

// ==================== LABELS ====================

export const getContractLabel = (contract: ContractType): string => {
  return CONTRACT_LABELS[contract] || contract;
};

export const getExperienceLabel = (experience: ExperienceLevel): string => {
  return EXPERIENCE_LABELS[experience] || experience;
};

export const getRemoteLabel = (remote: RemotePolicy): string => {
  return REMOTE_LABELS[remote] || remote;
};

export const getDisabilityLabel = (disability: DisabilityCategory): string => {
  return DISABILITY_LABELS[disability] || disability;
};

export const getStatusLabel = (status: ApplicationStatus): string => {
  return STATUS_LABELS[status] || status;
};

export const getRoleLabel = (role: UserRole): string => {
  return ROLE_LABELS[role] || role;
};

// ==================== VALIDATION ====================

/**
 * Valide une adresse email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide un mot de passe (min 6 caractères)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Valide un nom (2-50 caractères)
 */
export const isValidName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 50;
};

// ==================== STORAGE ====================

/**
 * Sauvegarde dans le localStorage de manière sécurisée
 */
export const setStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde dans le localStorage:', error);
  }
};

/**
 * Récupère depuis le localStorage
 */
export const getStorage = <T = any>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Erreur lors de la lecture du localStorage:', error);
    return null;
  }
};

/**
 * Supprime du localStorage
 */
export const removeStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Erreur lors de la suppression du localStorage:', error);
  }
};

/**
 * Vide complètement le localStorage
 */
export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Erreur lors du vidage du localStorage:', error);
  }
};

// ==================== HELPERS ====================

/**
 * Tronque un texte à une longueur maximale
 * @example truncate('Bonjour le monde', 10) => 'Bonjour...'
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Capitalise la première lettre d'une chaîne
 * @example capitalize('bonjour') => 'Bonjour'
 */
export const capitalize = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Génère un ID unique (simple)
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Attend un délai (utile pour les animations/tests)
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Combine des classes CSS conditionnellement
 * @example cn('btn', isActive && 'active', 'text-white') => 'btn active text-white'
 */
export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// ==================== URL ====================

/**
 * Construit une URL de requête avec des paramètres
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Extrait les paramètres d'une URL
 */
export const parseQueryString = (search: string): Record<string, string> => {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
};

// ==================== ACCESSIBILITÉ ====================

/**
 * Annonce un message aux lecteurs d'écran
 */
export const announceToScreenReader = (message: string): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only'; // Classe pour cacher visuellement
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Gère le focus pour l'accessibilité
 */
export const focusElement = (selector: string): void => {
  const element = document.querySelector<HTMLElement>(selector);
  if (element) {
    element.focus();
  }
};
