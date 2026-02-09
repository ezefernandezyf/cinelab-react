import { useCallback, useMemo } from 'react';
import type { MovieSummary } from '../models';
import { getMovie } from '../services';
import useApi, { type UseApiOptions } from './useApi';

export default function useFavoriteMovies(ids?: number[]) {
  const idsKey = useMemo(() => (ids && ids.length ? JSON.stringify(ids) : ''), [ids]);

  const fetcher = useCallback(
    async (signal?: AbortSignal) => {
      const idsList = idsKey ? (JSON.parse(idsKey) as number[]) : [];
      if (!idsList.length) return [] as MovieSummary[];
      const results = await Promise.all(idsList.map((id) => getMovie(id, signal)));
      return results as MovieSummary[];
    },
    [idsKey]
  );

  const options: UseApiOptions<MovieSummary[]> = {
    immediate: Boolean(ids && ids.length),
    initialData: [],
  };

  const { data, loading, error, refetch } = useApi<MovieSummary[]>(fetcher, options);

  return {
    movies: data ?? [],
    loading,
    error: error ? String(error) : null,
    refetch,
  };
}