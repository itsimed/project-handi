/**
 * SettingsPage - Page de paramètres utilisateur
 * Gestion du mot de passe, préférences et suppression de compte
 * Architecture: React 18 + TypeScript + Tailwind CSS
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { Navbar } from '../components/Navbar';
import { Breadcrumb } from '../components/Breadcrumb';
import { STORAGE_KEYS } from '../constants';
import type { User } from '../types';
import { AlertIcon, LockIcon } from '../components/icons';
import { toastService } from '../services/toastService';
import { useTheme } from '../contexts/ThemeContext';
import { ScrollToTopButton } from '../components/ScrollToTopButton';

export const SettingsPage = () => {
  // ==================== STATE ====================
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  
  // Modification du mot de passe
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Préférences de notification
  const [notifications, setNotifications] = useState({
    emailApplications: true,
    emailOffers: true,
    emailMessages: false,
  });
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  // Suppression de compte
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // ==================== EFFECTS ====================
  useEffect(() => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // ==================== HANDLERS ====================
  
  /** Gestion du changement de mot de passe */
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (passwordData.newPassword === passwordData.currentPassword) {
      setPasswordError('Le nouveau mot de passe doit être différent de l\'ancien.');
      return;
    }

    setIsChangingPassword(true);

    try {
      await apiClient.put(`/users/${user?.id}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordSuccess('Mot de passe modifié avec succès !');
      toastService.success('Mot de passe modifié avec succès !');
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Erreur lors de la modification du mot de passe.';
      setPasswordError(errorMsg);
      toastService.error(errorMsg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  /** Sauvegarde des préférences de notification */
  const handleSavePreferences = async () => {
    setIsSavingPreferences(true);

    try {
      // TODO: Implémenter l'API de sauvegarde des préférences plus tard
      // await apiClient.put(`/users/${user?.id}/preferences`, notifications);

      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 500));

      toastService.success('Préférences sauvegardées avec succès !');
    } catch (error: any) {
      toastService.error('Erreur lors de la sauvegarde des préférences.');
    } finally {
      setIsSavingPreferences(false);
    }
  };

  /** Suppression du compte */
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'SUPPRIMER') {
      toastService.warning('Veuillez taper "SUPPRIMER" pour confirmer.');
      return;
    }

    if (!user) return;

    setIsDeleting(true);

    try {
      // Appeler l'API pour supprimer le compte
      await apiClient.delete(`/users/${user.id}`);

      toastService.success('Compte supprimé avec succès. À bientôt !');
      
      // Déconnexion et redirection
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      
      setTimeout(() => navigate('/'), 1500);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Une erreur est survenue';
      toastService.error(`Erreur : ${errorMsg}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // ==================== RENDER ====================
  if (!user) return null;

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
      <Navbar variant="profile" />
      
      <div className="container mx-auto px-6 py-8">
        <Breadcrumb />

        <div className="max-w-3xl mx-auto mt-8">
          {/* En-tête */}
          <div className="mb-8">
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: colors.text }}
            >
              Paramètres
            </h1>
            <p style={{ color: colors.text, opacity: 0.6 }}>
              Gérez votre mot de passe, vos préférences et votre compte
            </p>
          </div>

          {/* Section 1: Modification du mot de passe */}
          <section 
            className="rounded-2xl p-6 border-2 mb-6"
            style={{ 
              backgroundColor: colors.bg,
              borderColor: colors.border
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <LockIcon size={24} style={{ color: colors.text }} />
              <h2 className="text-xl font-semibold" style={{ color: colors.text }}>Mot de passe</h2>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* Mot de passe actuel */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  Mot de passe actuel
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl placeholder-opacity-50"
                  style={{ 
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                  placeholder="Entrez votre mot de passe actuel"
                  required
                  autoComplete="current-password"
                />
              </div>

              {/* Nouveau mot de passe */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  Nouveau mot de passe
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl placeholder-opacity-50"
                  style={{ 
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                  placeholder="Minimum 6 caractères"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              {/* Confirmation du nouveau mot de passe */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl placeholder-opacity-50"
                  style={{ 
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                  placeholder="Retapez le nouveau mot de passe"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              {/* Messages d'erreur/succès */}
              {passwordError && (
                <div className="flex items-start gap-2 p-3 border rounded-xl" role="alert" aria-live="polite" style={{ borderColor: colors.border }}>
                  <AlertIcon size={20} className="flex-shrink-0 mt-0.5" style={{ color: colors.text }} />
                  <p className="text-sm" style={{ color: colors.text }}>{passwordError}</p>
                </div>
              )}

              {passwordSuccess && (
                <div className="flex items-start gap-2 p-3 border rounded-xl" role="status" aria-live="polite" style={{ borderColor: colors.border }}>
                  <span className="text-xl" style={{ color: colors.text }}>✓</span>
                  <p className="text-sm" style={{ color: colors.text }}>{passwordSuccess}</p>
                </div>
              )}

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full py-3 font-semibold rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: colors.text,
                  color: colors.bg
                }}
              >
                {isChangingPassword ? 'Modification en cours...' : 'Modifier le mot de passe'}
              </button>
            </form>
          </section>

          {/* Section 2: Préférences de notification */}
          <section className="rounded-2xl p-6 border-2 mb-6" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>Notifications</h2>
            <p className="text-sm mb-6" style={{ color: colors.text, opacity: 0.6 }}>
              Choisissez les notifications que vous souhaitez recevoir par email
            </p>

            <div className="space-y-4">
              {/* Notification: Candidatures */}
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="font-medium transition-colors" style={{ color: colors.text }}>
                    Candidatures et réponses
                  </p>
                  <p className="text-sm" style={{ color: colors.text, opacity: 0.6 }}>
                    Recevoir un email lors de nouvelles candidatures ou réponses
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailApplications}
                  onChange={(e) => setNotifications({ ...notifications, emailApplications: e.target.checked })}
                  className="w-5 h-5 rounded"
                  style={{ accentColor: colors.text }}
                />
              </label>

              {/* Notification: Nouvelles offres */}
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="font-medium transition-colors" style={{ color: colors.text }}>
                    Nouvelles offres
                  </p>
                  <p className="text-sm" style={{ color: colors.text, opacity: 0.6 }}>
                    Recevoir un email lors de la publication de nouvelles offres
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailOffers}
                  onChange={(e) => setNotifications({ ...notifications, emailOffers: e.target.checked })}
                  className="w-5 h-5 rounded"
                  style={{ accentColor: colors.text }}
                />
              </label>

              {/* Notification: Messages */}
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="font-medium transition-colors" style={{ color: colors.text }}>
                    Messages privés
                  </p>
                  <p className="text-sm" style={{ color: colors.text, opacity: 0.6 }}>
                    Recevoir un email lors de nouveaux messages (fonctionnalité à venir)
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailMessages}
                  onChange={(e) => setNotifications({ ...notifications, emailMessages: e.target.checked })}
                  className="w-5 h-5 rounded"
                  style={{ accentColor: colors.text }}
                />
              </label>
            </div>

            {/* Bouton de sauvegarde */}
            <button
              type="button"
              onClick={handleSavePreferences}
              disabled={isSavingPreferences}
              className="w-full mt-6 py-3 font-semibold rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.text, color: colors.bg }}
            >
              {isSavingPreferences ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
            </button>
          </section>

          {/* Section 3: Zone de danger - Suppression du compte */}
          <section className="rounded-2xl p-6 border-2 mb-6" style={{ backgroundColor: colors.bg, borderColor: '#dc2626' }}>
            <div className="flex items-center gap-3 mb-4">
              <AlertIcon size={24} style={{ color: '#dc2626' }} />
              <h2 className="text-xl font-semibold" style={{ color: '#dc2626' }}>Zone de danger</h2>
            </div>

            <p className="text-sm mb-4" style={{ color: colors.text }}>
              La suppression de votre compte est <strong>irréversible</strong>. Toutes vos données seront définitivement supprimées.
            </p>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-2 font-semibold rounded-xl transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: '#dc2626', color: '#FFFFFF' }}
            >
              Supprimer mon compte
            </button>
          </section>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="rounded-2xl p-6 max-w-md w-full border-2" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
            <div className="flex items-center gap-3 mb-4">
              <AlertIcon size={28} style={{ color: '#dc2626' }} />
              <h3 className="text-xl font-bold" style={{ color: '#dc2626' }}>Confirmer la suppression</h3>
            </div>

            <p className="mb-4" style={{ color: colors.text }}>
              Cette action est <strong>irréversible</strong>. Toutes vos données, candidatures et informations personnelles seront définitivement supprimées.
            </p>

            <p className="text-sm mb-4" style={{ color: colors.text, opacity: 0.6 }}>
              Pour confirmer, tapez <strong style={{ color: colors.text, opacity: 1 }}>SUPPRIMER</strong> ci-dessous :
            </p>

            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl mb-6 placeholder-opacity-50"
              style={{ 
                backgroundColor: colors.bg,
                borderColor: colors.border,
                color: colors.text
              }}
              placeholder="SUPPRIMER"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                className="flex-1 py-2 font-semibold rounded-xl transition-all duration-200 hover:scale-105 border-2"
                style={{ borderColor: colors.border, color: colors.text }}
                disabled={isDeleting}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmation !== 'SUPPRIMER'}
                className="flex-1 py-2 font-semibold rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#dc2626', color: '#FFFFFF' }}
              >
                {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
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
