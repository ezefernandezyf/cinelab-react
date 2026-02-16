import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, beforeEach, afterEach, expect, vi, type Mock } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../../hooks/useMovieDetail', () => {
  return {
    default: vi.fn(),
  };
});

import useMovieDetail from '../../hooks/useMovieDetail';
import MovieDetailPage from '../MovieDetail/MovieDetailPage';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={['/movie/123']}>
      <Routes>
        <Route path="/movie/:id" element={<MovieDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('MovieDetailPage', () => {
  it('disables "Ver trailer" button when trailerKey is not present', async () => {
    const mockUseMovieDetail = useMovieDetail as Mock;
    mockUseMovieDetail.mockReturnValue({
      details: { id: 123, title: 'No Trailer' },
      credits: null,
      similar: null,
      trailerKey: undefined,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter();

    const btn = await screen.findByRole('button', { name: /ver trailer/i });
    expect(btn).toBeDisabled();

    expect(mockUseMovieDetail).toHaveBeenCalled();
  });

  it('enables "Ver trailer" and opens modal when clicked', async () => {
    const mockUseMovieDetail = useMovieDetail as Mock;
    mockUseMovieDetail.mockReturnValue({
      details: { id: 123, title: 'With Trailer' },
      credits: null,
      similar: null,
      trailerKey: 'YT_TEST_KEY',
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter();

    const btn = await screen.findByRole('button', { name: /ver trailer/i });

    expect(btn).toBeEnabled();

    await userEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const iframe = screen.queryByTitle(/Trailer de With Trailer/i);
    if (iframe) {
      expect(iframe).toHaveAttribute('src', expect.stringContaining('YT_TEST_KEY'));
    }
  });

  it('shows placeholder when details is null', () => {
    const mockUseMovieDetail = useMovieDetail as Mock;
    mockUseMovieDetail.mockReturnValue({
      details: null,
      credits: null,
      similar: null,
      trailerKey: undefined,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter();

    expect(screen.getByText(/pel[ií]cula no encontrada/i)).toBeInTheDocument();
  });

  it('shows error message when error is present', () => {
    const mockUseMovieDetail = useMovieDetail as Mock;
    mockUseMovieDetail.mockReturnValue({
      details: null,
      credits: null,
      similar: null,
      trailerKey: undefined,
      loading: false,
      error: new Error('fetch failed'),
      refetch: vi.fn(),
    });

    renderWithRouter();

    expect(screen.queryByText(/error/i) || screen.queryByText(/fetch failed/i)).toBeTruthy();
  });

  it('renders full movie details: title, poster, overview, cast and similar movies, and enables trailer button', async () => {
    const mockUseMovieDetail = useMovieDetail as Mock;
    mockUseMovieDetail.mockReturnValue({
      details: {
        id: 123,
        title: 'Full Movie',
        overview: 'This is an example overview for Full Movie.',
        poster_path: '/poster123.jpg',
      },
      credits: {
        cast: [
          { id: 1, name: 'Actor One', character: 'Lead' },
          { id: 2, name: 'Actor Two', character: 'Support' },
        ],
        crew: [],
      },
      similar: {
        page: 1,
        results: [{ id: 321, title: 'Similar Movie' }],
        total_pages: 1,
        total_results: 1,
      },
      videos: { results: [{ id: 'v1', key: 'YT_KEY_FULL', site: 'YouTube', type: 'Trailer' }] },
      trailerKey: 'YT_KEY_FULL',
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter();

    expect(await screen.findByRole('heading', { name: 'Full Movie' })).toBeInTheDocument();
    expect(screen.getByText(/This is an example overview/i)).toBeInTheDocument();

    const poster =
      screen.getByRole('img', { name: /Full Movie/i }) || screen.queryByAltText(/full movie/i);
    expect(poster).toBeTruthy();

    expect(screen.getByText(/Actor One/i)).toBeInTheDocument();

    expect(screen.getByText(/Similar Movie/i)).toBeInTheDocument();

    const btn = await screen.findByRole('button', { name: /ver trailer/i });
    expect(btn).toBeEnabled();
  });
});
