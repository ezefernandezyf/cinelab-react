import { useCallback } from 'react';
import type {
  CreditsResponse,
  MovieDetails,
  MovieSummary,
  PagedResponse,
  VideosResponse,
} from '../models';
import { getMovie, getCredits, getSimilar, getVideos } from '../services';
import useApi from './useApi';

type MovieDetailPayload = {
  details: MovieDetails;
  credits: CreditsResponse;
  similar: PagedResponse<MovieSummary>;
  videos: VideosResponse;
};

export default function useMovieDetail(id?: number) {
  const fetcher = useCallback(
    async (signal?: AbortSignal): Promise<MovieDetailPayload> => {
      if (!id) throw new Error('Invalid movie id');
      const [details, credits, similar, videos] = await Promise.all([
        getMovie(id, signal),
        getCredits(id, signal),
        getSimilar(id, 1, signal),
        getVideos(id, signal),
      ]);
      return { details, credits, similar, videos };
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
    videos: data?.videos ?? null,
    trailerKey:
      data?.videos?.results?.find((v) => v.type === 'Trailer' && v.site === 'YouTube')?.key ??
      undefined,
    loading,
    error,
    refetch,
  };
}
