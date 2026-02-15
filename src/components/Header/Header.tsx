import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, NavLink } from 'react-router-dom';
import { useFavoritesContext } from '../../hooks/useFavoritesContext';
import HeaderSearch from '../HeaderSearch/HeaderSearch';

export default function Header(): React.JSX.Element {
  const [open, setOpen] = useState(false);

  const favCtx = useFavoritesContext();
  const favCount = favCtx.favorites?.length ?? 0;

  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              aria-label="CineLab — inicio"
              className="text-xl font-semibold text-slate-900 dark:text-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded"
            >
              CineLab
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <nav
              aria-label="Main navigation"
              className="flex items-center space-x-4 text-sm font-medium text-slate-700 dark:text-slate-200 "
            >
              <NavLink
                to="/home"
                className="focus:outline-none focus:ring-2 focus:ring-sky-500 rounded hover:text-sky-600"
                aria-label="home"
              >
                Inicio
              </NavLink>
              <NavLink
                to="/search"
                className=" focus:outline-none focus:ring-2 focus:ring-sky-500 rounded hover:text-sky-600"
                aria-label="search"
              >
                Buscar
              </NavLink>
              <NavLink
                to="/favorites"
                className=" focus:outline-none focus:ring-2 focus:ring-sky-500 rounded hover:text-sky-600"
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

            <HeaderSearch className="ml-4 flex items-center" />
          </div>

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

      <div id="mobile-menu" className={`md:hidden ${open ? 'block' : 'hidden'} border-t`}>
        <div className="px-4 pt-2 pb-4 space-y-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
          <NavLink to="/home" className="block px-3 py-2 rounded ">
            Inicio
          </NavLink>
          <NavLink to="/search" className="block px-3 py-2 rounded ">
            Buscar
          </NavLink>
          <NavLink to="/favorites" className="block px-3 py-2 rounded ">
            Favoritos
          </NavLink>

          <HeaderSearch
            inputId="mobile-search"
            className="mt-2 w-full" 
            fullWidth
          />
        </div>
      </div>
    </header>
  );
}
