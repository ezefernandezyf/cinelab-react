import { Link } from 'react-router-dom';

export const HomePage = (): React.JSX.Element => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="pb-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-slate-100">
          Bienvenido a CineLab
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Explora películas, guarda tus favoritas y mira trailers.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="card p-6">
            <h2 className="text-xl font-medium mb-2">Descubre películas</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Busca por título, navega por recomendaciones o revisa tus favoritas.
            </p>

            <div className="mt-4 flex gap-3">
              <Link
                to="/search"
                className="inline-flex items-center px-4 py-2 rounded-md bg-cinematic-action text-white hover:bg-cinematic-action-600 focus:outline-none focus:ring-2 focus:ring-cinematic-action-600 transition"
              >
                Buscar películas
              </Link>

              <Link
                to="/favorites"
                className="inline-flex items-center px-4 py-2 rounded-md border"
                style={{ borderColor: 'var(--border)' }}
              >
                Ver favoritos
              </Link>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-lg font-medium">Últimas actividades</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Contenido de ejemplo / placeholder.
            </p>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card p-4">
            <h4 className="text-sm font-medium">Tus favoritos</h4>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Rápido acceso a lo guardado.
            </p>
          </div>

          <div className="card p-4">
            <h4 className="text-sm font-medium">Recomendado</h4>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Películas que podrían gustarte.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};

