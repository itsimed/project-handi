/**
 * Button Component - Composant bouton réutilisable et accessible
 * Supporte plusieurs variantes, tailles et états
 */

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Styles de base
    const baseStyles = `
      inline-flex items-center justify-center
      font-medium rounded-lg
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      ${fullWidth ? 'w-full' : ''}
    `;

    // Styles par variante
    const variantStyles: Record<ButtonVariant, string> = {
      primary: `
        bg-indigo-600 text-white
        hover:bg-indigo-700
        focus:ring-indigo-500
        shadow-sm hover:shadow-md
      `,
      secondary: `
        bg-cyan-600 text-white
        hover:bg-cyan-700
        focus:ring-cyan-500
        shadow-sm hover:shadow-md
      `,
      outline: `
        border-2 border-gray-200
        text-gray-900
        hover:bg-gray-100
        focus:ring-indigo-500
      `,
      ghost: `
        text-gray-900
        hover:bg-gray-100
        focus:ring-indigo-500
      `,
      danger: `
        bg-red-600 text-white
        hover:opacity-90
        focus:ring-red-500
        shadow-sm hover:shadow-md
      `,
      success: `
        bg-emerald-600 text-white
        hover:opacity-90
        focus:ring-emerald-500
        shadow-sm hover:shadow-md
      `,
    };

    // Styles par taille
    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5',
    };

    const combinedClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${className}
    `.trim();

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={combinedClassName}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span aria-hidden="true">{leftIcon}</span>}
        <span>{children}</span>
        {!loading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
