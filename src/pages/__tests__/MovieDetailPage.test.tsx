import { vi } from 'vitest';

vi.mock('../../hooks/useMovieDetail', () => {
  return {
    default: (id?: number) => ({
      details: {
        id: id ?? 1,
        title: 'Mock Movie',
        poster_path: '/p.jpg',
        overview: 'Overview',
        release_date: '2020-01-01',
        runtime: 120,
        genres: [{ name: 'Drama' }],
      },
      credits: { id: id ?? 1, cast: [] },
      similar: { page: 1, results: [], total_pages: 0, total_results: 0 },
      loading: false,
      error: null,
      refetch: vi.fn(),
    }),
  };
});

import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import MovieDetailPage from '../MovieDetail/MovieDetailPage';
import FavoritesProvider from '../../context/FavoritesProvider';

it('renders movie detail scaffold', () => {
  render(
    <MemoryRouter initialEntries={['/movie/1']}>
      <FavoritesProvider>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetailPage />} />
        </Routes>
      </FavoritesProvider>
    </MemoryRouter>
  );

  expect(screen.getByText(/Mock Movie/i)).toBeInTheDocument();
  expect(screen.getByText(/Sinopsis/i)).toBeInTheDocument();
});
