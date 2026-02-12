import { useEffect, useRef } from 'react';
import { SearchBar } from '../../components';
import useSearchMovies from '../../hooks/useSearchMovies';
import { useSearchParams } from 'react-router-dom';
import { MovieList } from '../../components';

function formatError(e: unknown): string | null {
  if (e == null) return null; // null or undefined
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
    <main style={{ padding: 16 }}>
      <h1 tabIndex={-1} ref={headingRef}>
        Buscar películas
      </h1>

      <section aria-labelledby="search-form">
        <SearchBar defaultValue={query} onSearch={handleSearch} />
      </section>

      <section aria-live="polite" aria-busy={loading} style={{ marginTop: 16 }}>
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
