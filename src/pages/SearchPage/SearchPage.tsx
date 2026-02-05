import { useEffect, useRef } from 'react';
import { SearchBar } from '../../components';
import useSearchMovies from '../../hooks/useSearchMovies';
import { useSearchParams } from 'react-router-dom';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';

  const { query, setQuery, searchTerm, data, loading, error, page, setPage, refetch } =
    useSearchMovies(q);

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

  return (
    <main style={{ padding: 16 }}>
      <h1 tabIndex={-1} ref={headingRef}>
        Buscar películas
      </h1>

      <section aria-labelledby="search-form">
        <SearchBar defaultValue={query} onSearch={handleSearch} />
      </section>

      <section aria-live="polite" aria-busy={loading} style={{ marginTop: 16 }}>
        {loading ? <div role="status">Cargando resultados…</div> : null}

        {error ? (
          <div role="alert" style={{ color: 'red' }}>
            Error: {String(error)}
          </div>
        ) : null}

        {!loading && data?.results?.length === 0 && (query ?? '') !== '' ? (
          <div role="status">No se encontraron resultados para "{searchTerm}".</div>
        ) : null}
        {searchTerm !== '' ? (
          <ul
            role="list"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 12,
              listStyle: 'none',
              padding: 0,
              marginTop: 12,
            }}
          >
            {data?.results?.map((m) => (
              <li
                key={m.id}
                role="listitem"
                style={{ border: '1px solid #eee', padding: 8, borderRadius: 6 }}
              >
                {m.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${m.poster_path}`}
                    alt={m.title}
                    style={{ width: '100%', height: 270, objectFit: 'cover', borderRadius: 4 }}
                  />
                ) : (
                  <div
                    style={{ width: '100%', height: 270, background: '#eee', borderRadius: 4 }}
                  />
                )}
                <h3 style={{ margin: '8px 0 4px', fontSize: 16 }}>{m.title}</h3>
                <div style={{ fontSize: 12, color: '#666' }}>
                  {m.release_date ? m.release_date.substring(0, 4) : '—'} • {m.vote_average}
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center' }}>
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}>
            Prev
          </button>

          <span style={{ margin: '0 8px' }}>
            Page {data?.page ?? page} / {data?.total_pages ?? 1}
          </span>

          <button onClick={() => setPage(page + 1)} disabled={page >= (data?.total_pages ?? 1)}>
            Next
          </button>

          <button onClick={() => refetch()} style={{ marginLeft: 12 }}>
            Refetch
          </button>
        </div>
      </section>
    </main>
  );
}
