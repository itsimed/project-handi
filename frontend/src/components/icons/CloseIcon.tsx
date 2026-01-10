/**
 * CloseIcon - Icône de fermeture/annulation
 * Remplace l'emoji ✕
 */

interface IconProps {
  size?: number;
  className?: string;
  'aria-label'?: string;
}

export const CloseIcon = ({ 
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
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      aria-hidden={!ariaLabel}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
};
