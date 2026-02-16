import { render, act, screen, cleanup } from '@testing-library/react';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';

type MovieDetailPayload = {
  details: { id: number; title?: string; [k: string]: unknown };
  credits: { cast?: unknown[]; crew?: unknown[] } | null;
  similar: {
    page: number;
    results: unknown[];
    total_pages?: number;
    total_results?: number;
  } | null;
  videos: { results: Array<{ id: string; key: string; site?: string; type?: string }> } | null;
};

type MockApiOptions<T> = {
  immediate?: boolean;
  initialData?: T | null;
};

type UseApiReturn<T> = {
  data: T | null;
  loading: boolean;
  error: unknown;
  refetch: () => Promise<unknown>;
};

type UseApiFn = (
  fetcher: (signal?: AbortSignal) => Promise<MovieDetailPayload>,
  options?: MockApiOptions<MovieDetailPayload>
) => UseApiReturn<MovieDetailPayload>;


let mockGetMovie: ReturnType<typeof vi.fn>;
let mockGetCredits: ReturnType<typeof vi.fn>;
let mockGetSimilar: ReturnType<typeof vi.fn>;
let mockGetVideos: ReturnType<typeof vi.fn>;

let mockUseApiFn: ReturnType<typeof vi.fn>;
let mockUseApi: UseApiFn;

let lastFetcher: ((signal?: AbortSignal) => Promise<MovieDetailPayload>) | undefined;

let useMovieDetail: typeof import('../useMovieDetail').default;

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

beforeEach(async () => {
  vi.resetModules();
  lastFetcher = undefined;

  const movieDetailsExample = { id: 1, title: 'MovieOne' };
  const creditsExample = { cast: [], crew: [] };
  const similarExample = { page: 1, results: [], total_pages: 1, total_results: 0 };
  const videosExample = { results: [{ id: 'v1', key: 'YTKEY123', site: 'YouTube', type: 'Trailer' }] };

  mockGetMovie = vi.fn().mockResolvedValue(movieDetailsExample);
  mockGetCredits = vi.fn().mockResolvedValue(creditsExample);
  mockGetSimilar = vi.fn().mockResolvedValue(similarExample);
  mockGetVideos = vi.fn().mockResolvedValue(videosExample);

  mockUseApiFn = vi.fn().mockImplementation(
    (fetcher: (signal?: AbortSignal) => Promise<MovieDetailPayload>, options?: MockApiOptions<MovieDetailPayload>) => {
      lastFetcher = fetcher;
      return {
        data: options?.initialData ?? null,
        loading: false,
        error: null,
        refetch: async () => fetcher(),
      };
    }
  );

  mockUseApi = mockUseApiFn as UseApiFn;

  vi.doMock('../../services', () => ({
    getMovie: mockGetMovie,
    getCredits: mockGetCredits,
    getSimilar: mockGetSimilar,
    getVideos: mockGetVideos,
  }));
  vi.doMock('../useApi', () => ({ default: mockUseApi }));

  const mod = await import('../useMovieDetail');
  useMovieDetail = mod.default;
});

describe('useMovieDetail additional coverage', () => {
  it('fetcher passes AbortSignal to all service calls', async () => {
    function TestComp() {
      useMovieDetail(1);
      return null;
    }
    render(<TestComp />);

    expect(typeof lastFetcher).toBe('function');
    const fetcher = lastFetcher!;
    const signal = new AbortController().signal;

    await act(async () => {
      await fetcher(signal);
    });

    expect(mockGetMovie).toHaveBeenCalledWith(1, signal);
    expect(mockGetCredits).toHaveBeenCalledWith(1, signal);
    expect(mockGetSimilar).toHaveBeenCalledWith(1, 1, signal);
    expect(mockGetVideos).toHaveBeenCalledWith(1, signal);
  });

  it('fetcher returns assembled payload (details, credits, similar, videos)', async () => {
    function TestComp() {
      useMovieDetail(1);
      return null;
    }
    render(<TestComp />);

    const fetcher = lastFetcher!;
    let payload: MovieDetailPayload | undefined;
    await act(async () => {
      payload = (await fetcher()) as MovieDetailPayload;
    });

    expect(payload).toBeTruthy();
    expect(payload!.details).toEqual(expect.objectContaining({ id: 1, title: 'MovieOne' }));
    expect(payload!.credits).toEqual(expect.objectContaining({ cast: [] }));
    expect(payload!.similar).toEqual(expect.objectContaining({ results: expect.any(Array) }));
    expect(payload!.videos).toEqual(expect.objectContaining({ results: expect.any(Array) }));
  });

  it('when useApi returns error hook exposes error and trailerKey is undefined', async () => {
    mockUseApiFn.mockImplementationOnce(() => ({
      data: null,
      loading: false,
      error: new Error('fetch failed'),
      refetch: vi.fn(),
    }));

    function TestComp({ id }: { id?: number }) {
      const { details, trailerKey, loading, error } = useMovieDetail(id);
      return (
        <div>
          <div data-testid="loading">{String(loading)}</div>
          <div data-testid="title">{details?.title ?? 'no-title'}</div>
          <div data-testid="trailer">{trailerKey ?? 'no-trailer'}</div>
          <div data-testid="error">{error ? String(error) : ''}</div>
        </div>
      );
    }

    render(<TestComp id={1} />);

    expect(screen.getByTestId('title').textContent).toBe('no-title');
    expect(screen.getByTestId('trailer').textContent).toBe('no-trailer');
    expect(screen.getByTestId('error').textContent).toContain('Error: fetch failed');
  });

  it('handles partial data (no videos/credits) and trailerKey is undefined', async () => {
    const partialData = {
      details: { id: 2, title: 'Partial Movie' },
      credits: null,
      similar: { page: 1, results: [] },
      videos: null,
    } as MovieDetailPayload;

    mockUseApiFn.mockImplementationOnce(() => ({
      data: partialData,
      loading: false,
      error: null,
      refetch: vi.fn(),
    }));

    function TestComp({ id }: { id?: number }) {
      const { details, trailerKey, credits, videos } = useMovieDetail(id);
      return (
        <div>
          <div data-testid="title">{details?.title ?? 'no-title'}</div>
          <div data-testid="trailer">{trailerKey ?? 'no-trailer'}</div>
          <div data-testid="credits">{credits ? 'has-credits' : 'no-credits'}</div>
          <div data-testid="videos">{videos ? 'has-videos' : 'no-videos'}</div>
        </div>
      );
    }

    render(<TestComp id={2} />);

    expect(screen.getByTestId('title').textContent).toBe('Partial Movie');
    expect(screen.getByTestId('trailer').textContent).toBe('no-trailer');
    expect(screen.getByTestId('credits').textContent).toBe('no-credits');
    expect(screen.getByTestId('videos').textContent).toBe('no-videos');
  });

  it('invoking fetcher multiple times calls services again (refetch behavior)', async () => {
    function TestComp() {
      useMovieDetail(1);
      return null;
    }
    render(<TestComp />);

    const fetcher = lastFetcher!;
    await act(async () => {
      await fetcher();
    });
    expect(mockGetMovie).toHaveBeenCalledTimes(1);

    await act(async () => {
      await fetcher();
    });
    expect(mockGetMovie).toHaveBeenCalledTimes(2);
  });
});
