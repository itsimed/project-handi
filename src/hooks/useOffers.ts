/**
 * useOffers Hook - Gestion des offres d'emploi
 * Hook pour lister, filtrer, créer, modifier les offres
 */

import { useState, useEffect } from 'react';
import type { Offer, OfferFilters, PaginatedResponse } from '../types';
import { DEFAULT_PAGE_SIZE } from '../constants';

interface UseOffersOptions {
  filters?: OfferFilters;
  page?: number;
  pageSize?: number;
  autoFetch?: boolean;
}

interface UseOffersReturn {
  offers: Offer[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  fetchOffers: () => Promise<void>;
  createOffer: (offer: Partial<Offer>) => Promise<Offer>;
  updateOffer: (id: string, data: Partial<Offer>) => Promise<Offer>;
  deleteOffer: (id: string) => Promise<void>;
  setFilters: (filters: OfferFilters) => void;
  setPage: (page: number) => void;
}

export const useOffers = (options: UseOffersOptions = {}): UseOffersReturn => {
  const {
    filters: initialFilters = {},
    page: initialPage = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    autoFetch = true,
  } = options;

  const [offers, setOffers] = useState<Offer[]>([]);
  const [filters, setFilters] = useState<OfferFilters>(initialFilters);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch offers
  const fetchOffers = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Remplacer par un vrai appel API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data
      const mockOffers: Offer[] = [
        {
          id: '1',
          recruiterId: 'rec1',
          company: {
            id: 'comp1',
            name: 'TechCorp',
            description: 'Entreprise tech innovante',
            industry: 'Technologie',
            size: '51-200',
            location: { city: 'Paris', country: 'France' },
          },
          title: 'Développeur Full Stack',
          description: 'Nous recherchons un développeur passionné...',
          requirements: ['React', 'Node.js', '3 ans d\'expérience'],
          responsibilities: ['Développer de nouvelles fonctionnalités', 'Code review'],
          contractType: 'CDI',
          experienceLevel: 'intermediate',
          location: { city: 'Paris', region: 'Île-de-France', country: 'France' },
          remote: 'hybrid',
          salary: { min: 40000, max: 55000, currency: 'EUR' },
          skills: ['React', 'TypeScript', 'Node.js'],
          benefits: ['Télétravail', 'Tickets restaurant', 'Mutuelle'],
          status: 'published',
          isInclusive: true,
          accommodationsAvailable: ['Poste adapté', 'Horaires flexibles'],
          publicationDate: new Date('2025-11-01'),
          applicationsCount: 12,
          viewsCount: 245,
          createdAt: new Date('2025-11-01'),
          updatedAt: new Date('2025-11-15'),
        },
      ];

      // Simuler la pagination
      const response: PaginatedResponse<Offer> = {
        data: mockOffers,
        total: mockOffers.length,
        page,
        pageSize,
        totalPages: Math.ceil(mockOffers.length / pageSize),
      };

      setOffers(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des offres');
    } finally {
      setIsLoading(false);
    }
  };

  // Create offer
  const createOffer = async (offerData: Partial<Offer>): Promise<Offer> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Remplacer par un vrai appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newOffer: Offer = {
        id: Date.now().toString(),
        ...offerData,
      } as Offer;

      setOffers((prev) => [newOffer, ...prev]);
      return newOffer;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création de l\'offre';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update offer
  const updateOffer = async (id: string, data: Partial<Offer>): Promise<Offer> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Remplacer par un vrai appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedOffer = offers.find((o) => o.id === id);
      if (!updatedOffer) throw new Error('Offre non trouvée');

      const newOffer = { ...updatedOffer, ...data };
      setOffers((prev) => prev.map((o) => (o.id === id ? newOffer : o)));

      return newOffer;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete offer
  const deleteOffer = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Remplacer par un vrai appel API
      await new Promise((resolve) => setTimeout(resolve, 500));

      setOffers((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch on mount and when filters/page change
  useEffect(() => {
    if (autoFetch) {
      fetchOffers();
    }
  }, [filters, page]);

  return {
    offers,
    total,
    page,
    pageSize,
    totalPages,
    isLoading,
    error,
    fetchOffers,
    createOffer,
    updateOffer,
    deleteOffer,
    setFilters,
    setPage,
  };
};
