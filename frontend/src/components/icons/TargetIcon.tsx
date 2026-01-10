/**
 * TargetIcon - Icône de cible/objectif
 * Remplace l'emoji 🎯
 */

interface IconProps {
  size?: number;
  className?: string;
  'aria-label'?: string;
}

export const TargetIcon = ({ 
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
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
};
