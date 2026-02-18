import { useEffect, useRef } from 'react';
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

  const { query, setQuery, data, loading, error, page, setPage } = useSearchMovies(q);

  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    if (q !== query) {
      setQuery(q);
      if (page !== 1) {
        setPage(1);
      }
      headingRef.current?.focus();
    }
  }, [q, query, setQuery, setPage, page]);

  const handleSearch = (newQ: string) => {
    setQuery(newQ);
    if (newQ) {
      setSearchParams({ q: newQ });
    } else {
      setSearchParams({});
    }
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);

    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (nextPage > 1) {
      params.set('page', String(nextPage));
    } else {
      params.delete('page');
    }
    setSearchParams(params);

    headingRef.current?.focus();
  };

  useEffect(() => {
    const pageFromParams = Number(searchParams.get('page') ?? 1);
    if (pageFromParams && pageFromParams !== page) {
      setPage(pageFromParams);
    }
  }, [searchParams, page, setPage]);

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
              Mostrando <span className="font-medium">{data.total_results}</span> resultados — página{' '}
              <span className="font-medium">{data.page}</span> de <span className="font-medium">{data.total_pages}</span>
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