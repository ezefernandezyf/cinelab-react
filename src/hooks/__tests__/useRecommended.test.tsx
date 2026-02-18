import { render, cleanup, act } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import type { MovieSummary, PagedResponse } from '../../models/movie.model';

type LocalUseApiOptions = { immediate?: boolean; initialData?: unknown | null };
type UseApiReturn<T> = {
  data: T | null;
  loading: boolean;
  error: unknown;
  refetch: () => Promise<unknown>;
};

let mockGetPopular: ReturnType<typeof vi.fn>;
let mockUseApi: ReturnType<typeof vi.fn>;
let lastFetcher: ((signal?: AbortSignal) => Promise<MovieSummary[]>) | undefined;
let useRecommendedMovies: (limit?: number) => {
  movies: MovieSummary[];
  loading: boolean;
  error: unknown;
  refetch: () => Promise<unknown>;
};

const initialPaged: PagedResponse<MovieSummary> = {
  page: 1,
  total_pages: 1,
  total_results: 6,
  results: [
    { id: 1, title: 'A', poster_path: null, vote_average: 6, release_date: '' },
    { id: 2, title: 'B', poster_path: null, vote_average: 7, release_date: '' },
    { id: 3, title: 'C', poster_path: null, vote_average: 8, release_date: '' },
    { id: 4, title: 'D', poster_path: null, vote_average: 5, release_date: '' },
    { id: 5, title: 'E', poster_path: null, vote_average: 6, release_date: '' },
    { id: 6, title: 'F', poster_path: null, vote_average: 9, release_date: '' },
  ],
};

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
  vi.useRealTimers();
});

beforeEach(async () => {
  vi.resetModules();

  mockGetPopular = vi.fn().mockResolvedValue(initialPaged);

  lastFetcher = undefined;
  mockUseApi = vi
    .fn()
    .mockImplementation(
      (
        fetcher: (signal?: AbortSignal) => Promise<unknown>,
        options?: LocalUseApiOptions
      ): UseApiReturn<MovieSummary[]> => {
        lastFetcher = fetcher as (signal?: AbortSignal) => Promise<MovieSummary[]>;
        return {
          data: (options?.initialData as MovieSummary[]) ?? null,
          loading: false,
          error: null,
          refetch: async () => fetcher(),
        };
      }
    );

  vi.doMock('../../services/movie.service', () => ({ getPopular: mockGetPopular }));
  vi.doMock('../useApi', () => ({ default: mockUseApi }));

  const mod = await import('../useRecommended');
  useRecommendedMovies = mod.default;
});

describe('useRecommendedMovies hook', () => {
  it('usa useApi con immediate=true y initialData=[]', () => {
    function TestComponent() {
      useRecommendedMovies(4);
      return null;
    }
    render(<TestComponent />);

    expect(mockUseApi).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ immediate: true, initialData: [] })
    );
  });

  it('fetcher llama getPopular(1, signal) y recorta a "limit" elementos', async () => {
    function TestComponent() {
      useRecommendedMovies(4);
      return null;
    }
    render(<TestComponent />);

    expect(typeof lastFetcher).toBe('function');
    const fetcher = lastFetcher!;
    const signal = new AbortController().signal;

    const result = await act(async () => await fetcher(signal));

    expect(mockGetPopular).toHaveBeenCalledWith(1, signal);
    expect(result).toHaveLength(4);
    expect(result.map((m) => m.id)).toEqual([1, 2, 3, 4]);
  });

  it('maneja resultados vacíos sin romper', async () => {
    mockGetPopular.mockResolvedValueOnce({
      page: 1,
      total_pages: 0,
      total_results: 0,
      results: [],
    });

    function TestComponent() {
      useRecommendedMovies(4);
      return null;
    }
    render(<TestComponent />);

    const fetcher = lastFetcher!;
    const result = await act(async () => await fetcher());

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });
});
