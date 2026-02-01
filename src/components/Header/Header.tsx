import React, { useState } from 'react';

export default function Header(): React.JSX.Element {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
  
    console.log('Buscar:', query);
   
  }

  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
        
          <div className="flex items-center">
            <a
              href="/"
              aria-label="CineLab — inicio"
              className="text-xl font-semibold text-slate-900 dark:text-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded"
            >
              CineLab
            </a>
          </div>

        
          <div className="hidden md:flex md:items-center md:space-x-6">
            <nav aria-label="Main navigation" className="flex items-center space-x-4">
              <a
                href="/"
                className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded"
              >
                Inicio
              </a>
              <a
                href="/search"
                className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded"
              >
                Buscar
              </a>
              <a
                href="/favorites"
                className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded"
              >
                Favoritos
              </a>
            </nav>

            <form
              role="search"
              aria-label="Buscar películas"
              onSubmit={onSubmit}
              className="ml-4 flex items-center"
            >
              <label htmlFor="search" className="sr-only">
                Buscar películas
              </label>
              <input
                id="search"
                name="q"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar películas..."
                className="w-64 px-3 py-2 border rounded-md text-sm bg-white/80 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="submit"
                className="ml-2 px-3 py-2 bg-sky-600 text-white rounded-md text-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                Buscar
              </button>
            </form>
          </div>

        
          <div className="md:hidden flex items-center">
            <button
              aria-controls="mobile-menu"
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <span className="sr-only">Abrir menú principal</span>
           
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                {open ? (
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      
      <div id="mobile-menu" className={`md:hidden ${open ? 'block' : 'hidden'} border-t`}>
        <div className="px-4 pt-2 pb-4 space-y-2">
          <a
            href="/"
            className="block px-3 py-2 rounded text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Inicio
          </a>
          <a
            href="/search"
            className="block px-3 py-2 rounded text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Buscar
          </a>
          <a
            href="/favorites"
            className="block px-3 py-2 rounded text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Favoritos
          </a>

          <form
            role="search"
            aria-label="Buscar películas"
            onSubmit={onSubmit}
            className="mt-2 flex items-center"
          >
            <label htmlFor="mobile-search" className="sr-only">
              Buscar películas
            </label>
            <input
              id="mobile-search"
              name="q"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar películas..."
              className="w-full px-3 py-2 border rounded-md text-sm bg-white/80 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </form>
        </div>
      </div>
    </header>
  );
}
