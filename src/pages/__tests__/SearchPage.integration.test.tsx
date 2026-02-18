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

  it('sincroniza la página inicial desde el query param (deep-link) pasando page al hook', async () => {
    const pagesSeen: number[] = [];

    vi.doMock('../../hooks/useSearchMovies', async () => {
      return {
        default: (q: string, pageArg: number) => {
          pagesSeen.push(pageArg);
          return {
            query: q,
            setQuery: vi.fn(),
            searchTerm: q,
            data: { page: pageArg, total_pages: 5, total_results: 0, results: [] },
            loading: false,
            error: null,
            refetch: vi.fn(),
          };
        },
      };
    });

    const { default: SearchPage } = await import('../SearchPage/SearchPage');

    render(
      <MemoryRouter initialEntries={['/search?q=batman&page=3']}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      // el primer llamado al hook debe recibir page = 3 (deep-link)
      expect(pagesSeen[0]).toBe(3);
    });
  });

  it('al clickear Prev y Next actualiza la página y re-renderiza el hook con los valores correctos', async () => {
    const pagesSeen: number[] = [];

    vi.doMock('../../hooks/useSearchMovies', async () => {
      return {
        default: (q: string, pageArg: number) => {
          pagesSeen.push(pageArg);
          return {
            query: q,
            setQuery: vi.fn(),
            searchTerm: q,
            data: {
              page: pageArg,
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
            refetch: vi.fn(),
          };
        },
      };
    });

    const { default: SearchPage } = await import('../SearchPage/SearchPage');

    render(
      <MemoryRouter initialEntries={['/search?q=batman&page=2']}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    );

    const user = userEvent.setup();

    const prevBtn = await screen.findByRole('button', { name: /Página previa/i });
    const nextBtn = await screen.findByRole('button', { name: /Página siguiente/i });

    expect(prevBtn).not.toBeDisabled();
    expect(nextBtn).not.toBeDisabled();

    // click Prev -> debería re-renderizar con page = 1
    await user.click(prevBtn);
    await waitFor(() => {
      expect(pagesSeen).toContain(1);
    });

    await user.click(nextBtn);
    await waitFor(() => {
      expect(pagesSeen).toContain(2);
    });

    await user.click(nextBtn);
    await waitFor(() => {
      expect(pagesSeen).toContain(3);
    });
  });
});
