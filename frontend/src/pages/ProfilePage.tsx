/**
 * ProfilePage - Profil utilisateur
 * Affichage et modification des informations personnelles
 * Architecture: React 18 + TypeScript + Tailwind CSS
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { Navbar } from '../components/Navbar';
import { Breadcrumb } from '../components/Breadcrumb';
import { STORAGE_KEYS } from '../constants';
import type { User } from '../types';
import { AlertIcon } from '../components/icons';
import { toastService } from '../services/toastService';
import { useTheme } from '../contexts/ThemeContext';
import { ScrollToTopButton } from '../components/ScrollToTopButton';

export const ProfilePage = () => {
  // ==================== STATE ====================
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  // ==================== EFFECTS ====================
  useEffect(() => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        firstName: parsedUser.firstName || '',
        lastName: parsedUser.lastName || '',
        email: parsedUser.email || '',
      });
      
      // Récupérer le nom de l'entreprise si recruteur
      if (parsedUser.role === 'RECRUITER' && parsedUser.company?.name) {
        setCompanyName(parsedUser.company.name);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // ==================== HANDLERS ====================
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const response = await apiClient.put(`/users/${user?.id}/profile`, formData);
      
      // Mettre à jour le localStorage avec les nouvelles données
      const updatedUser = { ...user, ...response.data.user };
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
      setUser(updatedUser as User);
      
      setIsEditing(false);
      toastService.success('Profil mis à jour avec succès !');
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Erreur lors de la sauvegarde';
      toastService.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Réinitialiser avec les données originales
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    
    try {
      // Appeler l'API pour supprimer le compte
      await apiClient.delete(`/users/${user.id}`);

      toastService.success('Compte supprimé avec succès.');
      
      // Déconnexion et redirection
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      
      setTimeout(() => navigate('/'), 1500);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Une erreur est survenue';
      toastService.error(`Erreur : ${errorMsg}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // ==================== RENDER ====================
  if (!user) return null;

  const getRoleBadge = (role: string) => {
    const badges = {
      APPLICANT: { label: 'Candidat·e', color: 'from-blue-500 to-cyan-500', icon: '👤' },
      RECRUITER: { label: 'Recruteur·euse', color: 'from-purple-500 to-pink-500', icon: '💼' },
      ADMIN: { label: 'Administrateur', color: 'from-red-500 to-orange-500', icon: '⚡' },
    };
    return badges[role as keyof typeof badges] || badges.APPLICANT;
  };

  const badge = getRoleBadge(user.role);

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: colors.bg,
        color: colors.text,
        backgroundImage: `radial-gradient(circle at 2px 2px, ${colors.text} 1px, transparent 0)`,
        backgroundSize: '48px 48px',
        backgroundPosition: '0 0',
        opacity: 1
      }}
    >
      <div 
        className="min-h-screen"
        style={{ backgroundColor: colors.bg, opacity: 0.95 }}
      >
      {/* ==================== HEADER ==================== */}
      <Navbar variant="profile" />
      
      {/* Fil d'Ariane */}
      <Breadcrumb />

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Profile Header */}
        <div className="relative mb-8">
          {/* Background gradient */}
          <div className="absolute inset-0 rounded-3xl blur-3xl" style={{ background: `radial-gradient(circle, ${colors.text}10, transparent)` }} />
          
          <div 
            className="relative border-2 rounded-2xl p-8"
            style={{ 
              backgroundColor: colors.bg,
              borderColor: colors.border
            }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className={`w-24 h-24 bg-gradient-to-br ${badge.color} rounded-2xl flex items-center justify-center text-4xl shadow-lg`}>
                  {badge.icon}
                </div>
                <div 
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 rounded-full"
                  style={{ borderColor: colors.bg }}
                />
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold" style={{ color: colors.text }}>
                    {user.firstName} {user.lastName}
                  </h2>
                  <span className={`px-3 py-1 rounded-xl text-sm font-semibold bg-gradient-to-r ${badge.color} text-white`}>
                    {badge.label}
                  </span>
                </div>
                <p className="text-lg mb-3" style={{ color: colors.text, opacity: 0.6 }}>{user.email}</p>
                <div className="flex items-center gap-2 text-sm" style={{ color: colors.text, opacity: 0.5 }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>Membre depuis {new Date(user.createdAt || Date.now()).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 border-2 rounded-xl transition-all duration-200 hover:scale-105 font-semibold focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: colors.bg,
                    color: colors.text,
                    borderColor: colors.border
                  }}
                >
                  Modifier mon profil
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div 
          className="border-2 rounded-2xl p-8"
          style={{ 
            backgroundColor: colors.bg,
            borderColor: colors.border
          }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ color: colors.text }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Informations personnelles
          </h3>

          <div className="space-y-6">
            {/* Prénom */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                Prénom
              </label>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none"
                style={{ 
                  backgroundColor: isEditing ? colors.bg : `${colors.bg}80`,
                  color: colors.text,
                  borderColor: isEditing ? colors.border : `${colors.border}50`,
                  cursor: isEditing ? 'text' : 'not-allowed',
                  opacity: isEditing ? 1 : 0.7
                }}
              />
            </div>

            {/* Nom */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                Nom
              </label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none"
                style={{ 
                  backgroundColor: isEditing ? colors.bg : `${colors.bg}80`,
                  color: colors.text,
                  borderColor: isEditing ? colors.border : `${colors.border}50`,
                  cursor: isEditing ? 'text' : 'not-allowed',
                  opacity: isEditing ? 1 : 0.7
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none"
                style={{ 
                  backgroundColor: isEditing ? colors.bg : `${colors.bg}80`,
                  color: colors.text,
                  borderColor: isEditing ? colors.border : `${colors.border}50`,
                  cursor: isEditing ? 'text' : 'not-allowed',
                  opacity: isEditing ? 1 : 0.7
                }}
              />
            </div>

            {/* Entreprise (pour recruteurs uniquement) */}
            {user.role === 'RECRUITER' && companyName && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  Entreprise
                </label>
                <div 
                  className="w-full px-4 py-3 rounded-xl border-2 cursor-not-allowed flex items-center gap-2"
                  style={{ 
                    backgroundColor: `${colors.bg}80`,
                    borderColor: `${colors.border}50`,
                    color: colors.text,
                    opacity: 0.7
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#a855f7' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {companyName}
                </div>
                <p className="mt-2 text-xs" style={{ color: colors.text, opacity: 0.5 }}>
                  L'entreprise associée à votre compte.
                </p>
              </div>
            )}

            {/* Rôle (read-only) */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                Type de compte
              </label>
              <div 
                className="w-full px-4 py-3 rounded-xl border-2 cursor-not-allowed"
                style={{ 
                  backgroundColor: `${colors.bg}80`,
                  borderColor: `${colors.border}50`,
                  color: colors.text,
                  opacity: 0.7
                }}
              >
                {badge.label}
              </div>
              <p className="mt-2 text-xs" style={{ color: colors.text, opacity: 0.5 }}>
                Le type de compte ne peut pas être modifié.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-4">
              {isEditing && (
                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 px-6 py-3 font-semibold rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: colors.text,
                      color: colors.bg
                    }}
                  >
                    {isSaving ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Enregistrement...
                      </span>
                    ) : (
                      'Enregistrer les modifications'
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-6 py-3 font-semibold rounded-xl border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: colors.bg,
                      color: colors.text,
                      borderColor: colors.border
                    }}
                  >
                    Annuler
                  </button>
                </div>
              )}
              
              {/* Bouton Déconnexion - toujours visible */}
              <button
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
                  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
                  navigate('/');
                }}
                className="w-full px-6 py-3 border-2 font-semibold rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: '#ef444410',
                  color: '#ef4444',
                  borderColor: '#ef444450'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef444410';
                  e.currentTarget.style.color = '#ef4444';
                  e.currentTarget.style.borderColor = '#ef444450';
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div 
          className="mt-8 p-6 border-2 rounded-xl"
          style={{ 
            backgroundColor: `${colors.bg}50`,
            borderColor: `${colors.border}50`
          }}
        >
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: colors.text }}>
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm leading-relaxed" style={{ color: colors.text, opacity: 0.6 }}>
                Vos informations personnelles sont sécurisées et ne seront jamais partagées
                sans votre consentement. Elles sont utilisées uniquement pour améliorer
                votre expérience sur la plateforme.
              </p>
            </div>
          </div>
        </div>
        {/* Delete Account Section */}
        <div 
          className="mt-8 p-6 border-2 rounded-xl"
          style={{ 
            backgroundColor: '#ef444405',
            borderColor: '#ef444420'
          }}
        >
          <div className="flex items-start gap-4">
            <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#ef4444' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <h4 className="text-lg font-semibold mb-2" style={{ color: '#ef4444' }}>Zone dangereuse</h4>
              <p className="text-sm mb-4" style={{ color: colors.text, opacity: 0.6 }}>
                La suppression de votre compte est définitive et irréversible. Toutes vos données seront supprimées de manière permanente.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-6 py-3 border-2 rounded-xl transition-all duration-200 hover:scale-105 font-semibold focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: '#ef444410',
                  color: '#ef4444',
                  borderColor: '#ef444430'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef444410';
                  e.currentTarget.style.color = '#ef4444';
                  e.currentTarget.style.borderColor = '#ef444430';
                }}
              >
                Supprimer mon compte définitivement
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ==================== DELETE CONFIRMATION MODAL ==================== */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div 
            className="border-2 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            style={{ 
              backgroundColor: colors.bg,
              borderColor: '#ef444430',
              boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.2)'
            }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ef444420' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#ef4444' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold" style={{ color: '#ef4444' }}>Confirmer la suppression</h3>
            </div>
            
            <div className="mb-6">
              <p className="mb-4" style={{ color: colors.text }}>
                Êtes-vous absolument sûr(e) de vouloir supprimer votre compte ?
              </p>
              <div 
                className="border-2 rounded-xl p-4"
                style={{ 
                  backgroundColor: '#ef444410',
                  borderColor: '#ef444430'
                }}
              >
                <p className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#fca5a5' }}>
                  <AlertIcon size={16} aria-label="Attention" />
                  Cette action :
                </p>
                <ul className="text-sm space-y-1 ml-4" style={{ color: colors.text, opacity: 0.6 }}>
                  <li>• Supprimera toutes vos données personnelles</li>
                  <li>• Supprimera toutes vos candidatures</li>
                  {user?.role === 'RECRUITER' && <li>• Supprimera toutes vos offres d'emploi</li>}
                  <li>• Est <span className="font-bold" style={{ color: '#ef4444' }}>IRRÉVERSIBLE</span></li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 font-semibold rounded-xl border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: colors.bg,
                  color: colors.text,
                  borderColor: colors.border
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 font-semibold rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: '#ef4444',
                  color: '#FFFFFF'
                }}
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Suppression...
                  </span>
                ) : (
                  'Supprimer définitivement'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <ScrollToTopButton />
      </div>
    </div>
  );
};
