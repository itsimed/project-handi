/**
 * ClockIcon - Icône SVG d'horloge/temps
 * Représente le temps, l'attente, la durée
 */

interface ClockIconProps {
  size?: number;
  className?: string;
}

export const ClockIcon = ({ size = 24, className = '' }: ClockIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Cercle de l'horloge */}
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Aiguille des heures */}
      <path
        d="M12 6V12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Aiguille des minutes */}
      <path
        d="M12 12L15 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
