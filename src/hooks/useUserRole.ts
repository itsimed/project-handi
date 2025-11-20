/**
 * useUserRole Hook - Gestion du rôle utilisateur
 * Hook pour vérifier et gérer le rôle de l'utilisateur connecté
 */

import { useMemo } from 'react';
import type { UserRole } from '../types';

interface UseUserRoleOptions {
  userRole?: UserRole | null;
}

interface UseUserRoleReturn {
  role: UserRole | null;
  isCandidate: boolean;
  isRecruiter: boolean;
  isOrganization: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

export const useUserRole = (options: UseUserRoleOptions = {}): UseUserRoleReturn => {
  const { userRole = null } = options;

  const role = userRole;

  const isCandidate = useMemo(() => role === 'candidate', [role]);
  const isRecruiter = useMemo(() => role === 'recruiter', [role]);
  const isOrganization = useMemo(() => role === 'organization', [role]);

  const hasRole = (targetRole: UserRole): boolean => {
    return role === targetRole;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!role) return false;
    return roles.includes(role);
  };

  return {
    role,
    isCandidate,
    isRecruiter,
    isOrganization,
    hasRole,
    hasAnyRole,
  };
};
