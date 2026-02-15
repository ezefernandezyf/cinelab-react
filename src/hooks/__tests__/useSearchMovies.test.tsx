import { render, screen, cleanup, act } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import type { MovieSummary, PagedResponse } from '../../models/movie.model';

const initialPaged: PagedResponse<MovieSummary> = {
  page: 1,
  total_pages: 0,
  total_results: 0,
  results: [],
};

type LocalUseApiOptions = {
  immediate?: boolean;
  initialData?: unknown | null;
};

type UseApiReturn = {
  data: unknown | null;
  loading: boolean;
  error: unknown;
  refetch: () => Promise<unknown>;
};

let mockSearchMovies: ReturnType<typeof vi.fn>;
let mockUseApi: ReturnType<typeof vi.fn>;
let lastFetcher: ((signal?: AbortSignal) => Promise<unknown>) | undefined;
let useSearchMovies: (initialQuery?: string) => {
  query: string;
  setQuery: (q: string) => void;
  searchTerm: string;
  data: PagedResponse<MovieSummary> | null;
  loading: boolean;
  error: unknown;
  page: number;
  setPage: (p: number) => void;
  refetch: () => Promise<unknown>;
};

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
  vi.useRealTimers();
});

beforeEach(async () => {
  vi.resetModules();

  mockSearchMovies = vi.fn().mockResolvedValue(initialPaged);

  lastFetcher = undefined;
  mockUseApi = vi.fn().mockImplementation(
    (fetcher: (signal?: AbortSignal) => Promise<unknown>, options?: LocalUseApiOptions): UseApiReturn => {
      lastFetcher = fetcher;
      return { data: options?.initialData ?? null, loading: false, error: null, refetch: async () => fetcher() };
    }
  );

  vi.doMock('../../services/movie.service', () => ({ searchMovies: mockSearchMovies }));
  vi.doMock('../useApi', () => ({ default: mockUseApi }));

  const mod = await import('../useSearchMovies');
  useSearchMovies = mod.default;
});

describe('useSearchMovies (mocked useApi, refactorizado)', () => {
  it('A - immediate option follows initialQuery (no immediate when empty, immediate when non-empty)', async () => {
    function TestComponent1() {
      useSearchMovies('');
      return null;
    }
    render(<TestComponent1 />);
    expect(mockUseApi).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining({ immediate: false }));

    mockUseApi.mockClear();


    const { default: useSearchMovies2 } = await import('../useSearchMovies');
    function TestComponent2() {
      useSearchMovies2('hello');
      return null;
    }
    render(<TestComponent2 />);
    expect(mockUseApi).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining({ immediate: true }));
  });

  it('B - debounce: updates searchTerm after 400ms and fetcher calls searchMovies with debouncedQuery and page', async () => {
    function TestComponent() {
      const { setQuery } = useSearchMovies('');
      return <button data-testid="set-query" onClick={() => setQuery('batman')}>set-query</button>;
    }

    vi.useFakeTimers();
    render(<TestComponent />);

    await act(async () => {
      const btn = screen.getByTestId('set-query');
      btn.click();
    });

    act(() => {
      vi.advanceTimersByTime(400);
      vi.runOnlyPendingTimers();
    });

    await act(async () => {
      await Promise.resolve();
    });

    const fetcherToCall = lastFetcher;
    expect(typeof fetcherToCall).toBe('function');

    if (typeof fetcherToCall === 'function') {
      const signal = new AbortController().signal;
      await act(async () => {
        await fetcherToCall(signal);
      });
    }

    expect(mockSearchMovies).toHaveBeenCalledWith('batman', 1, expect.anything());
    vi.useRealTimers();
  });

  it('C - changing query resets page to 1 (effect uses setTimeout 0)', async () => {
    function TestComponent() {
      const { page, setPage, setQuery } = useSearchMovies('');
      return (
        <div>
          <div data-testid="page">{String(page)}</div>
          <button data-testid="set-page-3" onClick={() => setPage(3)}>set-page-3</button>
          <button data-testid="set-query" onClick={() => setQuery('batman')}>set-query</button>
        </div>
      );
    }

    vi.useFakeTimers();
    render(<TestComponent />);

    await act(async () => {
      const btn = screen.getByTestId('set-page-3');
      btn.click();
    });
    expect(screen.getByTestId('page').textContent).toBe('3');

    await act(async () => {
      const btn = screen.getByTestId('set-query');
      btn.click();
    });

    act(() => {
      vi.advanceTimersByTime(400);
      vi.runOnlyPendingTimers();
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByTestId('page').textContent).toBe('1');
    vi.useRealTimers();
  });
});