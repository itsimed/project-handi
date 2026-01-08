/**
 * Services API - Project Handi
 * Centralisation de tous les appels API
 */

import apiClient from '../api/apiClient';
import type {
  LoginDTO,
  RegisterDTO,
  LoginResponse,
  CreateOfferDTO,
  ApplyToOfferDTO,
  UpdateApplicationStatusDTO,
  Offer,
  Application,
  Company,
  User,
  OfferFilters,
} from '../types';

// ==================== AUTHENTIFICATION ====================

export const authService = {
  /**
   * Connexion utilisateur
   */
  login: async (credentials: LoginDTO): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Inscription utilisateur
   */
  register: async (userData: RegisterDTO): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Déconnexion (côté client uniquement - suppression du token)
   */
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  },
};

// ==================== OFFRES ====================

export const offerService = {
  /**
   * Récupère toutes les offres avec filtres optionnels
   */
  getOffers: async (filters?: OfferFilters): Promise<Offer[]> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }

    const queryString = params.toString();
    const url = queryString ? `/offers?${queryString}` : '/offers';
    
    const response = await apiClient.get(url);
    return response.data;
  },

  /**
   * Récupère une offre par ID
   */
  getOfferById: async (id: number): Promise<Offer> => {
    const response = await apiClient.get(`/offers/${id}`);
    return response.data;
  },

  /**
   * Crée une nouvelle offre (recruteur uniquement)
   */
  createOffer: async (offerData: CreateOfferDTO): Promise<Offer> => {
    const response = await apiClient.post('/offers', offerData);
    return response.data;
  },
};

// ==================== CANDIDATURES ====================

export const applicationService = {
  /**
   * Récupère les candidatures de l'utilisateur connecté
   */
  getMyApplications: async (): Promise<Application[]> => {
    const response = await apiClient.get('/applications/me');
    return response.data;
  },

  /**
   * Récupère une candidature par ID
   */
  getApplicationById: async (id: number): Promise<Application> => {
    const response = await apiClient.get(`/applications/${id}`);
    return response.data;
  },

  /**
   * Postule à une offre
   */
  applyToOffer: async (applicationData: ApplyToOfferDTO): Promise<Application> => {
    const response = await apiClient.post('/applications', applicationData);
    return response.data;
  },

  /**
   * Met à jour le statut d'une candidature (recruteur uniquement)
   */
  updateApplicationStatus: async (
    id: number,
    statusData: UpdateApplicationStatusDTO
  ): Promise<Application> => {
    const response = await apiClient.patch(`/applications/${id}/status`, statusData);
    return response.data;
  },

  /**
   * Récupère les candidatures reçues (recruteur uniquement)
   */
  getReceivedApplications: async (): Promise<Application[]> => {
    const response = await apiClient.get('/applications/recruiter');
    return response.data;
  },
};

// ==================== ENTREPRISES ====================

export const companyService = {
  /**
   * Récupère toutes les entreprises
   */
  getCompanies: async (): Promise<Company[]> => {
    const response = await apiClient.get('/companies');
    return response.data;
  },

  /**
   * Récupère une entreprise par ID
   */
  getCompanyById: async (id: number): Promise<Company> => {
    const response = await apiClient.get(`/companies/${id}`);
    return response.data;
  },
};

// ==================== UTILISATEURS ====================

export const userService = {
  /**
   * Récupère le profil de l'utilisateur connecté
   */
  getMyProfile: async (): Promise<User> => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  /**
   * Met à jour le profil de l'utilisateur connecté
   */
  updateMyProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await apiClient.patch('/users/me', userData);
    return response.data;
  },
};
