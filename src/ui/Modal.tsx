/**
 * Modal Component - Composant modal accessible
 * Dialog modal avec overlay, gestion du focus et fermeture au clic extérieur
 */

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Tailles du modal
  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  // Gestion de la touche Escape
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Gestion du focus
  useEffect(() => {
    if (isOpen) {
      // Sauvegarder l'élément actif
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Bloquer le scroll du body
      document.body.style.overflow = 'hidden';
      
      // Focus sur le modal
      modalRef.current?.focus();
    } else {
      // Restaurer le scroll
      document.body.style.overflow = '';
      
      // Restaurer le focus
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Clic sur l'overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`
          relative bg-white rounded-lg shadow-xl
          w-full ${sizeStyles[size]}
          max-h-[90vh] overflow-hidden
          flex flex-col
          transform transition-all
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            {title && (
              <h2
                id="modal-title"
                className="text-xl font-semibold text-gray-900"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="
                  p-1 rounded-lg text-gray-400
                  hover:text-gray-600 hover:bg-gray-100
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                "
                aria-label="Fermer le modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

// Composant ModalFooter pour faciliter la création de footers standards
export const ModalFooter: React.FC<{
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmVariant?: 'primary' | 'danger' | 'success';
  isLoading?: boolean;
}> = ({
  onCancel,
  onConfirm,
  cancelLabel = 'Annuler',
  confirmLabel = 'Confirmer',
  confirmVariant = 'primary',
  isLoading = false,
}) => (
  <div className="flex justify-end gap-3">
    {onCancel && (
      <Button variant="outline" onClick={onCancel} disabled={isLoading}>
        {cancelLabel}
      </Button>
    )}
    {onConfirm && (
      <Button
        variant={confirmVariant}
        onClick={onConfirm}
        loading={isLoading}
        disabled={isLoading}
      >
        {confirmLabel}
      </Button>
    )}
  </div>
);
