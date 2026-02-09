import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  closeOnBackdrop?: boolean;
}

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

  useEffect(() => {
    if (!open) return;

    const prevOverFlow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const focusTarget = initialFocusRef?.current ?? dialogRef.current;
    focusTarget?.focus();

    return () => {
      document.body.style.overflow = prevOverFlow || '';

      if (
        previouslyFocusedRef.current &&
        typeof previouslyFocusedRef.current.focus === 'function'
      ) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [open, initialFocusRef]);

  if (!open || !containerRef.current) return null;

  const portalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onMouseDown={(e) => {
        if (!closeOnBackdrop) return;
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="relative z-10 w-full max-w-4xl mx-4 bg-white dark:bg-slate-900 rounded-lg shadow-xl p-4"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="sr-only">
          {title}
        </h2>

        {children}
      </div>
    </div>
  );

  return createPortal(portalContent, containerRef.current);
};

export default Modal;
