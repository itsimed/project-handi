/**
 * Input Component - Composant input accessible et réutilisable
 * Supporte différents types, états d'erreur et icônes
 */

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      required,
      id,
      className = '',
      ...props
    },
    ref
  ) => {
    // Génération d'un ID unique si non fourni
    const inputId = id || `input-${React.useId()}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const hasError = Boolean(error);

    const baseInputStyles = `
      w-full px-3 py-2 rounded-lg
      border-2 transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-1
      disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50
      ${leftIcon ? 'pl-10' : ''}
      ${rightIcon ? 'pr-10' : ''}
    `;

    const borderStyles = hasError
      ? `border-red-600 focus:border-red-600 focus:ring-red-500`
      : `border-gray-200 focus:border-indigo-600 focus:ring-indigo-500`;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
            {required && (
              <span className="text-red-600 ml-1" aria-label="requis">
                *
              </span>
            )}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            className={`${baseInputStyles} ${borderStyles}`}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            >
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error Message */}
        {hasError && (
          <p
            id={errorId}
            className="mt-1.5 text-sm text-red-600"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        {/* Helper Text */}
        {!hasError && helperText && (
          <p
            id={helperId}
            className="mt-1.5 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
