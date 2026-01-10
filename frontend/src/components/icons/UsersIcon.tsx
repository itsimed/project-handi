/**
 * UsersIcon - Icône SVG de groupe d'utilisateurs
 * Représente plusieurs personnes/utilisateurs
 */

interface UsersIconProps {
  size?: number;
  className?: string;
}

export const UsersIcon = ({ size = 24, className = '' }: UsersIconProps) => {
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
      {/* Utilisateur 1 */}
      <circle
        cx="9"
        cy="7"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Corps utilisateur 1 */}
      <path
        d="M2 21C2 17.134 5.134 14 9 14C12.866 14 16 17.134 16 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Utilisateur 2 (arrière-plan) */}
      <path
        d="M15.5 3.29C16.46 3.71 17.21 4.5 17.61 5.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M17 14C19.21 14 21.5 15.5 22 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
