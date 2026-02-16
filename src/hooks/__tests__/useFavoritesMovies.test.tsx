import { render, act, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import type { MovieSummary } from '../../models/movie.model';

const initialMovies: MovieSummary[] = [
  { id: 1, title: 'One', poster_path: null, vote_average: 5, release_date: '' },
  { id: 2, title: 'Two', poster_path: null, vote_average: 5, release_date: '' },
];

type LocalUseApiOptions = { immediate?: boolean; initialData?: unknown | null };
type UseApiReturn = {
  data: unknown | null;
  loading: boolean;
  error: unknown;
  refetch: () => Promise<unknown>;
};

let mockGetMovie: ReturnType<typeof vi.fn>;
let mockUseApi: ReturnType<typeof vi.fn>;
let lastFetcher: ((signal?: AbortSignal) => Promise<unknown>) | undefined;
let useFavoriteMovies: (ids?: number[]) => {
  movies: MovieSummary[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<unknown>;
};

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
  vi.useRealTimers();
});

beforeEach(async () => {
  vi.resetModules();

  mockGetMovie = vi
    .fn()
    .mockImplementationOnce(async () => ({ ...initialMovies[0] }))
    .mockImplementationOnce(async () => ({ ...initialMovies[1] }));

  mockUseApi = vi
    .fn()
    .mockImplementation(
      (
        fetcher: (signal?: AbortSignal) => Promise<unknown>,
        options?: LocalUseApiOptions
      ): UseApiReturn => {
        lastFetcher = fetcher;
        return {
          data: options?.initialData ?? null,
          loading: false,
          error: null,
          refetch: async () => fetcher(),
        };
      }
    );

  vi.doMock('../../services', () => ({ getMovie: mockGetMovie }));
  vi.doMock('../useApi', () => ({ default: mockUseApi }));

  const mod = await import('../useFavoriteMovies');
  useFavoriteMovies = mod.default;
});

describe('useFavoriteMovies (refactor: shared setup)', () => {
  it('immediate option follows ids presence', () => {
    function ComponentEmpty() {
      useFavoriteMovies([]);
      return null;
    }
    render(<ComponentEmpty />);
    expect(mockUseApi).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ immediate: false })
    );

    mockUseApi.mockClear();

    function ComponentWithIds() {
      useFavoriteMovies([1, 2]);
      return null;
    }
    render(<ComponentWithIds />);
    expect(mockUseApi).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ immediate: true })
    );
  });

  it('fetcher calls getMovie for each id and returns array (uses signal)', async () => {
    function Component() {
      useFavoriteMovies([1, 2]);
      return null;
    }
    render(<Component />);

    expect(typeof lastFetcher).toBe('function');
    const fetcher = lastFetcher!;
    const signal = new AbortController().signal;

    const result = await act(async () => (await fetcher(signal)) as MovieSummary[]);
    expect(mockGetMovie).toHaveBeenNthCalledWith(1, 1, signal);
    expect(mockGetMovie).toHaveBeenNthCalledWith(2, 2, signal);
    expect(result).toEqual(initialMovies);
  });

  it('fetcher returns [] and does not call getMovie when ids empty/undefined', async () => {
    function ComponentNoIds() {
      useFavoriteMovies();
      return null;
    }
    render(<ComponentNoIds />);

    const fetcher = lastFetcher!;
    const result = await act(async () => (await fetcher()) as MovieSummary[]);
    expect(result).toEqual([]);
    expect(mockGetMovie).not.toHaveBeenCalled();
  });
});
