import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, beforeEach, afterEach, expect, vi, type Mock } from 'vitest';

vi.mock('../useApi', () => ({
  default: vi.fn(),
}));

import useApi from '../useApi';
import useMovieDetail from '../useMovieDetail';

type UseApiReturnShape = {
  data: unknown | null;
  loading: boolean;
  error: unknown | null;
  refetch: () => Promise<unknown>;
};

const mockedUseApi = useApi as unknown as Mock<() => UseApiReturnShape>;

beforeEach(() => {
  document.body.innerHTML = '';
  mockedUseApi.mockImplementation(
    (): UseApiReturnShape => ({
      data: null,
      loading: false,
      error: null,
      refetch: vi.fn(),
    })
  );
});

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

function TestComponent({ id }: { id?: number }) {
  const { details, trailerKey, loading } = useMovieDetail(id);
  return (
    <div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="title">{details?.title ?? 'no-title'}</div>
      <div data-testid="trailer">{trailerKey ?? 'no-trailer'}</div>
    </div>
  );
}

function renderForId(id?: number) {
  render(<TestComponent id={id} />);
}

describe('useMovieDetail hook', () => {
  it('returns trailerKey when useApi provides videos with a YouTube Trailer', () => {
    const mockData = {
      details: { id: 1, title: 'Test Movie' },
      credits: {},
      similar: { results: [] },
      videos: {
        results: [{ id: 'v1', key: 'YTKEY123', site: 'YouTube', type: 'Trailer' }],
      },
    };

    mockedUseApi.mockImplementationOnce(
      (): UseApiReturnShape => ({
        data: mockData,
        loading: false,
        error: null,
        refetch: vi.fn(),
      })
    );

    renderForId(1);

    expect(screen.getByTestId('title').textContent).toBe('Test Movie');
    expect(screen.getByTestId('trailer').textContent).toBe('YTKEY123');
  });

  it('returns nullish values when useApi returns no data', () => {
    renderForId(2);

    expect(screen.getByTestId('title').textContent).toBe('no-title');
    expect(screen.getByTestId('trailer').textContent).toBe('no-trailer');
  });
  
  it('handles loading true from useApi', () => {
    mockedUseApi.mockImplementationOnce(
      (): UseApiReturnShape => ({
        data: null,
        loading: true,
        error: null,
        refetch: vi.fn(),
      })
    );

    renderForId(3);

    expect(screen.getByTestId('loading').textContent).toBe('true');
  });

  it('exposes error when useApi returns an error', () => {
    mockedUseApi.mockImplementationOnce(
      (): UseApiReturnShape => ({
        data: null,
        loading: false,
        error: new Error('fetch failed'),
        refetch: vi.fn(),
      })
    );

    renderForId(10);

    expect(screen.getByTestId('title').textContent).toBe('no-title');
    expect(screen.getByTestId('trailer').textContent).toBe('no-trailer');
});

})
