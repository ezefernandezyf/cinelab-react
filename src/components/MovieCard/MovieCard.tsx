import { Link, useLocation } from 'react-router-dom';
import type { MovieSummary } from '../../models';
import placeholder from '../../../public/placeholder.png';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

type Props = {
  movie: MovieSummary;
  isFavorite?: boolean;
  onToggleFavorite?: (movieId: number) => void;
};

export default function MovieCard({ movie, isFavorite = false, onToggleFavorite }: Props) {
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : placeholder;

  const handleToggleFav = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(movie.id);
  };

  const location = useLocation();

  return (
    <article
      data-testid="movie-card"
      className="flex flex-col md:flex-row gap-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200"
      aria-label={`Movie ${movie.title}`}
    >
      <Link
        to={`/movie/${movie.id}`}
        className="flex-shrink-0 block w-full md:w-40 lg:w-48"
        state={{ from: location.pathname }}
        aria-hidden={false}
      >
        
        <div className="w-full h-64 sm:h-72 md:h-48 lg:h-64 overflow-hidden rounded-md bg-black">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
            width={342}
            height={513}
            decoding="async"
          />
        </div>
      </Link>

      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <h3
            data-testid="movie-title"
            className="text-base md:text-lg font-semibold leading-tight text-slate-900 dark:text-slate-100 truncate"
            title={movie.title}
          >
            {movie.title}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {year || 'Fecha desconocida'} • <span className="font-medium">{movie.vote_average ?? '—'}</span>
          </p>
        </div>

        <div className="mt-3 md:mt-0 flex items-center justify-between">
          <Link
            to={`/movie/${movie.id}`}
            className="inline-block px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label={`Ver detalles de ${movie.title}`}
            state={{ from: location.pathname }}
          >
            Ver detalles
          </Link>

          {/* Star-only favorite button */}
          <button
            data-testid="favorite-btn"
            type="button"
            aria-pressed={isFavorite}
            aria-label={
              isFavorite ? `Quitar ${movie.title} de favoritos` : `Agregar ${movie.title} a favoritos`
            }
            onClick={handleToggleFav}
            className={`inline-flex items-center justify-center p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 ${
              isFavorite
                ? 'bg-amber-300 text-slate-900 focus:ring-amber-400'
                : 'bg-transparent text-slate-700 dark:text-slate-200 focus:ring-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title={isFavorite ? 'Favorito' : 'Agregar a favoritos'}
          >
            {/* Icon swap for filled/outline */}
            {isFavorite ? (
              <StarSolid className="w-5 h-5" aria-hidden />
            ) : (
              <StarOutline className="w-5 h-5" aria-hidden />
            )}
            {/* visually hidden text for screen readers if you want (optional)
            <span className="sr-only">{isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}</span>
            */}
          </button>
        </div>
      </div>
    </article>
  );
}