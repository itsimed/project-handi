/**
 * Breadcrumb - Fil d'Ariane accessible
 * Conforme WCAG - Navigation sémantique avec aria-labels
 * Style avec flèches et fond coloré
 */

import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../constants';

interface BreadcrumbItem {
  label: string;
  path: string;
  isLast: boolean;
}

/**
 * Hook personnalisé pour générer les éléments du fil d'Ariane
 */
const useBreadcrumbs = (): BreadcrumbItem[] => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    const user = userData ? JSON.parse(userData) : null;
    const pathname = location.pathname;

    // Configuration des routes et leurs labels
    const routeConfig: Record<string, string> = {
      '/dashboard': 'Offres',
      '/offres': 'Offres',
      '/mes-candidatures': 'Mes candidatures',
      '/profil': 'Mon profil',
      '/recruteur/dashboard': 'Tableau de bord',
      '/recruteur/publier-offre': 'Publier une offre',
    };

    const items: BreadcrumbItem[] = [];

    // Toujours commencer par Accueil
    items.push({
      label: 'Accueil',
      path: '/',
      isLast: false,
    });

    // Parser l'URL pour construire le fil d'Ariane
    const pathParts = pathname.split('/').filter(Boolean);

    if (pathParts.length === 0) {
      // Page d'accueil - pas de breadcrumb nécessaire
      setBreadcrumbs([]);
      return;
    }

    // Construire le chemin progressivement
    let currentPath = '';
    
    for (let i = 0; i < pathParts.length; i++) {
      currentPath += `/${pathParts[i]}`;
      const isLast = i === pathParts.length - 1;

      // Vérifier si c'est une route connue
      if (routeConfig[currentPath]) {
        items.push({
          label: routeConfig[currentPath],
          path: currentPath,
          isLast,
        });
      } 
      // Gérer les IDs dynamiques
      else if (pathParts[i].match(/^\d+$/)) {
        // C'est un ID numérique
        if (currentPath.includes('/offres/')) {
          items.push({
            label: 'Détail de l\'offre',
            path: currentPath,
            isLast,
          });
        } else if (currentPath.includes('/mes-candidatures/')) {
          items.push({
            label: 'Détail de la candidature',
            path: currentPath,
            isLast,
          });
        }
      }
      // Routes intermédiaires
      else if (pathParts[i] === 'recruteur' && !isLast) {
        // Ne pas ajouter 'recruteur' seul, attendre le segment suivant
        continue;
      }
    }

    // Marquer le dernier élément
    if (items.length > 0) {
      items[items.length - 1].isLast = true;
    }

    setBreadcrumbs(items);
  }, [location.pathname]);

  return breadcrumbs;
};

/**
 * Composant Breadcrumb
 */
export const Breadcrumb = () => {
  const breadcrumbs = useBreadcrumbs();

  // Ne pas afficher si moins de 2 éléments (juste Accueil)
  if (breadcrumbs.length < 2) {
    return null;
  }

  return (
    <nav 
      aria-label="Fil d'Ariane" 
      className="bg-slate-900/50 border-b border-slate-800/50 px-4 sm:px-6 py-2 sm:py-3"
    >
      <ol className="container mx-auto flex items-center gap-1 sm:gap-2 text-xs sm:text-sm overflow-x-auto">
        {breadcrumbs.map((item, index) => (
          <li key={item.path} className="flex items-center gap-2">
            {!item.isLast ? (
              <>
                {/* Lien cliquable */}
                <Link
                  to={item.path}
                  className="text-slate-400 hover:text-white underline hover:no-underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-1"
                  aria-label={`Naviguer vers ${item.label}`}
                >
                  {item.label}
                </Link>
                
                {/* Séparateur flèche simple */}
                <span className="text-slate-600" aria-hidden="true">›</span>
              </>
            ) : (
              /* Élément actif (non cliquable) */
              <span
                className="text-slate-200 font-normal"
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
