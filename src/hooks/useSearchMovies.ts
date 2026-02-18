import { useCallback, useEffect, useState } from 'react';
import { searchMovies } from '../services/movie.service';
import useApi, { type UseApiOptions } from './useApi';
import type { MovieSummary, PagedResponse } from '../models';

export default function useSearchMovies(initialQuery = '', page = 1) {
  const [query, setQuery] = useState<string>(initialQuery);

  const [debouncedQuery, setDebouncedQuery] = useState<string>(initialQuery);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(id);
  }, [query]);

  const fetcher = useCallback(
    (signal?: AbortSignal) => searchMovies(debouncedQuery, page, signal),
    [debouncedQuery, page]
  );

  const initialPaged: PagedResponse<MovieSummary> = {
    page: 1,
    total_pages: 0,
    total_results: 0,
    results: [],
  };

  const options: UseApiOptions<PagedResponse<MovieSummary>> = {
    immediate: Boolean(debouncedQuery),
    initialData: initialPaged,
  };

  const { data, loading, error, refetch } = useApi<PagedResponse<MovieSummary>>(fetcher, options);

  return {
    query,
    setQuery,
    searchTerm: debouncedQuery,
    data,
    loading,
    error,
    page,
    refetch,
  };
}
