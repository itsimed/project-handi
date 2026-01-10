/**
 * WaveIcon - Icône de salutation
 * Remplace l'emoji 👋
 */

interface IconProps {
  size?: number;
  className?: string;
  'aria-label'?: string;
}

export const WaveIcon = ({ 
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
      <path d="M5.5 11.5L7 10l4 4 4-4 1.5 1.5" />
      <path d="M7 5.5L8.5 4l4 4 4-4L18 5.5" />
      <path d="M10 16.5L11.5 15l4 4" />
    </svg>
  );
};
