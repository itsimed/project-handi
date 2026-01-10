/**
 * useCompanies Hook - Récupération des entreprises avec compteur d'offres
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';
import { toastService } from '../services/toastService';

interface Company {
  id: number;
  name: string;
  sector?: string | null;
  offersCount?: number;
}

interface Offer {
  id: number;
  companyId: number;
}

interface UseCompaniesReturn {
  companies: Company[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour récupérer les entreprises avec leur nombre d'offres
 * Si l'API ne retourne pas le compteur, on le calcule côté frontend
 */
export const useCompanies = (offers?: Offer[]): UseCompaniesReturn => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Calcule le nombre d'offres par entreprise
   */
  const calculateOffersCount = useCallback(
    (companiesList: Company[]): Company[] => {
      if (!offers || offers.length === 0) {
        return companiesList;
      }

      return companiesList.map((company) => ({
        ...company,
        offersCount: offers.filter((offer) => offer.companyId === company.id).length,
      }));
    },
    [offers]
  );

  /**
   * Récupère les entreprises depuis l'API
   */
  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/companies');
      let companiesList = response.data;

      // Ajouter le compteur d'offres si les offres sont disponibles
      companiesList = calculateOffersCount(companiesList);

      // Trier par nombre d'offres décroissant
      companiesList.sort((a: Company, b: Company) => {
        const countA = a.offersCount || 0;
        const countB = b.offersCount || 0;
        return countB - countA;
      });

      // Limiter aux 8 premières entreprises pour l'affichage
      setCompanies(companiesList.slice(0, 8));
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Erreur lors de la récupération des entreprises';
      setError(errorMessage);
      toastService.error('Erreur lors du chargement des entreprises');
    } finally {
      setIsLoading(false);
    }
  }, [calculateOffersCount]);

  /**
   * Refetch manuel des entreprises
   */
  const refetch = useCallback(async () => {
    await fetchCompanies();
  }, [fetchCompanies]);

  // Chargement initial
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return {
    companies,
    isLoading,
    error,
    refetch,
  };
};

