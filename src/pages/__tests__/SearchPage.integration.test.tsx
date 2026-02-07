import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';

describe('SearchPage integration - pagination & deep-link', () => {
  afterEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('sincroniza la página inicial desde el query param (deep-link) llamando setPage', async () => {
    const setPageMock = vi.fn();

    vi.doMock('../../hooks/useSearchMovies', async () => {
      return {
        default: (q: string) => {
          return {
            query: q,
            setQuery: vi.fn(),
            searchTerm: q,
            data: { page: 1, total_pages: 5, total_results: 0, results: [] },
            loading: false,
            error: null,
            page: 1,
            setPage: setPageMock,
            refetch: vi.fn(),
          };
        },
      };
    });

    const { default: SearchPage } = await import('../../pages/SearchPage/SearchPage');

    render(
      <MemoryRouter initialEntries={['/search?q=batman&page=3']}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(setPageMock).toHaveBeenCalledWith(3);
    });
  });

  it('al clickear Prev y Next llama a setPage con los valores correctos', async () => {
    const setPageMock = vi.fn();

   vi.doMock('../../hooks/useSearchMovies', async () => {
      return {
        default: (q: string) => {
          return {
            query: q,
            setQuery: vi.fn(),
            searchTerm: q,
            data: {
              page: 2,
              total_pages: 3,
              total_results: 1,
              results: [
                {
                  id: 1,
                  title: 'Inception',
                  poster_path: '/poster.jpg',
                  vote_average: 8.8,
                  release_date: '2010-07-16',
                },
              ],
            },
            loading: false,
            error: null,
            page: 2,
            setPage: setPageMock,
            refetch: vi.fn(),
          };
        },
      };
    });

    const { default: SearchPage } = await import('../../pages/SearchPage/SearchPage');

    render(
      <MemoryRouter initialEntries={['/search?q=batman']}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    );

    const user = userEvent.setup();

    const prevBtn = await screen.findByRole('button', { name: /Previous page/i });
    const nextBtn = await screen.findByRole('button', { name: /Next page/i });

    expect(prevBtn).not.toBeDisabled();
    expect(nextBtn).not.toBeDisabled();

    await user.click(prevBtn);
    expect(setPageMock).toHaveBeenLastCalledWith(1);

    await user.click(nextBtn);
    expect(setPageMock).toHaveBeenLastCalledWith(3);
  });
});