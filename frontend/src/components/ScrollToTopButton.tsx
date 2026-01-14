/**
 * ScrollToTopButton - Bouton flottant pour remonter en haut de page
 */

import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/AccessibilityContext';

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 z-50 border-4"
      style={{
        backgroundColor: theme === 'dark' ? '#FFFFFF' : '#23022E',
        color: theme === 'dark' ? '#23022E' : '#FFFFFF',
        borderColor: '#FFFFFF'
      }}
      aria-label="Remonter en haut de la page"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 19V5M5 12l7-7 7 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};
