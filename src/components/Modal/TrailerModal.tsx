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
          className="absolute right-3 top-3 z-20 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 shadow hover:bg-white dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        <div
          className="w-full rounded-md overflow-hidden bg-black"
          style={{ aspectRatio: '16 / 9' }}
        >
          {iframeSrc ? (
            <iframe
              className="w-full h-full block"
              src={iframeSrc}
              title={title ? `Trailer de ${title}` : 'Trailer'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-slate-100 dark:bg-slate-800">
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
