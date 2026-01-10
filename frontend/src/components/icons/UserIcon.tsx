/**
 * UserIcon - Icône SVG de profil utilisateur
 * Icône simple et accessible pour représenter un utilisateur
 */

interface UserIconProps {
  size?: number;
  className?: string;
}

export const UserIcon = ({ size = 24, className = '' }: UserIconProps) => {
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
      {/* Cercle pour la tête */}
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Arc pour les épaules/corps */}
      <path
        d="M6 21C6 17.134 8.686 14 12 14C15.314 14 18 17.134 18 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
