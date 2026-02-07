import React, { useCallback, useMemo } from 'react';
import MovieCard from '../../components/MovieCard/MovieCard';
import useFavorites from '../../hooks/useFavorites';
import useFavoriteMovies from '../../hooks/useFavoriteMovies';
import ToastContainer from '../../components/Toast/Toast';
import useToast from '../../hooks/useToast';
import { Link } from 'react-router-dom';
import type { MovieSummary } from '../../models/movie.model';

export default function FavoritesPage() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
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

  if (loading) return <div role="status">Cargando favoritos...</div>;
  if (error) return <div role="alert">{String(error)}</div>;

  if (!favorites || favorites.length === 0) {
    return (
      <main>
        <h1 className="text-2xl font-semibold mb-4">Tus favoritos</h1>
        <p>No tenés películas favoritas todavía.</p>
        <Link to="/search" className="inline-block mt-4 text-indigo-600">
          Buscar películas
        </Link>
      </main>
    );
  }

  return (
    <main>
      <h1 className="text-2xl font-semibold mb-4">Tus favoritos</h1>

      <section>
        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayedMovies.map((m) => (
            <li key={m.id} role="listitem">
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
