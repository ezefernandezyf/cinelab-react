import { useCallback } from 'react';
import type { CreditsResponse, MovieDetails, MovieSummary, PagedResponse } from '../models';
import { getMovie, getCredits, getSimilar } from '../services';
import useApi from './useApi';

type MovieDetailPayload = {
  details: MovieDetails;
  credits: CreditsResponse;
  similar: PagedResponse<MovieSummary>;
};

export default function useMovieDetail(id?: number) {
  const fetcher = useCallback(
    async (signal?: AbortSignal): Promise<MovieDetailPayload> => {
      if (!id) throw new Error('Invalid movie id');
      const [details, credits, similar] = await Promise.all([
        getMovie(id, signal),
        getCredits(id, signal),
        getSimilar(id, 1, signal),
      ]);
      return { details, credits, similar };
    },
    [id]
  );

  const { data, loading, error, refetch } = useApi<MovieDetailPayload>(fetcher, {
    immediate: Boolean(id),
    initialData: null,
  });

  return {
    details: data?.details ?? null,
    credits: data?.credits ?? null,
    similar: data?.similar ?? null,
    loading,
    error,
    refetch,
  };
}
