import { XMarkIcon } from '@heroicons/react/24/solid';
import { useEffect } from 'react';
import logger from '../../utilities/logger';

export type ToastItem = {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  autoHideMs?: number;
};

type Props = {
  toasts: ToastItem[];
  onClose: (id: string) => void;
};

export default function ToastContainer({ toasts, onClose }: Props) {
  return (
    <div
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-3 items-center sm:items-end"
    >
      {toasts.map((t) => (
        <Toast key={t.id} item={t} onClose={onClose} />
      ))}
    </div>
  );
}

function Toast({ item, onClose }: { item: ToastItem; onClose: (id: string) => void }) {
  const { id, message, actionLabel, onAction, autoHideMs = 4000 } = item;

  useEffect(() => {
    const timer = setTimeout(() => onClose(id), autoHideMs);
    return () => clearTimeout(timer);
  }, [id, autoHideMs, onClose]);

  return (
    <div
      role="status"
      aria-atomic="true"
      className="w-full max-w-sm motion-safe:animate-fade-in-up bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-start justify-between gap-4 ring-1 ring-black/20"
    >
      <div className="flex-1 pr-2">
        <div className="text-sm leading-relaxed">{message}</div>
      </div>

      <div className="flex-shrink-0 flex items-center gap-2">
        {onAction && actionLabel && (
          <button
            onClick={() => {
              try {
                onAction();
              } catch (err) {
                logger.error('Toast action failed:', err);
              } finally {
                onClose(id);
              }
            }}
            className="text-xs px-3 py-1 rounded-md bg-transparent text-cinematic-accent hover:bg-cinematic-accent/10 transition focus:outline-none focus:ring-2 focus:ring-cinematic-accent"
            aria-label={actionLabel}
          >
            {actionLabel}
          </button>
        )}

        <button
          onClick={() => onClose(id)}
          aria-label="Cerrar"
          className="p-1 rounded-md text-indigo-200 hover:text-white hover:bg-white/5 transition focus:outline-none focus:ring-2 focus:ring-cinematic-accent"
        >
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
