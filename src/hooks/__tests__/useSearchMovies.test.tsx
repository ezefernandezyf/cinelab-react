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
let useSearchMovies: (
  initialQuery?: string,
  page?: number
) => {
  query: string;
  setQuery: (q: string) => void;
  searchTerm: string;
  data: PagedResponse<MovieSummary> | null;
  loading: boolean;
  error: unknown;
  // page now provided as argument, but we can still return its value for convenience
  page: number;
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

  vi.doMock('../../services/movie.service', () => ({ searchMovies: mockSearchMovies }));
  vi.doMock('../useApi', () => ({ default: mockUseApi }));

  const mod = await import('../useSearchMovies');
  useSearchMovies = mod.default;
});

describe('useSearchMovies (mocked useApi, refactorizado)', () => {
  it('A - immediate option sigue initialQuery (immediate false si vacío, true si no vacío)', async () => {
    function TestComponent1() {
      // pasar page explícito (ej. 1)
      useSearchMovies('', 1);
      return null;
    }
    render(<TestComponent1 />);
    expect(mockUseApi).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ immediate: false })
    );

    mockUseApi.mockClear();

    const { default: useSearchMovies2 } = await import('../useSearchMovies');
    function TestComponent2() {
      useSearchMovies2('hello', 1);
      return null;
    }
    render(<TestComponent2 />);
    expect(mockUseApi).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ immediate: true })
    );
  });

  it('B - debounce: updates searchTerm after 400ms and fetcher calls searchMovies with debouncedQuery and pageArg', async () => {
    function TestComponent() {
      const { setQuery } = useSearchMovies('', 1);
      return (
        <button data-testid="set-query" onClick={() => setQuery('batman')}>
          set-query
        </button>
      );
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


});
