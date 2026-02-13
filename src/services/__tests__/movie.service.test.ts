import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockApiGet = vi.fn();

vi.mock('../api', () => {
  return {
    apiGet: mockApiGet,
  };
});

describe('src/services/movie.service', () => {
  beforeEach(() => {
    vi.resetModules(); 
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('searchMovies llama a apiGet con los params correctos y devuelve data', async () => {
    const fakeResponse = { results: [{ id: 1 }], page: 2, total_pages: 1, total_results: 1 };
    mockApiGet.mockResolvedValue(fakeResponse);

    const movieService = await import('../movie.service');

    const signal = new AbortController().signal;
    const data = await movieService.searchMovies('term', 2, signal);

    expect(mockApiGet).toHaveBeenCalledWith(
      '/search/movie',
      expect.objectContaining({
        params: expect.objectContaining({
          query: 'term',
          page: 2,
          language: 'es-ES',
          include_adult: false,
        }),
        signal,
      })
    );
    expect(data).toEqual(fakeResponse);
  });

  it('getMovie llama a apiGet con el id y devuelve detalles', async () => {
    const fakeDetail = { id: 10, title: 'X' };
    mockApiGet.mockResolvedValue(fakeDetail);

    const movieService = await import('../movie.service');

    const signal = new AbortController().signal;
    const data = await movieService.getMovie(10, signal);

    expect(mockApiGet).toHaveBeenCalledWith(
      '/movie/10',
      expect.objectContaining({
        params: { language: 'es-ES' },
        signal,
      })
    );
    expect(data).toEqual(fakeDetail);
  });

  it('getCredits llama a apiGet con la ruta de credits', async () => {
    const fakeCredits = { cast: [], crew: [] };
    mockApiGet.mockResolvedValue(fakeCredits);

    const movieService = await import('../movie.service');

    const signal = new AbortController().signal;
    const data = await movieService.getCredits(5, signal);

    expect(mockApiGet).toHaveBeenCalledWith(
      '/movie/5/credits',
      expect.objectContaining({
        params: { language: 'es-ES' },
        signal,
      })
    );
    expect(data).toEqual(fakeCredits);
  });

  it('getSimilar llama a apiGet con page y devuelve paged response', async () => {
    const fake = { results: [], page: 3, total_pages: 5, total_results: 0 };
    mockApiGet.mockResolvedValue(fake);

    const movieService = await import('../movie.service');

    const data = await movieService.getSimilar(7, 3);

    expect(mockApiGet).toHaveBeenCalledWith(
      '/movie/7/similar',
      expect.objectContaining({
        params: { language: 'es-ES', page: 3 },
      })
    );
    expect(data).toEqual(fake);
  });

  it('getVideos llama a apiGet con la ruta videos', async () => {
    const fake = { results: [{ id: 'a' }] };
    mockApiGet.mockResolvedValue(fake);

    const movieService = await import('../movie.service');

    const signal = new AbortController().signal;
    const data = await movieService.getVideos(12, signal);

    expect(mockApiGet).toHaveBeenCalledWith(
      '/movie/12/videos',
      expect.objectContaining({
        params: { language: 'es-ES' },
        signal,
      })
    );
    expect(data).toEqual(fake);
  });

  it('propaga errores cuando apiGet rechaza', async () => {
    mockApiGet.mockRejectedValue(new Error('boom'));

    const movieService = await import('../movie.service');

    await expect(movieService.searchMovies('x')).rejects.toThrow('boom');
    expect(mockApiGet).toHaveBeenCalled();
  });
});