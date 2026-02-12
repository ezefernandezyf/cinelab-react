import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import MovieCard from '../MovieCard/MovieCard';
import type { MovieSummary } from '../../models';

describe('MovieCard', () => {
  const movie: MovieSummary = {
    id: 1,
    title: 'Inception',
    poster_path: '/poster.jpg',
    vote_average: 8.8,
    release_date: '2010-07-16',
  };

  it('renders title, year, rating, image and details link', () => {
    render(
      <MemoryRouter>
        <MovieCard movie={movie} />
      </MemoryRouter>
    );

    const img = screen.getByRole('img', { name: /inception/i });
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toContain('poster.jpg');

    expect(screen.getByText(/inception/i)).toBeInTheDocument();
    expect(screen.getByText(/2010/)).toBeInTheDocument();
    expect(screen.getByText(/8\.8/)).toBeInTheDocument();

    const detailsLink = screen.getByRole('link', { name: /ver detalles/i });
    expect(detailsLink).toBeInTheDocument();
    expect(detailsLink.getAttribute('href')).toBe('/movie/1');
  });

  it('uses placeholder when poster_path is missing', () => {
    const movieNoPoster = { ...movie, poster_path: null };
    render(
      <MemoryRouter>
        <MovieCard movie={movieNoPoster} />
      </MemoryRouter>
    );

    const img = screen.getByRole('img', { name: /inception/i });
    expect(img.getAttribute('src')).toMatch(/placeholder/i);
  });

  it('calls onToggleFavorite with movie id when favorite button clicked', async () => {
    const onToggleFavorite = vi.fn();
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <MovieCard movie={movie} isFavorite={false} onToggleFavorite={onToggleFavorite} />
      </MemoryRouter>
    );

    const favBtn = screen.getByTestId('favorite-btn');
    expect(favBtn).toBeInTheDocument();
    await user.click(favBtn);
    expect(onToggleFavorite).toHaveBeenCalledWith(1);
  });

  it('favorite button reflects isFavorite (aria-pressed)', () => {
    render(
      <MemoryRouter>
        <MovieCard movie={movie} isFavorite={true} onToggleFavorite={() => {}} />
      </MemoryRouter>
    );

    const favBtn = screen.getByTestId('favorite-btn');
    expect(favBtn).toHaveAttribute('aria-pressed', 'true');
  });
});
