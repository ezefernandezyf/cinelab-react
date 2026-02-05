import { Link } from 'react-router-dom';
import type { MovieSummary } from '../../models';

type Props = {
  movie: MovieSummary;
};

export default function MovieCard({ movie }: Props) {
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : '../../assets/placeholder.png';

  return (
    <article
      className="flex flex-col md:flex-row gap-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg shadow-sm hover:shadow md:items-center"
      aria-label={`Movie ${movie.title}`}
    >
      <Link to={`/movie/${movie.id}`} className="flex-shrink-0">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-40 md:w-48 h-auto rounded-md object-cover"
          loading="lazy"
          width={192}
          height={288}
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
        </div>
      </div>
    </article>
  );
}
