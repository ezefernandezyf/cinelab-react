import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../MovieCard/MovieCard.tsx', () => {
  return {
    default: () => <div data-testid="movie-card-stub">stub</div>,
  };
});

import { MovieList } from '../index';

const sampleMovie = {
  id: 1,
  title: 'Inception',
  poster_path: '/poster.jpg',
  vote_average: 8.8,
  release_date: '2010-07-16',
};

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

it('muestra loader cuando loading es true', () => {
  renderWithRouter(<MovieList loading={true} />);
  expect(screen.getByRole('status')).toHaveTextContent('Cargando...');
});

it('muestra mensaje "No hay resultados" cuando data.results está vacío', () => {
  const pagedDataEmpty = {
    page: 1,
    total_pages: 1,
    total_results: 0,
    results: [],
  };
  renderWithRouter(<MovieList data={pagedDataEmpty} />);
  expect(screen.getByText(/No hay resultados/i)).toBeInTheDocument();
});

it('muestra mensaje de error cuando error está presente', () => {
  renderWithRouter(<MovieList error={'error testing'} />);
  expect(screen.getByRole('alert')).toHaveTextContent('error testing');
});

it('renderiza N items y muestra la paginación', () => {
  const pagedData = {
    page: 1,
    total_pages: 3,
    total_results: 2,
    results: [
      sampleMovie,
      {
        ...sampleMovie,
        id: 2,
        title: 'Interstellar',
        poster_path: '/p2.jpg',
        vote_average: 8.8,
        release_date: '2010-07-16',
      },
    ],
  };

  renderWithRouter(<MovieList data={pagedData} />);

  const items = screen.getAllByRole('listitem');
  expect(items).toHaveLength(2);

  expect(screen.getByText(/Page\s*1\s*\/\s*3/i)).toBeInTheDocument();
});

it('llama onPageChange al clickear Prev y Next en página intermedia', async () => {
  const pagedData = {
    page: 2,
    total_pages: 3,
    total_results: 10,
    results: [sampleMovie],
  };
  const onPageChange = vi.fn();
  const user = userEvent.setup();

  renderWithRouter(<MovieList data={pagedData} onPageChange={onPageChange} />);

  const prevBtn = screen.getByRole('button', { name: /Previous page/i });
  const nextBtn = screen.getByRole('button', { name: /Next page/i });

  expect(prevBtn).not.toBeDisabled();
  expect(nextBtn).not.toBeDisabled();

  await user.click(prevBtn);
  expect(onPageChange).toHaveBeenLastCalledWith(1);

  await user.click(nextBtn);
  expect(onPageChange).toHaveBeenLastCalledWith(3);
});


it('deshabilita Prev en primera página y Next en última página', () => {
  const onPageChange = vi.fn();

  renderWithRouter(
    <MovieList
      data={{
        page: 1,
        total_pages: 3,
        total_results: 5,
        results: [sampleMovie],
      }}
      onPageChange={onPageChange}
    />
  );

  const prevFirst = screen.getByRole('button', { name: /Previous page/i });
  const nextFirst = screen.getByRole('button', { name: /Next page/i });

  expect(prevFirst).toBeDisabled();
  expect(nextFirst).not.toBeDisabled();

  cleanup();

  renderWithRouter(
    <MovieList
      data={{
        page: 3,
        total_pages: 3,
        total_results: 5,
        results: [sampleMovie],
      }}
      onPageChange={onPageChange}
    />
  );

  const prevLast = screen.getByRole('button', { name: /Previous page/i });
  const nextLast = screen.getByRole('button', { name: /Next page/i });

  expect(prevLast).not.toBeDisabled();
  expect(nextLast).toBeDisabled();
});
