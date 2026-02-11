import { useRef } from 'react';
import Modal from './Modal';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Props {
  trailerKey?: string | undefined;
  open: boolean;
  onClose: () => void;
  title?: string;
  initialFocusRef?: React.RefObject<HTMLElement | null>; // acepta prop externa
}

export default function TrailerModal({ trailerKey, open, onClose, title, initialFocusRef }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const iframeSrc =
    open && trailerKey ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0` : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      initialFocusRef={initialFocusRef ?? closeBtnRef}
    >
      <div className="relative">
        <button
          ref={closeBtnRef}
          aria-label="Cerrar trailer"
          onClick={() => {
            onClose();
          }}
          className="absolute right-3 top-3 p-2 rounded-full bg-white/90 dark:bg-slate-800/90
           text-slate-700 dark:text-slate-200 shadow hover:bg-white dark:hover:bg-slate-700
            focus:outline-none focus:ring-2 focus:ring-sky-500 z-20"
        >
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="pt-[56.25%] relative">
          {iframeSrc ? (
            <iframe
              className="absolute inset-0 w-full h-full border-0"
              src={iframeSrc}
              title={title ? `Trailer de ${title}` : 'Trailer'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                No hay trailer disponible
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
