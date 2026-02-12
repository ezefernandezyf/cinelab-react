import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, beforeEach, afterEach, expect, vi, type Mock } from 'vitest';

// Mock react-router-dom safely (usamos importActual y devolvemos funciones mock)
vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as Record<string, any>;
  const mockNavigate = vi.fn();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/movie/123', state: { from: '/favorites' } }),
    useParams: () => ({ id: '123' }),
  };
});

// Mock useMovieDetail hook
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
    // Arrange: mock data returned by useMovieDetail
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

    // Configure the mocked useMovieDetail
    (useMovieDetail as unknown as Mock).mockReturnValue(mockData);

    // Get the mocked navigate function from the mocked useNavigate
    const mockNavigate = (useNavigate as unknown as () => Mock)();

    // Act: render page
    renderWithRouter();

    // Assert: breadcrumb with label 'Favoritos' is present (should be link)
    const favCrumb = await screen.findByText('Favoritos');
    expect(favCrumb).toBeTruthy();
    // If it's a link, its closest('a') should have the href '/favorites' (MemoryRouter creates full urls starting with /)
    const maybeLink = favCrumb.closest('a');
    if (maybeLink) {
      expect(maybeLink.getAttribute('href')).toBe('/favorites');
    }

    // Find the Volver button (Breadcrumbs renders a button with text 'Volver' and aria-label 'Ir atrás')
    const backBtn = screen.getByRole('button', { name: /volver|ir atrás/i });
    expect(backBtn).toBeInTheDocument();

    // Click the back button
    await userEvent.click(backBtn);

    // Expect navigate to have been called with the `from` path
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });

    // The first call should be to '/favorites' according to our logic
    expect((mockNavigate as Mock).mock.calls[0][0]).toBe('/favorites');
  });
});