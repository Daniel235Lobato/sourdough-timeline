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
  backdropClass = 'bg-[#2E1E14]/60 backdrop-blur-sm',
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
      className={`fixed inset-0 z-50 overflow-y-auto overflow-x-hidden overscroll-contain animate-fade-in ${backdropClass} flex flex-col items-center justify-start sm:justify-center`}
      style={{
        paddingTop: 'max(2.5rem, calc(env(safe-area-inset-top, 0px) + 1.5rem))',
        paddingBottom: 'max(2rem, calc(env(safe-area-inset-bottom, 0px) + 1.5rem))',
        paddingLeft: 'max(1rem, calc(env(safe-area-inset-left, 0px) + 0.75rem))',
        paddingRight: 'max(1rem, calc(env(safe-area-inset-right, 0px) + 0.75rem))',
        minHeight: '100dvh'
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-[#FAF5EE] text-[#2E1E14] rounded-3xl w-full p-5 sm:p-6 shadow-2xl border border-[#D1C1A8] relative overflow-y-auto overflow-x-hidden my-auto shrink-0 ${maxWidthClass} ${cardClass}`}
        style={{
          maxHeight: 'calc(100dvh - 5.5rem)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};
