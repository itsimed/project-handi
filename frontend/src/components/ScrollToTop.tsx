/**
 * ScrollToTop - Gère le comportement de scroll lors de la navigation
 * - Navigation normale (vers une nouvelle page) : scroll en haut
 * - Navigation arrière (bouton retour) : préserve la position précédente
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Vérifier si c'est une navigation "normale" (pas un retour arrière)
    // On scroll en haut uniquement pour les nouvelles pages
    const isBackNavigation = window.history.state?.idx < (window as any).lastHistoryIndex;
    
    if (!isBackNavigation) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant', // Scroll instantané, pas d'animation
      });
    }
    
    // Sauvegarder l'index actuel pour la prochaine navigation
    (window as any).lastHistoryIndex = window.history.state?.idx;
  }, [location.pathname]); // Se déclenche à chaque changement de route

  return null; // Ce composant ne rend rien visuellement
};
