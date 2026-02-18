import React from 'react';
import { Link } from 'react-router-dom';
import { useFavoritesContext } from '../../hooks/useFavoritesContext';
import useFavoriteMovies from '../../hooks/useFavoriteMovies';
import useRecommendedMovies from '../../hooks/useRecommended';
import { HeartIcon, SparklesIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const HomePage = (): React.JSX.Element => {
  const { favorites } = useFavoritesContext();
  const { movies: favMovies, loading: favLoading } = useFavoriteMovies(favorites);
  const { movies: recMovies, loading: recLoading } = useRecommendedMovies(4);

  const topFavorites = favMovies?.slice(0, 3) ?? [];

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
        {/* Hero */}
        <div className="md:col-span-2 space-y-4">
          <div className="card p-6">
            <div className="flex items-start gap-3">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-cinematic-action/10 text-cinematic-action">
                <MagnifyingGlassIcon className="w-5 h-5" aria-hidden />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-medium">Descubre películas</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Busca por título, navega por recomendaciones o revisa tus favoritas.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/search"
                className="inline-flex items-center px-4 py-2 rounded-md bg-cinematic-action text-white hover:bg-cinematic-action-600 focus:outline-none focus:ring-2 focus:ring-cinematic-action-600 transition motion-safe:duration-200"
              >
                Buscar películas
              </Link>

              <Link
                to="/favorites"
                className="inline-flex items-center px-4 py-2 rounded-md border hover:bg-[var(--surface)]"
                style={{ borderColor: 'var(--border)' }}
              >
                Ver favoritos
              </Link>
            </div>
          </div>
        </div>

        {/* Aside widgets */}
        <aside className="space-y-4">
          {/* Favoritos */}
          <div className="card p-4">
            <div className="flex items-center gap-2">
              <HeartIcon className="w-4 h-4 text-slate-700 dark:text-slate-300" aria-hidden />
              <h4 className="text-sm font-medium">Tus favoritos</h4>
            </div>

            {favLoading ? (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Cargando...</p>
            ) : topFavorites.length === 0 ? (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                No tenés favoritos aún.
              </p>
            ) : (
              <ul role="list" className="mt-3 space-y-2">
                {topFavorites.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center gap-3 rounded-md p-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Link
                      to={`/movie/${m.id}`}
                      state={{ from: '/' }}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-12 h-16 overflow-hidden rounded">
                        <img
                          src={
                            m.poster_path
                              ? `https://image.tmdb.org/t/p/w92${m.poster_path}`
                              : '/placeholder.png'
                          }
                          alt={m.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-slate-800 dark:text-slate-100">
                          {m.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {m.release_date?.slice(0, 4)}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-3">
              <Link
                to="/favorites"
                className="text-sm text-cinematic-action underline underline-offset-2 hover:no-underline transition"
              >
                Ver todos
              </Link>
            </div>
          </div>

          {/* Recomendado */}
          <div className="card p-4">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-slate-700 dark:text-slate-300" aria-hidden />
              <h4 className="text-sm font-medium">Recomendado</h4>
            </div>

            {recLoading ? (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Cargando recomendaciones...
              </p>
            ) : recMovies.length === 0 ? (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Sin recomendaciones disponibles.
              </p>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {recMovies.map((m) => (
                  <Link
                    key={m.id}
                    to={`/movie/${m.id}`}
                    state={{ from: '/' }}
                    className="block group focus:outline-none focus:ring-2 focus:ring-cinematic-action rounded-md"
                  >
                    <div className="w-full h-28 overflow-hidden rounded-md bg-[var(--surface)]">
                      <img
                        src={
                          m.poster_path
                            ? `https://image.tmdb.org/t/p/w154${m.poster_path}`
                            : '/placeholder.png'
                        }
                        alt={m.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="sr-only">{m.title}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default HomePage;
