/**
 * AccessibilityButton - Pastille flottante pour ouvrir le panneau d'accessibilité
 * Positionnée en bas à gauche de toutes les pages
 */

import { useState } from 'react';
import { AccessibilityIcon } from './icons';
import { AccessibilityPanel } from './AccessibilityPanel';

export const AccessibilityButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 z-50 border-4"
        style={{
          backgroundColor: '#23022E',
          color: '#FFFFFF',
          borderColor: '#FFFFFF',
        }}
        aria-label="Ouvrir les paramètres d'accessibilité"
        aria-expanded={isOpen}
      >
        <AccessibilityIcon size={32} />
      </button>

      <AccessibilityPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
