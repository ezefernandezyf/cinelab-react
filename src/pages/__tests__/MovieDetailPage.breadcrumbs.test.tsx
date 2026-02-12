import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, beforeEach, afterEach, expect, vi, type Mock } from 'vitest';

vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as typeof import('react-router-dom');
  const mockNavigate = vi.fn();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/movie/123', state: { from: '/favorites' } }),
    useParams: () => ({ id: '123' }),
  };
});

vi.mock('../../hooks/useMovieDetail', () => {
  return {
    default: vi.fn(),
  };
});

import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
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

describe('MovieDetailPage breadcrumbs & back navigation (from /favorites)', () => {
  it('shows breadcrumb for "Favoritos" and clicking Volver navigates to /favorites', async () => {
    const mockData = {
      details: {
        id: 123,
        title: 'Movie From Favs',
        poster_path: null,
        release_date: '2020-01-01',
        runtime: 100,
        genres: [],
        overview: 'Overview',
      },
      credits: null,
      similar: null,
      trailerKey: null,
      loading: false,
      error: null,
      refetch: vi.fn(),
    };

    (useMovieDetail as unknown as Mock).mockReturnValue(mockData);

    const mockNavigate = (useNavigate as unknown as () => Mock)();

    renderWithRouter();

    const favCrumb = await screen.findByText('Favoritos');
    expect(favCrumb).toBeTruthy();

    const maybeLink = favCrumb.closest('a');
    if (maybeLink) {
      expect(maybeLink.getAttribute('href')).toBe('/favorites');
    }

    const backBtn = screen.getByRole('button', { name: /volver|ir atrás/i });
    expect(backBtn).toBeInTheDocument();

    await userEvent.click(backBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });

    expect((mockNavigate as Mock).mock.calls[0][0]).toBe('/favorites');
  });
});
