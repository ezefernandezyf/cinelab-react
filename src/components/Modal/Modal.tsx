import React, { useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // NOTE: using a fixed id 'modal-title' so existing tests that query '#modal-title' remain valid.
  // If you later need multiple modals simultaneously, consider generating unique ids and updating tests.
  const titleId = 'modal-title';

  // Create portal container on mount and clean up on unmount
  useEffect(() => {
    const el = document.createElement('div');
    el.className = 'modal-portal';
    const mountNode = document.getElementById('modal-root') ?? document.body;
    mountNode.appendChild(el);
    containerRef.current = el;

    return () => {
      if (containerRef.current && containerRef.current.parentNode) {
        containerRef.current.parentNode.removeChild(containerRef.current);
      }
      containerRef.current = null;
    };
  }, []);

  // Helper: get focusable elements inside the dialog and filter visible ones.
  // IMPORTANT: in test env (jsdom) visibility checks may fail -> keep fallback to all nodes.
  const getFocusableElements = (): HTMLElement[] => {
    if (!dialogRef.current) return [];
    const nodes = Array.from(dialogRef.current.querySelectorAll(FOCUSABLE_SELECTORS)) as HTMLElement[];

    const visible = nodes.filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      // Visible checks: offsetParent and client rects
      if (el.offsetParent === null) return false;
      if (el.getClientRects().length === 0) return false;
      if (el.getAttribute('aria-hidden') === 'true') return false;
      return true;
    });

    // If the visible filter removed everything (common in jsdom), fall back to the original nodes.
    return visible.length > 0 ? visible : nodes;
  };

  // Keyboard handling: Escape + Tab cycling
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

        // No focusable elements: keep focus on the dialog
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

  // Manage body scroll, initial focus and restore focus on close
  useEffect(() => {
    if (!open) return;

    const prevOverFlow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    // Prefer explicit initialFocusRef, otherwise focus the dialog container.
    const focusTarget = initialFocusRef?.current ?? dialogRef.current;
    focusTarget?.focus?.();

    return () => {
      document.body.style.overflow = prevOverFlow || '';

      // Restore focus only if the element is still in the document
      if (
        previouslyFocusedRef.current &&
        typeof previouslyFocusedRef.current.focus === 'function' &&
        document.contains(previouslyFocusedRef.current)
      ) {
        previouslyFocusedRef.current.focus();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialFocusRef]);

  if (!open || !containerRef.current) return null;

  const portalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onMouseDown={(e) => {
        if (!closeOnBackdrop) return;
        // Close only if clicked the overlay itself (not children)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative z-10 w-full max-w-4xl mx-4 bg-white dark:bg-slate-900 rounded-lg shadow-xl p-4"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="sr-only">
          {title}
        </h2>

        {children}
      </div>
    </div>
  );

  return createPortal(portalContent, containerRef.current);
};

export default Modal;