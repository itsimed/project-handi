/**
 * AccessibilityContext - Gestion complète des paramètres d'accessibilité
 * Étend ThemeContext pour inclure tous les paramètres d'affichage
 * Stockage dans localStorage pour persistance
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Theme = 'dark' | 'light';
type FontSize = '100%' | '110%' | '120%' | '130%' | '140%' | '150%';
type LineHeight = 'normal' | '1.5' | '2' | '2.5';
type LetterSpacing = 'normal' | '0.05em' | '0.1em' | '0.15em';

interface AccessibilitySettings {
  theme: Theme;
  monochrome: boolean;
  fontSize: FontSize;
  lineHeight: LineHeight;
  letterSpacing: LetterSpacing;
  largeCursor: boolean;
  highlightLinks: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  colors: {
    bg: string;
    text: string;
    border: string;
    bgSecondary: string;
  };
  theme: Theme;
  toggleTheme: () => void;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  resetSettings: () => void;
  hasActiveSettings: boolean; // Indique si des paramètres non-défaut sont actifs
}

const defaultSettings: AccessibilitySettings = {
  theme: 'dark',
  monochrome: false,
  fontSize: '100%',
  lineHeight: 'normal',
  letterSpacing: 'normal',
  largeCursor: false,
  highlightLinks: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Charger depuis localStorage ou utiliser les valeurs par défaut
    try {
      const saved = localStorage.getItem('accessibilitySettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Fusionner avec les valeurs par défaut pour gérer les nouvelles propriétés
        return { ...defaultSettings, ...parsed };
      }
      
      // Migration depuis l'ancien système 'theme' si accessibilitySettings n'existe pas
      const oldTheme = localStorage.getItem('theme');
      if (oldTheme && (oldTheme === 'dark' || oldTheme === 'light')) {
        const migratedSettings = {
          ...defaultSettings,
          theme: oldTheme as Theme,
        };
        localStorage.setItem('accessibilitySettings', JSON.stringify(migratedSettings));
        localStorage.removeItem('theme'); // Nettoyer l'ancien système
        return migratedSettings;
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres d\'accessibilité:', error);
    }
    return defaultSettings;
  });

  // Sauvegarder dans localStorage à chaque modification
  useEffect(() => {
    try {
      localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres d\'accessibilité:', error);
    }
  }, [settings]);

  // Appliquer les styles CSS dynamiquement
  useEffect(() => {
    const root = document.documentElement;
    
    // Mode monochrome
    if (settings.monochrome) {
      document.body.style.filter = 'grayscale(100%)';
    } else {
      document.body.style.filter = '';
    }

    // Taille de texte
    const fontSizeMultiplier = parseFloat(settings.fontSize) / 100;
    root.style.setProperty('--font-size-multiplier', fontSizeMultiplier.toString());
    document.body.style.fontSize = `calc(1rem * ${fontSizeMultiplier})`;

    // Interlignage
    root.style.setProperty('--line-height', settings.lineHeight);
    document.body.style.lineHeight = settings.lineHeight;

    // Espacement des lettres
    root.style.setProperty('--letter-spacing', settings.letterSpacing);
    document.body.style.letterSpacing = settings.letterSpacing;

    // Curseur agrandi
    if (settings.largeCursor) {
      document.body.classList.add('large-cursor');
    } else {
      document.body.classList.remove('large-cursor');
    }

    // Mise en évidence des liens
    if (settings.highlightLinks) {
      document.body.classList.add('highlight-links');
    } else {
      document.body.classList.remove('highlight-links');
    }
  }, [settings]);

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  // Calculer si des paramètres non-défaut sont actifs
  const hasActiveSettings = Object.keys(defaultSettings).some(key => {
    const settingKey = key as keyof AccessibilitySettings;
    return settings[settingKey] !== defaultSettings[settingKey];
  });

  // Calculer les couleurs selon le thème
  const colors = settings.theme === 'dark' 
    ? {
        bg: '#23022E',
        text: '#FFFFFF',
        border: '#FFFFFF',
        bgSecondary: '#23022E'
      }
    : {
        bg: '#FFFFFF',
        text: '#23022E',
        border: '#23022E',
        bgSecondary: '#F5F5F5'
      };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        colors,
        theme: settings.theme,
        toggleTheme,
        updateSetting,
        resetSettings,
        hasActiveSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

// Hook de compatibilité pour maintenir useTheme() existant
export const useTheme = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useTheme must be used within AccessibilityProvider');
  }
  return {
    theme: context.theme,
    toggleTheme: context.toggleTheme,
    colors: context.colors,
  };
};
