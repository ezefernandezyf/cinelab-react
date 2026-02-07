import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import {MovieList} from '../MovieList/MovieList';

const movies = [
  {
    id: 10,
    title: 'Test Movie',
    poster_path: '/poster.jpg',
    vote_average: 7.1,
    release_date: '2020-01-01',
  },
];

describe('MovieList favorites integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('al clicar favorito desde MovieCard se añade el id a localStorage', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <MovieList movies={movies as any} />
      </MemoryRouter>
    );

    const favBtn = await screen.findByTestId('favorite-btn');
    await user.click(favBtn);

    const stored = JSON.parse(localStorage.getItem('cinelab:favorites') || '[]');
    expect(stored).toContain(10);

    await user.click(favBtn);
    const stored2 = JSON.parse(localStorage.getItem('cinelab:favorites') || '[]');
    expect(stored2).not.toContain(10);
  });
});