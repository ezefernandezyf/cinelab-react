import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';

describe('SearchPage integration - search with useSearchMovies', () => {
  afterEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('al escribir en el input y hacer submit llama a setQuery con el término de búsqueda', async () => {
    const setQueryMock = vi.fn();
    vi.doMock('../../hooks/useSearchMovies', async () => {
      return {
        default: (q: string) => {
          return {
            query: q,
            setQuery: setQueryMock,
            searchTerm: q,
            data: { page: 1, total_pages: 5, total_results: 0, results: [] },
            loading: false,
            error: null,
            page: 1,
            setPage: vi.fn(),
            refetch: vi.fn(),
          };
        },
      };
    });

    const { default: SearchPage } = await import('../SearchPage/SearchPage');

    render(
      <MemoryRouter initialEntries={['/search']}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    );

    const user = userEvent.setup();

    const input = screen.getByPlaceholderText(/buscar películas/i);

    const submitBtn = screen.getByRole('button', { name: /buscar/i });

    await user.type(input, 'batman');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(setQueryMock).toHaveBeenCalledWith('batman');
    });
  });
});
