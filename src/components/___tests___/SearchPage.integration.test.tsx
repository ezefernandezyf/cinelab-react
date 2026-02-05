import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';


import * as movieService from '../../services/movie.service'; 
import SearchPage from '../../pages/SearchPage/SearchPage'; 
const sampleResponse = {
  page: 1,
  total_pages: 1,
  total_results: 1,
  results: [
    {
      id: 1,
      title: 'The Matrix',
      poster_path: null,
      release_date: '1999-03-31',
      vote_average: 8.2,
    },
  ],
};

describe('SearchPage integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('loads results from query param and displays list', async () => {

    vi.spyOn(movieService, 'searchMovies').mockResolvedValue(sampleResponse as any);

    render(
      <MemoryRouter initialEntries={['/search?q=matrix']}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    );


    await waitFor(() => expect(screen.getByText('The Matrix')).toBeInTheDocument());
    expect(movieService.searchMovies).toHaveBeenCalledWith('matrix', 1, expect.anything());
  });

  it('does not render results when query param is empty', async () => {
    vi.spyOn(movieService, 'searchMovies').mockResolvedValue(sampleResponse as any);

    render(
      <MemoryRouter initialEntries={['/search']}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('The Matrix')).not.toBeInTheDocument();

    expect(movieService.searchMovies).not.toHaveBeenCalled();
  });
});