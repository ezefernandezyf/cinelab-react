import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';


vi.mock('../../hooks/useFavorites', () => {
  const favorites = [10];
  return {
    default: () => ({
      favorites,
      isFavorite: (id: number) => favorites.includes(id),
      toggleFavorite: vi.fn(),
      addFavorite: vi.fn(),
      removeFavorite: vi.fn(),
      clearFavorites: vi.fn(),
    }),
  };
});

vi.mock('../../hooks/useFavoriteMovies', () => {
  return {
    default: () => ({
      movies: [
        {
          id: 10,
          title: 'Title',
          poster_path: null,
          vote_average: 7,
          release_date: '2020-01-01',
        },
      ],
      loading: false,
      error: null,
      refetch: vi.fn(),
    }),
  };
});

import FavoritesPage from '../FavoritesPage/FavoritesPage';

test('renders favorite movie list', async () => {
  render(
    <MemoryRouter>
      <FavoritesPage />
    </MemoryRouter>
  );

  // Título de la página (sincrónico)
  expect(screen.getByText(/tus favoritos/i)).toBeInTheDocument();

  // Ahora sí debería aparecer el título de la película (asíncrono si algo lo renderiza después)
  expect(await screen.findByText(/title/i)).toBeInTheDocument();
});