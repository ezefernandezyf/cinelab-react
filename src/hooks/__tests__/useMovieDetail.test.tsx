import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';

// Mock useApi BEFORE importing the hook under test
vi.mock('../useApi', () => ({
  default: vi.fn(),
}));

import useApi from '../useApi';
import useMovieDetail from '../useMovieDetail';

beforeEach(() => {
  document.body.innerHTML = '';
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

describe('useMovieDetail hook', () => {
  it('returns trailerKey when useApi provides videos with a YouTube Trailer', () => {
    const mockData = {
      details: { id: 1, title: 'Test Movie' },
      credits: {},
      similar: { results: [] },
      videos: {
        results: [
          { id: 'v1', key: 'YTKEY123', site: 'YouTube', type: 'Trailer' },
        ],
      },
    };

    (useApi as unknown as any).mockImplementation(() => ({
      data: mockData,
      loading: false,
      error: null,
      refetch: vi.fn(),
    }));

    render(<TestComponent id={1} />);

    expect(screen.getByTestId('title').textContent).toBe('Test Movie');
    expect(screen.getByTestId('trailer').textContent).toBe('YTKEY123');
  });

  it('returns nullish values when useApi returns no data', () => {
    (useApi as unknown as any).mockImplementation(() => ({
      data: null,
      loading: false,
      error: null,
      refetch: vi.fn(),
    }));

    render(<TestComponent id={2} />);

    expect(screen.getByTestId('title').textContent).toBe('no-title');
    expect(screen.getByTestId('trailer').textContent).toBe('no-trailer');
  });
});