import { useEffect, useRef, useState } from 'react';
import { SearchBar } from '../../components';
import useSearchMovies from '../../hooks/useSearchMovies';
import { useSearchParams } from 'react-router-dom';
import { MovieList } from '../../components';

function formatError(e: unknown): string | null {
  if (e == null) return null;
  if (typeof e === 'string') return e;
  if (e instanceof Error) return e.message;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const pageFromParams = Number(searchParams.get('page') ?? 1);

  // PAGE: local state controlled by SearchPage (single source of truth)
  const [page, setPage] = useState<number>(pageFromParams);

  const { query, setQuery, data, loading, error } = useSearchMovies(q, page);

  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (!pageFromParams || pageFromParams === page) return;
    const id = window.setTimeout(() => {
      setPage(pageFromParams);
    }, 0);

    return () => clearTimeout(id);
  }, [pageFromParams, page]);

  useEffect(() => {
    if (q !== query) {
      setQuery(q);
      headingRef.current?.focus();
    }
  }, [q, query, setQuery]);

  const handleSearch = (newQ: string) => {
    setQuery(newQ);
    const params = new URLSearchParams();
    if (newQ) params.set('q', newQ);
    setSearchParams(params);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);

    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (nextPage > 1) params.set('page', String(nextPage));
    setSearchParams(params);

    headingRef.current?.focus();
  };

  const errorMessage = formatError(error);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-6">
        <h1
          tabIndex={-1}
          ref={headingRef}
          className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100"
        >
          Buscar películas
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Busca por título para encontrar películas y acceder a sus detalles.
        </p>
      </header>

      <section aria-labelledby="search-form" className="mb-6">
        <div className="max-w-2xl">
          <SearchBar defaultValue={query} onSearch={handleSearch} />
        </div>
      </section>

      {data && (
        <div className="mb-4 text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
          {data.total_results > 0 ? (
            <>
              Mostrando <span className="font-medium">{data.total_results}</span> resultados —
              página <span className="font-medium">{data.page}</span> de{' '}
              <span className="font-medium">{data.total_pages}</span>
            </>
          ) : (
            <>No se encontraron resultados.</>
          )}
        </div>
      )}

      <section aria-live="polite" aria-busy={loading}>
        <MovieList
          data={data}
          loading={loading}
          error={errorMessage}
          onPageChange={handlePageChange}
        />
      </section>
    </main>
  );
}
