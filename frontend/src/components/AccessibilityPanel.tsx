/**
 * AccessibilityPanel - Panneau de paramètres d'accessibilité
 * Drawer qui slide depuis la gauche avec tous les paramètres
 */

import { useAccessibility } from '../contexts/AccessibilityContext';
import { CloseIcon } from './icons';
import { AccessibilityIcon } from './icons';
import { SunIcon, MoonIcon } from './icons/ThemeToggleIcons';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityPanel = ({ isOpen, onClose }: AccessibilityPanelProps) => {
  const {
    settings,
    colors,
    theme,
    toggleTheme,
    updateSetting,
    resetSettings,
  } = useAccessibility();

  return (
    <>
      {/* Overlay sombre qui se ferme au clic */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        role="dialog"
        aria-label="Paramètres d'accessibilité"
        aria-modal="true"
        className={`
          accessibility-panel
          w-full max-w-md rounded-2xl border-2 
          max-h-[calc(100vh-4rem)] overflow-hidden
          fixed
          top-16 left-0 h-[calc(100vh-4rem)]
          z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          backgroundColor: colors.bg,
          borderColor: colors.border,
        }}
      >
        {/* Header avec bouton fermer */}
        <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: colors.border }}>
          <h2
            className="text-xl font-bold flex items-center gap-2"
            style={{ color: colors.text }}
          >
            <AccessibilityIcon size={24} />
            Paramètres d'accessibilité
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg transition-colors focus:outline-none focus:ring-2"
            style={{
              color: colors.text,
              backgroundColor: 'transparent',
            }}
            aria-label="Fermer les paramètres d'accessibilité"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        {/* Contenu scrollable */}
        <div
          className="h-full overflow-y-auto p-6 space-y-6"
          style={{ maxHeight: 'calc(100vh - 8rem)' }}
        >
          {/* Section 1: Vision et contraste */}
          <section>
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: colors.text }}
            >
              1. Vision et contraste
            </h3>

            {/* Toggle mode sombre/clair */}
            <div className="mb-4 p-4 rounded-xl border" style={{ borderColor: colors.border }}>
              <div className="flex items-center justify-between">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: colors.text }}
                  >
                    Mode {theme === 'dark' ? 'sombre' : 'clair'}
                  </label>
                  <p className="text-xs" style={{ color: colors.text, opacity: 0.7 }}>
                    Basculer entre le thème sombre et clair
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-3 rounded-lg transition-colors focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.bgSecondary,
                    color: colors.text,
                  }}
                  aria-label={`Basculer vers le mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
                >
                  {theme === 'dark' ? <SunIcon size={24} /> : <MoonIcon size={24} />}
                </button>
              </div>
            </div>

            {/* Toggle mode monochrome */}
            <div className="p-4 rounded-xl border" style={{ borderColor: colors.border }}>
              <div className="flex items-center justify-between">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: colors.text }}
                  >
                    Mode monochrome
                  </label>
                  <p className="text-xs" style={{ color: colors.text, opacity: 0.7 }}>
                    Supprimer toutes les couleurs pour ne garder que des nuances de gris
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateSetting('monochrome', !settings.monochrome)}
                  className={`relative w-14 h-8 rounded-full transition-colors focus:outline-none focus:ring-2 ${
                    settings.monochrome ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  aria-label={settings.monochrome ? 'Désactiver le mode monochrome' : 'Activer le mode monochrome'}
                >
                  <span
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      settings.monochrome ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Section 2: Typographie */}
          <section>
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: colors.text }}
            >
              2. Typographie
            </h3>

            {/* Taille du texte */}
            <div className="mb-4 p-4 rounded-xl border" style={{ borderColor: colors.border }}>
              <label
                className="block text-sm font-medium mb-3"
                style={{ color: colors.text }}
              >
                Taille du texte
              </label>
              <div className="flex gap-2 flex-wrap">
                {(['100%', '110%', '120%', '130%', '140%', '150%'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => updateSetting('fontSize', size)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
                      settings.fontSize === size
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                    aria-label={`Taille de texte ${size}`}
                    aria-pressed={settings.fontSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Interlignage */}
            <div className="mb-4 p-4 rounded-xl border" style={{ borderColor: colors.border }}>
              <label
                className="block text-sm font-medium mb-3"
                style={{ color: colors.text }}
              >
                Interlignage
              </label>
              <div className="flex gap-2 flex-wrap">
                {(['normal', '1.5', '2', '2.5'] as const).map((height) => (
                  <button
                    key={height}
                    type="button"
                    onClick={() => updateSetting('lineHeight', height)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
                      settings.lineHeight === height
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                    aria-label={`Interlignage ${height}`}
                    aria-pressed={settings.lineHeight === height}
                  >
                    {height === 'normal' ? 'Normal' : height}
                  </button>
                ))}
              </div>
            </div>

            {/* Espacement des lettres */}
            <div className="p-4 rounded-xl border" style={{ borderColor: colors.border }}>
              <label
                className="block text-sm font-medium mb-3"
                style={{ color: colors.text }}
              >
                Espacement des lettres
              </label>
              <div className="flex gap-2 flex-wrap">
                {(['normal', '0.05em', '0.1em', '0.15em'] as const).map((spacing) => (
                  <button
                    key={spacing}
                    type="button"
                    onClick={() => updateSetting('letterSpacing', spacing)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
                      settings.letterSpacing === spacing
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                    aria-label={`Espacement ${spacing}`}
                    aria-pressed={settings.letterSpacing === spacing}
                  >
                    {spacing === 'normal' ? 'Normal' : spacing}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Section 3: Navigation et focus */}
          <section>
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: colors.text }}
            >
              3. Navigation et focus
            </h3>

            {/* Curseur agrandi */}
            <div className="mb-4 p-4 rounded-xl border" style={{ borderColor: colors.border }}>
              <div className="flex items-center justify-between">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: colors.text }}
                  >
                    Curseur agrandi
                  </label>
                  <p className="text-xs" style={{ color: colors.text, opacity: 0.7 }}>
                    Rendre le pointeur de la souris plus visible
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateSetting('largeCursor', !settings.largeCursor)}
                  className={`relative w-14 h-8 rounded-full transition-colors focus:outline-none focus:ring-2 ${
                    settings.largeCursor ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  aria-label={settings.largeCursor ? 'Désactiver le curseur agrandi' : 'Activer le curseur agrandi'}
                >
                  <span
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      settings.largeCursor ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Mise en évidence des liens */}
            <div className="p-4 rounded-xl border" style={{ borderColor: colors.border }}>
              <div className="flex items-center justify-between">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: colors.text }}
                  >
                    Mise en évidence des liens
                  </label>
                  <p className="text-xs" style={{ color: colors.text, opacity: 0.7 }}>
                    Souligner ou encadrer de manière très visible tous les éléments cliquables
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateSetting('highlightLinks', !settings.highlightLinks)}
                  className={`relative w-14 h-8 rounded-full transition-colors focus:outline-none focus:ring-2 ${
                    settings.highlightLinks ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  aria-label={settings.highlightLinks ? 'Désactiver la mise en évidence des liens' : 'Activer la mise en évidence des liens'}
                >
                  <span
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      settings.highlightLinks ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Bouton réinitialiser */}
          <div className="pt-4 border-t" style={{ borderColor: colors.border }}>
            <button
              type="button"
              onClick={resetSettings}
              className="w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 border-2"
              style={{
                backgroundColor: colors.bg,
                color: colors.text,
                borderColor: colors.border,
              }}
              aria-label="Réinitialiser tous les paramètres d'accessibilité"
            >
              Réinitialiser tous les paramètres
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
