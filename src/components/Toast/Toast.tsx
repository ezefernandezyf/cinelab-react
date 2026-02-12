import { XMarkIcon } from '@heroicons/react/24/solid';
import { useEffect } from 'react';

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
    <div aria-live="polite" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
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
      className="max-w-xs w-full bg-slate-900 text-white px-4 py-2 rounded shadow-lg flex items-center justify-between gap-4"
      style={{ minWidth: 200 }}
    >
      <div className="text-sm">{message}</div>

      <div className="flex items-center gap-2">
        {onAction && actionLabel && (
          <button
            onClick={() => {
              onAction();
              onClose(id);
            }}
            className="text-indigo-200 hover:text-white text-sm"
            aria-label={actionLabel}
          >
            {actionLabel}
          </button>
        )}

        <button
          onClick={() => onClose(id)}
          aria-label="Cerrar"
          className="text-indigo-200 hover:text-white p-1 rounded"
        >
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
