/**
 * Types partagés - Project Handi
 * Synchronisés avec le backend Prisma Schema
 */

// ==================== ENUMS ====================

export type UserRole = 'APPLICANT' | 'RECRUITER' | 'ADMIN';

export type ContractType = 'CDI' | 'CDD' | 'INTERIM' | 'STAGE' | 'ALTERNANCE';

export type ExperienceLevel = 'JUNIOR' | 'CONFIRME' | 'SENIOR';

export type RemotePolicy = 'NO_REMOTE' | 'HYBRID' | 'FULL_REMOTE';

export type DisabilityCategory = 
  | 'MOTEUR' 
  | 'VISUEL' 
  | 'AUDITIF' 
  | 'PSYCHIQUE' 
  | 'COGNITIF' 
  | 'INVISIBLE';

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

// ==================== ENTITIES ====================

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  companyId?: number | null;
  company?: Company | null; // Relation optionnelle pour les recruteurs
}

export interface Company {
  id: number;
  name: string;
  sector?: string | null;
}

export interface Offer {
  id: number;
  title: string;
  description: string;
  location: string;
  contract: ContractType;
  experience: ExperienceLevel;
  remote: RemotePolicy;
  disabilityCompatible: DisabilityCategory[];
  createdAt: string;
  recruiterId: number;
  companyId: number;
  
  // Relations (optionnelles selon le contexte)
  recruiter?: User;
  company?: Company;
  applications?: Application[];
  adaptations?: Adaptation[];
  skills?: Skill[];
}

export interface Adaptation {
  id: number;
  label: string;
  category: DisabilityCategory;
}

export interface Skill {
  id: number;
  name: string;
}

export interface Application {
  id: number;
  status: ApplicationStatus;
  createdAt: string;
  cvUrl?: string | null;
  coverLetterUrl?: string | null;
  additionalDocs: string[];
  userId: number;
  offerId: number;
  companyId?: number | null;
  
  // Relations (optionnelles)
  user?: User;
  offer?: Offer;
  company?: Company | null;
}

// ==================== DTOs / REQUEST BODIES ====================

export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  companyId?: number;
  companyName?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreateOfferDTO {
  title: string;
  description: string;
  location: string;
  contract: ContractType;
  experience: ExperienceLevel;
  remote: RemotePolicy;
  disabilityCompatible: DisabilityCategory[];
  companyId: number;
}

export interface ApplyToOfferDTO {
  offerId: number;
  cvUrl?: string;
  coverLetterUrl?: string;
  additionalDocs?: string[];
}

export interface UpdateApplicationStatusDTO {
  status: ApplicationStatus;
}

// ==================== FILTERS ====================

export interface OfferFilters {
  search?: string;
  contract?: ContractType;
  experience?: ExperienceLevel;
  remote?: RemotePolicy;
  disability?: DisabilityCategory;
  location?: string;
}

// ==================== API RESPONSES ====================

export interface ApiError {
  error: string;
  details?: any;
}

export interface ApiSuccess<T = any> {
  message: string;
  data?: T;
}

// ==================== PAGINATION ====================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
