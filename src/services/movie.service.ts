import type { CreditsResponse, MovieDetails, MovieSummary, PagedResponse } from '../models';
import { apiGet } from './api';

export async function searchMovies(
  query: string,
  page = 1,
  signal?: AbortSignal
): Promise<PagedResponse<MovieSummary>> {
  const response = await apiGet<PagedResponse<MovieSummary>>('/search/movie', {
    params: { query, page, language: 'es-ES', include_adult: false },
    signal,
  });

  return response;
}

export async function getMovie(id: number, signal?: AbortSignal): Promise<MovieDetails> {
  const response = await apiGet<MovieDetails>(`/movie/${id}`, {
    params: { language: 'es-ES' },
    signal,
  });

  return response;
}

export async function getCredits(id: number, signal?: AbortSignal): Promise<CreditsResponse> {
  return apiGet<CreditsResponse>(`/movie/${id}/credits`, {
    params: { language: 'es-ES' },
    signal,
  });
}

export async function getSimilar(
  id: number,
  page = 1,
  signal?: AbortSignal
): Promise<PagedResponse<MovieSummary>> {
  return apiGet<PagedResponse<MovieSummary>>(`/movie/${id}/similar`, {
    params: { language: 'es-ES', page },
    signal,
  });
}
