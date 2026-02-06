import MovieCard from '../MovieCard/MovieCard';
import type { PagedResponse, MovieSummary } from '../../models/movie.model';

type Props = {
  data?: PagedResponse<MovieSummary> | null;
  loading?: boolean;
  error?: string | null; 
  onPageChange?: (page: number) => void;
};

export const MovieList = ({ data, loading, error, onPageChange }: Props) => {
  const page = data?.page ?? 1;
  const totalPages = data?.total_pages ?? 1;
  const totalResults = data?.total_results ?? 0;
  const hasResults = Boolean(data && data.results.length > 0);

  if (loading) return <div role="status">Cargando...</div>;
  if (error) return <div role="alert">{error}</div>;
  if (!loading && !hasResults) return <div>No hay resultados</div>;

  return (
    <section>
      <span className="sr-only" aria-live="polite">
        {data ? `${totalResults} resultados — página ${page} de ${totalPages}` : ''}
      </span>
      <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" data-testid="movie-list">
        {data?.results.map((movie) => (
          <li role="listitem" key={movie.id} data-testid="movie-item">
            <MovieCard movie={movie} />
          </li>
        ))}
      </ul>
      <div data-testid="pagination">
        {data && totalPages > 1 && (
          <nav aria-label="Paginación" data-testid="pagination">
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                type="button"
                aria-label="Previous page"
                disabled={!(data && page > 1)}
                className="px-3 py-1 rounded bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onClick={() => onPageChange?.(Math.max(1, page - 1))}
              >
                Prev
              </button>
              <span aria-current="page">
                Page {page} / {totalPages}
              </span>
              <button
                type="button"
                aria-label="Next page"
                disabled={!(data && (page ?? 1) < totalPages)}
                className="px-3 py-1 rounded bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
              >
                Next
              </button>
            </div>
          </nav>
        )}
      </div>
    </section>
  );
}
