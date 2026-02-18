import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, NavLink } from 'react-router-dom';
import { useFavoritesContext } from '../../hooks/useFavoritesContext';
import HeaderSearch from '../HeaderSearch/HeaderSearch';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

export default function Header(): React.JSX.Element {
  const [open, setOpen] = useState(false);

  const favCtx = useFavoritesContext();
  const favCount = favCtx.favorites?.length ?? 0;

  return (
    <header className="sticky top-0 z-40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              aria-label="CineLab — inicio"
              className="text-xl font-display font-semibold text-slate-900 dark:text-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded"
            >
              CineLab
            </Link>
            {/* Desktop nav */}
            <nav
              aria-label="Main navigation"
              className="hidden md:flex items-center space-x-4 text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 hover:text-sky-600 ${isActive ? 'text-cinematic-action' : ''}`
                }
                aria-label="home"
              >
                Inicio
              </NavLink>

              <NavLink
                to="/search"
                className={({ isActive }) =>
                  `px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 hover:text-sky-600 ${isActive ? 'text-cinematic-action' : ''}`
                }
                aria-label="search"
              >
                Buscar
              </NavLink>

              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  `px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 hover:text-sky-600 ${isActive ? 'text-cinematic-action' : ''}`
                }
                aria-label="favorites"
              >
                Favoritos
                <span
                  aria-hidden={favCount === 0}
                  className={`ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full ${
                    favCount > 0
                      ? 'bg-amber-300 text-slate-900'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {favCount}
                </span>
              </NavLink>
            </nav>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <HeaderSearch className="ml-4" />
            <ThemeToggle />
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              aria-controls="mobile-menu"
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <span className="sr-only">Abrir menú principal</span>
              {open ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div id="mobile-menu" className={`md:hidden ${open ? 'block' : 'hidden'} border-t`}>
        <div className="px-4 pt-2 pb-4 space-y-2 text-base font-medium text-slate-700 dark:text-slate-200">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `block px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500" ${isActive ? 'text-cinematic-action' : ''} `
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `block px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500" ${isActive ? 'text-cinematic-action' : ''} `
            }
          >
            Buscar
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `block px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500" ${isActive ? 'text-cinematic-action' : ''} `
            }
          >
            Favoritos
          </NavLink>

          <div className="mt-2">
            <HeaderSearch inputId="mobile-search" className="w-full" fullWidth />
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between px-3 py-2">
              <ThemeToggle />
              <span className="text-sm text-slate-500 dark:text-slate-400">Modo</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
