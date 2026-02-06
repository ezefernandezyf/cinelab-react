import { Link } from 'react-router-dom';
import type { MovieSummary } from '../../models';
import placeholder from '../../../public/placeholder.png';

type Props = {
  movie: MovieSummary;
  isFavorite?: boolean;
  onToggleFavorite?: (movieId: number) => void;
  onViewDetail?: (movieId: number) => void;
};

export default function MovieCard({
  movie,
  isFavorite = false,
  onToggleFavorite,
  onViewDetail,
}: Props) {
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : placeholder;

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggleFavorite?.(movie.id);
  };

  const handleView = (e: React.MouseEvent) => {
    onViewDetail?.(movie.id);
  };

  return (
    <article
      data-testid="movie-card"
      className="flex flex-col md:flex-row gap-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg shadow-sm hover:shadow md:items-center"
      aria-label={`Movie ${movie.title}`}
    >
      <Link to={`/movie/${movie.id}`} className="flex-shrink-0" onClick={handleView}>
        <img
          src={posterUrl}
          alt={`Poster de ${movie.title}`}
          className="w-40 md:w-48 h-auto rounded-md object-cover"
          loading="lazy"
          width={192}
          height={288}
          decoding="async"
        />
      </Link>

      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-base md:text-lg font-semibold leading-tight text-slate-900 dark:text-slate-100">
            {movie.title}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {year || 'Fecha desconocida'} •{' '}
            <span className="font-medium">{movie.vote_average ?? '—'}</span>
          </p>
        </div>

        <div className="mt-3 md:mt-0">
          <Link
            to={`/movie/${movie.id}`}
            className="inline-block px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
            aria-label={`Ver detalles de ${movie.title}`}
          >
            Ver detalles
          </Link>

          <button
            data-testid="favorite-btn"
            type="button"
            aria-pressed={isFavorite}
            aria-label={
              isFavorite
                ? `Quitar ${movie.title} de favoritos`
                : `Agregar ${movie.title} a favoritos`
            }
            onClick={handleToggleFav}
            className={`inline-flex items-center px-3 py-1 text-sm rounded ${
              isFavorite
                ? 'bg-amber-300 text-slate-900'
                : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100'
            } focus:outline-none focus:ring-2 focus:ring-indigo-400`}
          >
            {isFavorite ? '★ Favorito' : '☆ Favorito'}
          </button>
        </div>
      </div>
    </article>
  );
}
