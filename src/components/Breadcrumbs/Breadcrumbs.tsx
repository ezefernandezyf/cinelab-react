import { Link } from 'react-router-dom';

interface Props {
  items: Array<{ to?: string; label: string }>;
  onBack?: () => void;
}

export default function Breadcrumbs({ items, onBack }: Props) {
  return (
    <nav
      className="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-4"
      aria-label="breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center">
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="text-slate-700 dark:text-slate-200 hover:underline focus:outline-none focus:ring-2 focus:ring-cinematic-action rounded px-1"
                >
                  {item.label}
                </Link>
              ) : isLast ? (
                <span
                  aria-current="page"
                  className="font-medium text-slate-800 dark:text-slate-100"
                >
                  {item.label}
                </span>
              ) : (
                <span className="text-slate-700 dark:text-slate-200">{item.label}</span>
              )}

              {!isLast && (
                <span className="mx-2 text-slate-400" aria-hidden="true">
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {onBack && (
        <button
          type="button"
          aria-label="Ir atrás"
          onClick={onBack}
          className="ml-4 px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-cinematic-action"
        >
          Volver
        </button>
      )}
    </nav>
  );
}
