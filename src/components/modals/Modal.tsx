import React, { useEffect, useId, useRef } from 'react';

interface ModalProps {
  onClose: () => void;
  /** Accessible name (also rendered via aria-labelledby by the caller's heading id). */
  titleId: string;
  maxWidthClass?: string;
  children: React.ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal shell: role=dialog, aria-modal, Escape to close,
 * Tab/Shift+Tab focus trap, focus moved in on open and restored on close.
 * Render it only while open (state inside children resets on every open).
 */
export const Modal: React.FC<ModalProps> = ({ onClose, titleId, maxWidthClass = 'max-w-lg', children }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;

    // Move focus inside (first real control; fall back to the dialog itself).
    const focusables = () =>
      dialog ? Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null) : [];
    const list = focusables();
    (list[1] ?? list[0] ?? dialog)?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !dialog) return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        dialog.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !dialog.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !dialog.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`bg-white rounded-2xl shadow-2xl ${maxWidthClass} w-full max-h-[calc(100dvh-2rem)] overflow-hidden flex flex-col border border-slate-200 outline-none`}
      >
        {children}
      </div>
    </div>
  );
};

export function useTitleId(prefix: string): string {
  return `${prefix}-${useId().replace(/:/g, '')}`;
}
