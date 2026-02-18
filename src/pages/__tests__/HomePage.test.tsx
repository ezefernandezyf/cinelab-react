import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, beforeEach, afterEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const mockUseFavoritesContext = { favorites: [1, 2, 3] };
const mockFavMovies = [
  { id: 1, title: 'Movie One', poster_path: null, vote_average: 7, release_date: '2020-01-01' },
  { id: 2, title: 'Movie Two', poster_path: null, vote_average: 6, release_date: '2019-01-01' },
  { id: 3, title: 'Movie Three', poster_path: null, vote_average: 8, release_date: '2018-01-01' },
];
const mockRecPaged = {
  page: 1,
  total_pages: 1,
  total_results: 2,
  results: [
    { id: 10, title: 'Popular A', poster_path: null, vote_average: 8, release_date: '2021-01-01' },
    { id: 11, title: 'Popular B', poster_path: null, vote_average: 7, release_date: '2022-01-01' },
  ],
};

let HomePage: React.ComponentType;

beforeEach(async () => {
  vi.resetModules();

  vi.doMock('../../hooks/useFavoritesContext', () => ({
    useFavoritesContext: () => mockUseFavoritesContext,
  }));

  vi.doMock('../../hooks/useFavoriteMovies', () => ({
    __esModule: true,
    default: () => ({ movies: mockFavMovies, loading: false }),
  }));

  vi.doMock('../../hooks/useRecommended', () => ({
    __esModule: true,
    default: () => ({ movies: mockRecPaged.results.slice(0, 4), loading: false }),
  }));

  const mod = await import('../HomePage/HomePage'); 
  HomePage = mod.default;
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('HomePage', () => {
  it('renders hero, favorites and recommended widgets', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Bienvenido a CineLab/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Buscar películas/i })).toBeInTheDocument();
    expect(screen.getByText('Tus favoritos')).toBeInTheDocument();
    expect(screen.getByText('Movie One')).toBeInTheDocument();

    expect(screen.getByText('Recomendado')).toBeInTheDocument();
    expect(screen.getByAltText('Popular A')).toBeInTheDocument();
    expect(screen.getByAltText('Popular B')).toBeInTheDocument();
  });
});
