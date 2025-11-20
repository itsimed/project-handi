/**
 * useFilters Hook - Gestion des filtres de recherche
 * Hook réutilisable pour gérer les états de filtres
 */

import { useState, useCallback } from 'react';

export interface UseFiltersReturn<T> {
  filters: T;
  setFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  setFilters: (newFilters: Partial<T>) => void;
  resetFilters: () => void;
  clearFilter: <K extends keyof T>(key: K) => void;
}

export const useFilters = <T extends Record<string, any>>(
  initialFilters: T
): UseFiltersReturn<T> => {
  const [filters, setFiltersState] = useState<T>(initialFilters);

  // Définir un filtre unique
  const setFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFiltersState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Définir plusieurs filtres à la fois
  const setFilters = useCallback((newFilters: Partial<T>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // Réinitialiser tous les filtres
  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters);
  }, [initialFilters]);

  // Effacer un filtre spécifique
  const clearFilter = useCallback(<K extends keyof T>(key: K) => {
    setFiltersState((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  return {
    filters,
    setFilter,
    setFilters,
    resetFilters,
    clearFilter,
  };
};
