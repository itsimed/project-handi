/**
 * AccessibilityIcon - Icône d'accessibilité
 * Remplace l'emoji ♿
 */

interface IconProps {
  size?: number;
  className?: string;
  'aria-label'?: string;
}

export const AccessibilityIcon = ({ 
  size = 20, 
  className = '', 
  'aria-label': ariaLabel 
}: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      aria-hidden={!ariaLabel}
    >
      <circle cx="12" cy="5" r="2" />
      <path d="M12 22s-4-4-4-7 4-3 4-3 4 0 4 3-4 7-4 7z" />
      <path d="M8 12h8" />
    </svg>
  );
};
