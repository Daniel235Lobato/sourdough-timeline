import React, { useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidthClass?: string;
  backdropClass?: string;
  cardClass?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  maxWidthClass = 'max-w-md',
  backdropClass = 'bg-stone-900/60 backdrop-blur-sm',
  cardClass = ''
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto overflow-x-hidden overscroll-contain animate-fade-in ${backdropClass}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-white dark:bg-stone-900 rounded-3xl w-full p-4 sm:p-6 shadow-2xl border border-stone-200 dark:border-stone-800 relative max-h-[90vh] overflow-y-auto overflow-x-hidden my-auto ${maxWidthClass} ${cardClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};
