/**
 * useAuth Hook - Gestion de l'authentification
 * Hook personnalisé pour gérer login, logout, register
 */

import { useState, useEffect } from 'react';
import type { User, AuthCredentials, RegisterData, UserRole } from '../types';
import { STORAGE_KEYS } from '../constants';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseAuthReturn extends AuthState {
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialisation - Vérifier si un utilisateur est déjà connecté
  useEffect(() => {
    const loadUser = () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (token && userData) {
          const user = JSON.parse(userData);
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    loadUser();
  }, []);

  // Login
  const login = async (credentials: AuthCredentials): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: Remplacer par un vrai appel API
      // Simulation d'une requête API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        role: 'candidate' as UserRole,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+33 6 12 34 56 78',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      // Sauvegarder dans le localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'mock-token-123');
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser));

      setState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur de connexion',
      }));
      throw error;
    }
  };

  // Register
  const register = async (data: RegisterData): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: Remplacer par un vrai appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'mock-token-123');
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(newUser));

      setState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur d\'inscription',
      }));
      throw error;
    }
  };

  // Logout
  const logout = (): void => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);

    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  // Update User
  const updateUser = (userData: Partial<User>): void => {
    if (!state.user) return;

    const updatedUser = { ...state.user, ...userData };
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));

    setState((prev) => ({
      ...prev,
      user: updatedUser,
    }));
  };

  return {
    ...state,
    login,
    register,
    logout,
    updateUser,
  };
};
