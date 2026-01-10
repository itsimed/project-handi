/**
 * useOfferFilters Hook - Gestion des filtres et recherche d'offres
 * Avec debounce et construction dynamique des query params
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../api/apiClient';
import { toastService } from '../services/toastService';

interface OfferFilters {
  contractTypes?: string[];
  experienceLevels?: string[];
  remote?: string[];
  disabilityCompatible?: string[];
  searchWhat?: string;
  searchWhere?: string;
}

interface Offer {
  id: number;
  title: string;
  location: string;
  contract: string;
  createdAt: string;
  company: {
    id: number;
    name: string;
  };
}

interface UseOfferFiltersReturn {
  offers: Offer[];
  isLoading: boolean;
  error: string | null;
  applyFilters: (filters: OfferFilters) => void;
  clearFilters: () => void;
  activeFiltersCount: number;
  currentFilters: OfferFilters;
}

/**
 * Hook pour gérer la recherche et le filtrage des offres avec debounce
 * @param initialFilters - Filtres initiaux optionnels
 * @param debounceMs - Délai de debounce en millisecondes (défaut: 500ms)
 */
export const useOfferFilters = (
  initialFilters: OfferFilters = {},
  debounceMs: number = 500
): UseOfferFiltersReturn => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<OfferFilters>(initialFilters);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  /**
   * Construit les query params pour l'API à partir des filtres
   */
  const buildQueryParams = (filters: OfferFilters): string => {
    const params = new URLSearchParams();

    // Recherche textuelle
    if (filters.searchWhat && filters.searchWhat.trim()) {
      params.append('title', filters.searchWhat.trim());
    }
    if (filters.searchWhere && filters.searchWhere.trim()) {
      params.append('location', filters.searchWhere.trim());
    }

    // Filtres multiples
    if (filters.contractTypes && filters.contractTypes.length > 0) {
      filters.contractTypes.forEach((type) => {
        params.append('contract', type);
      });
    }
    if (filters.experienceLevels && filters.experienceLevels.length > 0) {
      filters.experienceLevels.forEach((level) => {
        params.append('experience', level);
      });
    }
    if (filters.remote && filters.remote.length > 0) {
      filters.remote.forEach((policy) => {
        params.append('remote', policy);
      });
    }
    if (filters.disabilityCompatible && filters.disabilityCompatible.length > 0) {
      filters.disabilityCompatible.forEach((disability) => {
        params.append('disability', disability);
      });
    }

    return params.toString();
  };

  /**
   * Récupère les offres depuis l'API avec les filtres appliqués
   */
  const fetchOffers = useCallback(async (filters: OfferFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const queryString = buildQueryParams(filters);
      const endpoint = queryString ? `/offers?${queryString}` : '/offers';
      const response = await apiClient.get(endpoint);
      setOffers(response.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Erreur lors de la récupération des offres';
      setError(errorMessage);
      toastService.error('Erreur lors du chargement des offres');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Applique les filtres avec debounce
   */
  const applyFilters = useCallback(
    (filters: OfferFilters) => {
      setCurrentFilters(filters);

      // Clear le timer précédent
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Applique le debounce uniquement pour la recherche textuelle
      const hasTextSearch = filters.searchWhat || filters.searchWhere;
      const delay = hasTextSearch ? debounceMs : 0;

      debounceTimer.current = setTimeout(() => {
        fetchOffers(filters);
      }, delay);
    },
    [fetchOffers, debounceMs]
  );

  /**
   * Réinitialise tous les filtres
   */
  const clearFilters = useCallback(() => {
    const emptyFilters: OfferFilters = {
      contractTypes: [],
      experienceLevels: [],
      remote: [],
      disabilityCompatible: [],
      searchWhat: '',
      searchWhere: '',
    };
    setCurrentFilters(emptyFilters);
    fetchOffers(emptyFilters);
  }, [fetchOffers]);

  /**
   * Calcule le nombre de filtres actifs (hors recherche textuelle)
   */
  const activeFiltersCount = 
    (currentFilters.contractTypes?.length || 0) +
    (currentFilters.experienceLevels?.length || 0) +
    (currentFilters.remote?.length || 0) +
    (currentFilters.disabilityCompatible?.length || 0);

  // Chargement initial des offres
  useEffect(() => {
    fetchOffers(initialFilters);
    
    // Cleanup du timer au démontage
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    offers,
    isLoading,
    error,
    applyFilters,
    clearFilters,
    activeFiltersCount,
    currentFilters,
  };
};

