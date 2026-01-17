/**
 * useApplications Hook - Gestion des candidatures
 * Hook accessible pour gérer la création et le suivi des candidatures
 * Conforme aux normes RGAA - Gestion des états pour l'accessibilité
 */

import { useState, useCallback } from 'react';
import apiClient from '../api/apiClient';

// Types importés localement (à synchroniser avec le backend)
export type ApplicationStatus = 'VIEWED' | 'NOT_VIEWED';

export interface Application {
  id: number;
  status: ApplicationStatus;
  createdAt: string;
  userId: number;
  offerId: number;
  companyId?: number | null;
  
  // Relations incluses
  user?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
  offer?: {
    id: number;
    title: string;
    location: string;
    contract: string;
  };
  company?: {
    id: number;
    name: string;
  } | null;
}

interface UseApplicationsReturn {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  fetchMyApplications: () => Promise<void>;
  applyToOffer: (offerId: number) => Promise<void>;
  clearMessages: () => void;
  hasApplied: (offerId: number) => boolean;
}

/**
 * Hook pour gérer les candidatures avec accessibilité RGAA
 * Gère les états loading, error et success pour les lecteurs d'écran
 * 
 * @example
 * const { applyToOffer, isLoading, error, successMessage } = useApplications();
 * 
 * // Dans le JSX :
 * {error && <div role="alert">{error}</div>}
 * {successMessage && <div role="alert">{successMessage}</div>}
 */
export const useApplications = (): UseApplicationsReturn => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Récupère les candidatures de l'utilisateur connecté
   * Endpoint: GET /api/v1/applications/me
   */
  const fetchMyApplications = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/applications/me');
      setApplications(response.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Erreur lors de la récupération de vos candidatures';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Postule à une offre d'emploi
   * Endpoint: POST /api/v1/applications
   * @param offerId - ID de l'offre à laquelle postuler
   * @throws Error si la candidature échoue
   */
  const applyToOffer = async (offerId: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await apiClient.post('/applications', { offerId });

      setSuccessMessage(
        response.data.message || 'Candidature envoyée avec succès !'
      );

      // Rafraîchir la liste des candidatures
      await fetchMyApplications();
    } catch (err: any) {
      let errorMessage = 'Erreur lors de la candidature';

      // Gestion des erreurs spécifiques (accessibilité++)
      if (err.response?.status === 400) {
        errorMessage =
          err.response.data.error || 'Vous avez déjà postulé à cette offre';
      } else if (err.response?.status === 401) {
        errorMessage = 'Vous devez être connecté pour postuler';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Efface les messages d'erreur et de succès
   * Utile pour nettoyer les alertes ARIA après lecture
   */
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  /**
   * Vérifie si l'utilisateur a déjà postulé à une offre
   * @param offerId - ID de l'offre à vérifier
   * @returns true si déjà postulé, false sinon
   */
  const hasApplied = useCallback(
    (offerId: number): boolean => {
      return applications.some((app) => app.offerId === offerId);
    },
    [applications]
  );

  return {
    applications,
    isLoading,
    error,
    successMessage,
    fetchMyApplications,
    applyToOffer,
    clearMessages,
    hasApplied,
  };
};

