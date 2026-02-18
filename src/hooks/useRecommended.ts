import { useCallback } from 'react';
import useApi, { type UseApiOptions } from './useApi';
import { getPopular } from '../services/movie.service';
import type { MovieSummary, PagedResponse } from '../models';

type RecommendedResult = MovieSummary[];

export default function useRecommendedMovies(limit = 4) {
  const fetcher = useCallback(
    async (signal?: AbortSignal): Promise<RecommendedResult> => {
      const res: PagedResponse<MovieSummary> = await getPopular(1, signal);
      return (res.results ?? []).slice(0, limit);
    },
    [limit]
  );

  const options: UseApiOptions<RecommendedResult> = {
    immediate: true,
    initialData: [],
  };

  const { data, loading, error, refetch } = useApi<RecommendedResult>(fetcher, options);

  return {
    movies: data ?? [],
    loading,
    error,
    refetch,
  };
}
