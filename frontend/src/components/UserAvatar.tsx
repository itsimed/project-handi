/**
 * UserAvatar - Avatar utilisateur avec initiales
 * Affiche les initiales de l'utilisateur dans une pastille circulaire
 * avec un dégradé de couleur selon le rôle
 */

interface UserAvatarProps {
  firstName: string;
  lastName: string;
  role: 'APPLICANT' | 'RECRUITER';
  isExpanded: boolean;
  onClick: () => void;
}

export const UserAvatar = ({
  firstName,
  lastName,
  role,
  isExpanded,
  onClick,
}: UserAvatarProps) => {
  // Générer les initiales (première lettre du prénom + nom)
  const getInitials = () => {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  // Dégradé selon le rôle
  const gradientClass = role === 'RECRUITER'
    ? 'bg-gradient-to-br from-purple-500 to-pink-500'
    : 'bg-gradient-to-br from-blue-500 to-cyan-500';

  const roleLabel = role === 'RECRUITER' ? 'Recruteur' : 'Candidat';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Menu de ${firstName} ${lastName}, ${roleLabel}`}
      aria-expanded={isExpanded}
      aria-haspopup="true"
      className={`
        relative w-10 h-10 rounded-full ${gradientClass}
        flex items-center justify-center
        text-white font-bold text-sm
        transition-all duration-200
        hover:scale-110 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900
        ${isExpanded ? 'ring-2 ring-sky-400' : ''}
      `}
    >
      {getInitials()}
    </button>
  );
};
