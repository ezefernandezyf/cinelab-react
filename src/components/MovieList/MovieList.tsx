import MovieCard from '../MovieCard/MovieCard';
import type { PagedResponse, MovieSummary } from '../../models/movie.model';
import { useFavoritesContext } from '../../hooks/useFavoritesContext';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { SkeletonCard } from '../SkeletonCard/SkeletonCard';

type Props = {
  movies?: MovieSummary[];
  data?: PagedResponse<MovieSummary> | null;
  loading?: boolean;
  error?: string | null;
  onPageChange?: (page: number) => void;
};

export const MovieList = ({ data, loading, error, onPageChange, movies }: Props) => {
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const page = data?.page ?? 1;
  const totalPages = data?.total_pages ?? 1;
  const totalResults = data?.total_results ?? 0;

  const list: MovieSummary[] = movies ?? data?.results ?? [];

  // Loading state: skeleton placeholders
  if (loading) {
    const skeletonCount = 8;
    return (
      <section>
        <ul
          role="list"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr"
          aria-hidden
        >
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <li key={i} className="h-full min-h-0">
              <SkeletonCard />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (error)
    return (
      <div role="alert" className="text-red-400">
        {error}
      </div>
    );

  if (!list || list.length === 0) {
    return (
      <p className="text-center text-sm text-slate-500 dark:text-slate-300">No hay resultados.</p>
    );
  }

  return (
    <section aria-labelledby="results-heading">
      <h2 id="results-heading" className="sr-only">
        Resultados de búsqueda
      </h2>

      <span className="sr-only" aria-live="polite">
        {data ? `${totalResults} resultados — página ${page} de ${totalPages}` : ''}
      </span>

      <ul
        role="list"
        data-testid="movie-list"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr"
      >
        {list.map((movie) => (
          <li role="listitem" key={movie.id} data-testid="movie-item" className="h-full min-h-0">
            {/* wrapper to apply animation without changing MovieCard internals */}
            <div className="h-full motion-safe:animate-fade-in-up">
              <MovieCard
                movie={movie}
                isFavorite={isFavorite(movie.id)}
                onToggleFavorite={() => toggleFavorite(movie.id)}
              />
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center">
        {data && totalPages > 1 && (
          <nav aria-label="Paginación">
            <div className="inline-flex items-center gap-3">
              <button
                type="button"
                aria-label="Página previa"
                disabled={!(data && page > 1)}
                onClick={() => onPageChange?.(Math.max(1, page - 1))}
                className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <ChevronLeftIcon className="w-5 h-5" aria-hidden />
                <span className="sr-only">Anterior</span>
                <span className="hidden sm:inline">Prev</span>
              </button>

              <div className="text-sm">
                <span className="font-medium">{page}</span>
                <span className="mx-2 text-slate-400">/</span>
                <span className="text-slate-500 dark:text-slate-300">{totalPages}</span>
              </div>

              <button
                type="button"
                aria-label="Página siguiente"
                disabled={!(data && page < totalPages)}
                onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
                className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRightIcon className="w-5 h-5" aria-hidden />
              </button>
            </div>
          </nav>
        )}
      </div>
    </section>
  );
};
