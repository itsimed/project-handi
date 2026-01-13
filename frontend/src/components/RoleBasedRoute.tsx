/**
 * RoleBasedRoute - Redirige vers le bon dashboard selon le rôle de l'utilisateur
 * RECRUITER → /recruteur/dashboard
 * APPLICANT → /dashboard
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORAGE_KEYS } from '../constants';
import type { User } from '../types';

interface RoleBasedRouteProps {
  children: React.ReactNode;
}

export const RoleBasedRoute = ({ children }: RoleBasedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    
    // Si pas d'utilisateur connecté, permettre l'accès (ne pas rediriger)
    if (!userData) {
      return;
    }

    try {
      const user: User = JSON.parse(userData);
      
      // Rediriger les recruteurs vers leur dashboard spécifique
      if (user.role === 'RECRUITER' && window.location.pathname === '/dashboard') {
        navigate('/recruteur/dashboard');
      }
      
      // Rediriger les candidats qui tentent d'accéder au dashboard recruteur
      if (user.role === 'APPLICANT' && window.location.pathname === '/recruteur/dashboard') {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erreur de parsing user data:', error);
      // Ne pas rediriger en cas d'erreur, permettre l'accès
    }
  }, [navigate]);

  return <>{children}</>;
};
