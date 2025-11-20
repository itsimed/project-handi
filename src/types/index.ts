/**
 * Types et interfaces de la plateforme de recrutement inclusive
 * Centralise toutes les définitions TypeScript
 */

// ============================================
// ENUMS ET TYPES DE BASE
// ============================================

export type UserRole = 'candidate' | 'recruiter' | 'organization';

export type OfferStatus = 'draft' | 'published' | 'closed' | 'archived';

export type ApplicationStatus = 
  | 'pending' 
  | 'reviewing' 
  | 'shortlisted' 
  | 'interview' 
  | 'accepted' 
  | 'rejected';

export type ContractType = 
  | 'CDI' 
  | 'CDD' 
  | 'Interim' 
  | 'Stage' 
  | 'Alternance' 
  | 'Freelance';

export type ExperienceLevel = 
  | 'junior' 
  | 'intermediate' 
  | 'senior' 
  | 'expert';

export type ResourceType = 
  | 'guide' 
  | 'article' 
  | 'video' 
  | 'document' 
  | 'formation';

// ============================================
// USER & AUTH
// ============================================

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
}

// ============================================
// CANDIDATE
// ============================================

export interface Candidate extends User {
  role: 'candidate';
  profile?: CandidateProfile;
}

export interface CandidateProfile {
  userId: string;
  title?: string; // Titre professionnel
  bio?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  languages: Language[];
  cv?: string; // URL du CV
  portfolio?: string;
  linkedin?: string;
  github?: string;
  location: Location;
  availability: 'immediate' | 'one_month' | 'three_months' | 'not_available';
  desiredContractTypes: ContractType[];
  desiredSalary?: {
    min: number;
    max: number;
    currency: string;
  };
  disabilities?: Disability[];
  accommodations?: string; // Aménagements souhaités
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  skills: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
}

export interface Language {
  name: string;
  level: 'basic' | 'intermediate' | 'fluent' | 'native';
}

export interface Disability {
  type: string;
  description?: string;
  requiresAccommodation: boolean;
}

// ============================================
// RECRUITER
// ============================================

export interface Recruiter extends User {
  role: 'recruiter';
  company: Company;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  description: string;
  website?: string;
  industry: string;
  size: string; // "1-10", "11-50", "51-200", etc.
  location: Location;
  inclusivePolicies?: string[];
}

// ============================================
// ORGANIZATION
// ============================================

export interface Organization extends User {
  role: 'organization';
  organizationData: OrganizationData;
}

export interface OrganizationData {
  id: string;
  name: string;
  logo?: string;
  description: string;
  website?: string;
  type: 'association' | 'government' | 'ngo' | 'foundation';
  mission: string;
  location: Location;
}

// ============================================
// JOB OFFERS
// ============================================

export interface Offer {
  id: string;
  recruiterId: string;
  company: Company;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  contractType: ContractType;
  experienceLevel: ExperienceLevel;
  location: Location;
  remote: 'no' | 'hybrid' | 'full';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  benefits: string[];
  status: OfferStatus;
  isInclusive: boolean; // Poste adapté personnes en situation de handicap
  accommodationsAvailable?: string[];
  publicationDate: Date;
  expirationDate?: Date;
  applicationsCount: number;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OfferFilters {
  search?: string;
  contractTypes?: ContractType[];
  experienceLevel?: ExperienceLevel[];
  location?: string;
  remote?: ('no' | 'hybrid' | 'full')[];
  isInclusive?: boolean;
  skills?: string[];
  salaryMin?: number;
  salaryMax?: number;
}

// ============================================
// APPLICATIONS
// ============================================

export interface Application {
  id: string;
  offerId: string;
  candidateId: string;
  candidate: Candidate;
  offer: Offer;
  status: ApplicationStatus;
  coverLetter: string;
  cv: string; // URL
  appliedAt: Date;
  updatedAt: Date;
  notes?: ApplicationNote[];
}

export interface ApplicationNote {
  id: string;
  applicationId: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

// ============================================
// MESSAGING
// ============================================

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  sentAt: Date;
  attachments?: Attachment[];
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
}

// ============================================
// RESOURCES
// ============================================

export interface Resource {
  id: string;
  organizationId: string;
  organization: OrganizationData;
  title: string;
  description: string;
  content: string;
  type: ResourceType;
  category: string;
  tags: string[];
  thumbnail?: string;
  fileUrl?: string; // Pour documents PDF, etc.
  videoUrl?: string;
  duration?: number; // En minutes pour vidéos/formations
  downloadCount: number;
  viewsCount: number;
  publishedAt: Date;
  updatedAt: Date;
  isPublished: boolean;
}

// ============================================
// COMMON TYPES
// ============================================

export interface Location {
  city: string;
  region?: string;
  country: string;
  postalCode?: string;
  address?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'application' | 'message' | 'offer' | 'system';
  title: string;
  content: string;
  read: boolean;
  link?: string;
  createdAt: Date;
}

// ============================================
// FORM TYPES
// ============================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterCandidateFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface RegisterRecruiterFormData extends RegisterCandidateFormData {
  companyName: string;
  companyWebsite?: string;
}

export interface RegisterOrganizationFormData extends RegisterCandidateFormData {
  organizationName: string;
  organizationType: 'association' | 'government' | 'ngo' | 'foundation';
  organizationWebsite?: string;
}

export interface CreateOfferFormData {
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  contractType: ContractType;
  experienceLevel: ExperienceLevel;
  location: Location;
  remote: 'no' | 'hybrid' | 'full';
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  skills: string[];
  benefits: string[];
  isInclusive: boolean;
  accommodationsAvailable?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
