import { Link } from 'react-router-dom';

export default function Footer(): React.JSX.Element {
  return (
    <footer className="border-t bg-white/90 dark:bg-slate-900/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-slate-600 dark:text-slate-400">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3">
          <div className="text-center sm:text-left">
            <span className="block">&copy; {new Date().getFullYear()} CineLab</span>
            <span className="block text-xs text-slate-500 dark:text-slate-500">
              Todos los derechos reservados
            </span>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center justify-center sm:justify-end gap-3"
          >
            <Link
              to="/about"
              className="text-sm text-slate-700 dark:text-slate-200 hover:underline focus:outline-none focus:ring-2 focus:ring-cinematic-action rounded px-2 py-1"
            >
              About
            </Link>

            <Link
              to="/privacy"
              className="text-sm text-slate-700 dark:text-slate-200 hover:underline focus:outline-none focus:ring-2 focus:ring-cinematic-action rounded px-2 py-1"
            >
              Privacy
            </Link>

            <a
              href="https://github.com/ezefernandezyf/cinelab-react"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="CineLab en GitHub (abre en ventana nueva)"
              className="text-sm text-slate-700 dark:text-slate-200 hover:underline focus:outline-none focus:ring-2 focus:ring-cinematic-action rounded px-2 py-1 inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.6-1.6-1.5-2-1.5-2-1.2-.8.1-.8.1-.8 1.4.1 2.2 1.4 2.2 1.4 1.1 2 2.9 1.4 3.6 1.1.1-.9.4-1.4.7-1.7-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.5-2.3 1.3-3.2-.1-.3-.6-1.6.1-3.3 0 0 1-.3 3.3 1.2a11.3 11.3 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 3 .1 3.3.8.9 1.3 2 1.3 3.2 0 4.6-2.7 5.6-5.3 5.9.4.4.8 1.1.8 2.3v3.4c0 .3.2.7.8.6A12 12 0 0012 .5z" />
              </svg>
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
