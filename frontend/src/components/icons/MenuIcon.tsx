/**
 * MenuIcon - Icône hamburger menu
 * SVG accessible pour navigation mobile
 */

interface MenuIconProps {
  size?: number;
  className?: string;
  'aria-hidden'?: boolean;
}

export const MenuIcon = ({ size = 24, className = '', 'aria-hidden': ariaHidden = true }: MenuIconProps) => {
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
      aria-hidden={ariaHidden}
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
};
