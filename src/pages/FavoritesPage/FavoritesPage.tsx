import { useCallback, useMemo } from 'react';
import MovieCard from '../../components/MovieCard/MovieCard';
import useFavoriteMovies from '../../hooks/useFavoriteMovies';
import ToastContainer from '../../components/Toast/Toast';
import useToast from '../../hooks/useToast';
import { Link } from 'react-router-dom';
import type { MovieSummary } from '../../models/movie.model';
import { useFavoritesContext } from '../../hooks/useFavoritesContext';
import { SkeletonCard }  from '../../components/SkeletonCard/SkeletonCard';

export default function FavoritesPage(): React.JSX.Element {
  const { favorites, isFavorite, toggleFavorite } = useFavoritesContext();
  const { movies, loading, error } = useFavoriteMovies(favorites);
  const { toasts, addToast, removeToast } = useToast();

  const displayedMovies = useMemo(() => {
    const favSet = new Set(favorites);
    return movies.filter((m) => favSet.has(m.id));
  }, [movies, favorites]);

  const handleToggleFromFavorites = useCallback(
    (movie: MovieSummary) => {
      if (isFavorite(movie.id)) {
        toggleFavorite(movie.id);

        addToast({
          message: `Eliminaste de favoritos "${movie.title}"`,
          actionLabel: 'Deshacer',
          onAction: () => {
            toggleFavorite(movie.id);
          },
          autoHideMs: 5000,
        });
      } else {
        toggleFavorite(movie.id);
      }
    },
    [isFavorite, toggleFavorite, addToast]
  );

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Tus favoritos</h1>
        </header>

        <section aria-live="polite" aria-busy>
          <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="h-full min-h-0">
                <SkeletonCard />
              </li>
            ))}
          </ul>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold mb-4">Tus favoritos</h1>
        <div role="alert" className="text-red-600">
          {String(error)}
        </div>
      </main>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-semibold mb-2">Tus favoritos</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          No tenés películas favoritas todavía.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/search"
            className="inline-flex items-center px-4 py-2 rounded-md bg-cinematic-action text-white hover:bg-cinematic-action-600 focus:outline-none focus:ring-2 focus:ring-cinematic-action-600 transition"
          >
            Buscar películas
          </Link>

          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cinematic-action transition"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Tus favoritos</h1>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {favorites.length} {favorites.length === 1 ? 'película' : 'películas'}
        </div>
      </header>

      <section>
        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayedMovies.map((m) => (
            <li key={m.id} role="listitem" className="h-full min-h-0">
              <MovieCard
                movie={m}
                isFavorite={true}
                onToggleFavorite={() => handleToggleFromFavorites(m)}
              />
            </li>
          ))}
        </ul>
      </section>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </main>
  );
}