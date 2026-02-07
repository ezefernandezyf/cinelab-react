import { Link } from 'react-router-dom';
import { MovieList } from '../../components';
import useFavoriteMovies from '../../hooks/useFavoriteMovies';
import useFavorites  from '../../hooks/useFavorites';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const { movies, loading, error } = useFavoriteMovies(favorites);

  if (loading) return <div role="status">Cargando favoritos...</div>;
  if (error) return <div role="alert">{error}</div>;
  if (!favorites || favorites.length === 0) {
    return (
      <main>
        <h1>Tus favoritos</h1>
        <p>No tenés películas favoritas todavía.</p>
        <Link to="/search">Buscar películas</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Tus favoritos</h1>
      <MovieList movies={movies} />
    </main>
  );
}
