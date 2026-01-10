/**
 * CheckIcon - Icône de validation
 * Remplace l'emoji ✓
 */

interface IconProps {
  size?: number;
  className?: string;
  'aria-label'?: string;
}

export const CheckIcon = ({ 
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
};
