import { useCallback, useEffect, useState } from 'react';
import { searchMovies } from '../services/movie.service';
import useApi from './useApi';
import type { MovieSummary, PagedResponse } from '../models';

type UseSearchMoviesResult = {
  query: string;
  setQuery: (q: string) => void;
  searchTerm: string;
  data: PagedResponse<MovieSummary> | null;
  loading: boolean;
  error: unknown | null;
  page: number;
  setPage: (p: number) => void;
  refetch: () => Promise<void>;
};

export default function useSearchMovies(initialQuery = ''): UseSearchMoviesResult {
  const [query, setQuery] = useState<string>(initialQuery);
  const [page, setPage] = useState<number>(1);

  const [debouncedQuery, setDebouncedQuery] = useState<string>(initialQuery);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const fetcher = useCallback(
    (signal?: AbortSignal) => {
      return searchMovies(debouncedQuery, page, signal);
    },
    [debouncedQuery, page]
  );

  const initialPaged: PagedResponse<MovieSummary> = {
    page: 1,
    total_pages: 0,
    total_results: 0,
    results: [],
  };

  const { data, loading, error, refetch } = useApi<PagedResponse<MovieSummary>>(fetcher, {
    immediate: Boolean(query),
    deps: [debouncedQuery, page],
    initialData: initialPaged,
  });

  return {
    query,
    setQuery,
    searchTerm: debouncedQuery,
    data,
    loading,
    error,
    page,
    setPage,
    refetch,
  };
}
