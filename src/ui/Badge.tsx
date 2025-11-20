/**
 * Badge Component - Composant badge pour afficher des statuts, tags, etc.
 */

import React from 'react';

export type BadgeVariant = 
  | 'default' 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info'
  | 'inclusive';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  dot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-indigo-100 text-indigo-800',
    secondary: 'bg-cyan-100 text-cyan-800',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    inclusive: 'bg-violet-100 text-violet-800',
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-medium rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === 'default'
              ? 'bg-gray-600'
              : variant === 'primary'
              ? 'bg-indigo-600'
              : variant === 'secondary'
              ? 'bg-cyan-600'
              : variant === 'success'
              ? 'bg-emerald-600'
              : variant === 'warning'
              ? 'bg-amber-600'
              : variant === 'error'
              ? 'bg-red-600'
              : variant === 'info'
              ? 'bg-blue-600'
              : 'bg-violet-600'
          }`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
