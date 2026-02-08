import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

const toggleMock = vi.fn();

vi.mock('../../hooks/useFavorites', () => {
  const favorites = [10];
  return {
    default: () => ({
      favorites,
      isFavorite: (id: number) => favorites.includes(id),
      toggleFavorite: toggleMock,
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

it('calls toggleFavorite and shows toast; undo triggers toggleFavorite again', async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <FavoritesPage />
    </MemoryRouter>
  );

  const favBtn = await screen.findByTestId('favorite-btn');
  await user.click(favBtn);

  expect(toggleMock).toHaveBeenCalledWith(10);
  expect(toggleMock).toHaveBeenCalledTimes(1);

  expect(await screen.findByText(/Eliminaste de favoritos/i)).toBeInTheDocument();

  const undoBtn = screen.getByRole('button', { name: /Deshacer/i });
  await user.click(undoBtn);

  expect(toggleMock).toHaveBeenCalledWith(10);
  expect(toggleMock).toHaveBeenCalledTimes(2);
});