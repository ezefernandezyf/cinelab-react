import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  closeOnBackdrop?: boolean;
}

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

export const Modal = ({
  open,
  onClose,
  title,
  children,
  initialFocusRef,
  closeOnBackdrop = true,
}: Props): React.JSX.Element | null => {
  const [containerEl] = useState<HTMLDivElement>(() => {
    const el = document.createElement('div');
    el.className = 'modal-portal';
    return el;
  });
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const titleId = 'modal-title';

  useEffect(() => {
    const mountNode = document.getElementById('modal-root') ?? document.body;
    mountNode.appendChild(containerEl);

    return () => {
      if (containerEl.parentNode) {
        containerEl.parentNode.removeChild(containerEl);
      }
    };
  }, [containerEl]);

  const getFocusableElements = (): HTMLElement[] => {
    if (!dialogRef.current) return [];
    const nodes = Array.from(
      dialogRef.current.querySelectorAll(FOCUSABLE_SELECTORS)
    ) as HTMLElement[];

    const visible = nodes.filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      if (el.offsetParent === null) return false;
      if (el.getClientRects().length === 0) return false;
      if (el.getAttribute('aria-hidden') === 'true') return false;
      return true;
    });

    return visible.length > 0 ? visible : nodes;
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusables = getFocusableElements();

        if (focusables.length === 0) {
          e.preventDefault();
          dialogRef.current?.focus();
          return;
        }

        const active = document.activeElement as HTMLElement | null;
        let index = focusables.indexOf(active as HTMLElement);
        if (active === dialogRef.current || index === -1) index = -1;

        let nextIndex: number;
        if (e.shiftKey) {
          nextIndex = index <= 0 ? focusables.length - 1 : index - 1;
        } else {
          nextIndex = index === focusables.length - 1 ? 0 : index + 1;
        }

        e.preventDefault();
        focusables[nextIndex]?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const prevOverFlow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const focusTarget = initialFocusRef?.current ?? dialogRef.current;
    focusTarget?.focus?.();

    return () => {
      document.body.style.overflow = prevOverFlow || '';
      if (
        previouslyFocusedRef.current &&
        typeof previouslyFocusedRef.current.focus === 'function' &&
        document.contains(previouslyFocusedRef.current)
      ) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [open, initialFocusRef]);

  if (!open || !containerEl) return null;

  const portalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onMouseDown={(e) => {
        if (!closeOnBackdrop) return;
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Backdrop: slightly blurred and translucent */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className="relative z-10 w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-lg shadow-xl transform transition-all motion-safe:animate-fade-in-up overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh' }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <h2 id={titleId} className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {title ?? ''}
          </h2>
          <div></div>
        </div>

        <div className="px-4 py-4 overflow-auto" style={{ maxHeight: 'calc(90vh - 72px)' }}>
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(portalContent, containerEl);
};

export default Modal;
