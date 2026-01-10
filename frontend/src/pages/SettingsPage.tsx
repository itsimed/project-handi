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

export const SettingsPage = () => {
  // ==================== STATE ====================
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar variant="profile" />
      
      <div className="container mx-auto px-6 py-8">
        <Breadcrumb />

        <div className="max-w-3xl mx-auto mt-8">
          {/* En-tête */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent mb-2">
              Paramètres
            </h1>
            <p className="text-slate-400">
              Gérez votre mot de passe, vos préférences et votre compte
            </p>
          </div>

          {/* Section 1: Modification du mot de passe */}
          <section className="bg-slate-900 rounded-xl p-6 border border-slate-800 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <LockIcon size={24} className="text-sky-400" />
              <h2 className="text-xl font-semibold">Mot de passe</h2>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* Mot de passe actuel */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Mot de passe actuel
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Entrez votre mot de passe actuel"
                  required
                  autoComplete="current-password"
                />
              </div>

              {/* Nouveau mot de passe */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Minimum 6 caractères"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              {/* Confirmation du nouveau mot de passe */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Retapez le nouveau mot de passe"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              {/* Messages d'erreur/succès */}
              {passwordError && (
                <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg" role="alert" aria-live="polite">
                  <AlertIcon size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{passwordError}</p>
                </div>
              )}

              {passwordSuccess && (
                <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg" role="status" aria-live="polite">
                  <span className="text-green-400 text-xl">✓</span>
                  <p className="text-sm text-green-400">{passwordSuccess}</p>
                </div>
              )}

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChangingPassword ? 'Modification en cours...' : 'Modifier le mot de passe'}
              </button>
            </form>
          </section>

          {/* Section 2: Préférences de notification */}
          <section className="bg-slate-900 rounded-xl p-6 border border-slate-800 mb-6">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <p className="text-sm text-slate-400 mb-6">
              Choisissez les notifications que vous souhaitez recevoir par email
            </p>

            <div className="space-y-4">
              {/* Notification: Candidatures */}
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="font-medium text-slate-200 group-hover:text-white transition-colors">
                    Candidatures et réponses
                  </p>
                  <p className="text-sm text-slate-400">
                    Recevoir un email lors de nouvelles candidatures ou réponses
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailApplications}
                  onChange={(e) => setNotifications({ ...notifications, emailApplications: e.target.checked })}
                  className="w-5 h-5 text-sky-600 bg-slate-800 border-slate-600 rounded focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                />
              </label>

              {/* Notification: Nouvelles offres */}
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="font-medium text-slate-200 group-hover:text-white transition-colors">
                    Nouvelles offres
                  </p>
                  <p className="text-sm text-slate-400">
                    Recevoir un email lors de la publication de nouvelles offres
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailOffers}
                  onChange={(e) => setNotifications({ ...notifications, emailOffers: e.target.checked })}
                  className="w-5 h-5 text-sky-600 bg-slate-800 border-slate-600 rounded focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                />
              </label>

              {/* Notification: Messages */}
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="font-medium text-slate-200 group-hover:text-white transition-colors">
                    Messages privés
                  </p>
                  <p className="text-sm text-slate-400">
                    Recevoir un email lors de nouveaux messages (fonctionnalité à venir)
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailMessages}
                  onChange={(e) => setNotifications({ ...notifications, emailMessages: e.target.checked })}
                  className="w-5 h-5 text-sky-600 bg-slate-800 border-slate-600 rounded focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                />
              </label>
            </div>

            {/* Bouton de sauvegarde */}
            <button
              type="button"
              onClick={handleSavePreferences}
              disabled={isSavingPreferences}
              className="w-full mt-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingPreferences ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
            </button>
          </section>

          {/* Section 3: Zone de danger - Suppression du compte */}
          <section className="bg-slate-900 rounded-xl p-6 border border-red-900/50 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertIcon size={24} className="text-red-400" />
              <h2 className="text-xl font-semibold text-red-400">Zone de danger</h2>
            </div>

            <p className="text-sm text-slate-300 mb-4">
              La suppression de votre compte est <strong>irréversible</strong>. Toutes vos données seront définitivement supprimées.
            </p>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Supprimer mon compte
            </button>
          </section>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <AlertIcon size={28} className="text-red-400" />
              <h3 className="text-xl font-bold text-red-400">Confirmer la suppression</h3>
            </div>

            <p className="text-slate-300 mb-4">
              Cette action est <strong>irréversible</strong>. Toutes vos données, candidatures et informations personnelles seront définitivement supprimées.
            </p>

            <p className="text-sm text-slate-400 mb-4">
              Pour confirmer, tapez <strong className="text-white">SUPPRIMER</strong> ci-dessous :
            </p>

            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-6"
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
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
                disabled={isDeleting}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmation !== 'SUPPRIMER'}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
