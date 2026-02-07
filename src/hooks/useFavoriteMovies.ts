import { useCallback, useMemo, useState } from 'react';
import type { MovieSummary } from '../models';
import { getMovie } from '../services';
import useApi from './useApi';

type Props = {
  movies: MovieSummary[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export default function useFavoriteMovies(ids?: number[]): Props {
  const idsKey = useMemo(() => (ids && ids.length ? JSON.stringify(ids) : ''), [ids]);

  const fetcher = useCallback(
    async (signal?: AbortSignal) => {
      if (!ids || ids.length === 0) return [] as MovieSummary[];
      // Llamamos al service que ya acepta signal
      const results = await Promise.all(ids.map((id) => getMovie(id, signal)));
      return results as MovieSummary[];
    },

    [idsKey]
  );
  const { data, loading, error, refetch } = useApi<MovieSummary[]>(fetcher, {
    immediate: Boolean(ids && ids.length),
    deps: [idsKey],
    initialData: [],
  });

  return {
    movies: data ?? [],
    loading,
    error: error ? String(error) : null,
    refetch,
  };
}
