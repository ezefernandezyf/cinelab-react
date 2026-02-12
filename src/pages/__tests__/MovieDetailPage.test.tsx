import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, beforeEach, afterEach, expect, vi, type Mock } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const mockUseMovieDetail: Mock = vi.fn();

vi.mock('../../hooks/useMovieDetail', () => {
  return {
    default: mockUseMovieDetail,
  };
});

import MovieDetailPage from '../MovieDetail/MovieDetailPage';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={['/movie/123']}>
      <Routes>
        <Route path="/movie/:id" element={<MovieDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('MovieDetailPage', () => {
  it('disables "Ver trailer" button when trailerKey is not present', async () => {

    mockUseMovieDetail.mockReturnValue({
      details: { id: 123, title: 'No Trailer' },
      credits: null,
      similar: null,
      trailerKey: undefined,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter();

    const btn = await screen.findByRole('button', { name: /ver trailer/i });
    expect(btn).toBeDisabled();


    expect(mockUseMovieDetail).toHaveBeenCalled();

  });

  it('enables "Ver trailer" and opens modal when clicked', async () => {
    mockUseMovieDetail.mockReturnValue({
      details: { id: 123, title: 'With Trailer' },
      credits: null,
      similar: null,
      trailerKey: 'YT_TEST_KEY',
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter();

     const btn = await screen.findByRole('button', { name: /ver trailer/i });

    if (btn.hasAttribute('disabled')) {
      console.log('BUTTON HTML (debug):', btn.outerHTML);
    }

    expect(btn).toBeEnabled();

    await userEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const iframe = screen.queryByTitle(/Trailer de With Trailer/i);
    if (iframe) {
      expect(iframe).toHaveAttribute('src', expect.stringContaining('YT_TEST_KEY'));
    }
  });
});