import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockRequestUse = vi.fn();
const mockResponseUse = vi.fn();
const mockGet = vi.fn();
const mockCreate = vi.fn(() => ({
  interceptors: {
    request: { use: mockRequestUse },
    response: { use: mockResponseUse },
  },
  get: mockGet,
}));

vi.mock('axios', () => {
  return {
    default: {
      create: mockCreate,
    },
  };
});

describe('src/services/api', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('initAxios crea instancia de axios y registra interceptors', async () => {
    vi.stubEnv('VITE_TMDB_API_KEY', 'KEY1');

    const api = await import('../api');

    const inst = api.initAxios();

    expect(mockCreate).toHaveBeenCalled();

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        timeout: 10000,
      })
    );

    expect(mockRequestUse).toHaveBeenCalled();
    expect(mockResponseUse).toHaveBeenCalled();

    expect(inst).toBeDefined();
    expect(typeof inst.get).toBe('function');
  });

  it('apiGet llama a instance.get y devuelve res.data', async () => {
    vi.stubEnv('VITE_TMDB_API_KEY', 'KEY2');

    const payload = { results: [{ id: 1, title: 'X' }] };
    mockGet.mockResolvedValue({ data: payload });

    const api = await import('../api');

    const data = await api.apiGet('/movies?page=1', { params: { page: 1 } });

    expect(mockGet).toHaveBeenCalledWith('/movies?page=1', { params: { page: 1 } });
    expect(data).toEqual(payload);
  });

  it('apiGet propaga errores cuando axios.get rechaza', async () => {
    vi.stubEnv('VITE_TMDB_API_KEY', 'KEY3');

    mockGet.mockRejectedValue(new Error('network error'));

    const api = await import('../api');

    await expect(api.apiGet('/bad')).rejects.toThrow('network error');
    expect(mockGet).toHaveBeenCalledWith('/bad', undefined);
  });

  it('request interceptor adds api_key when params already exist', async () => {
    vi.stubEnv('VITE_TMDB_API_KEY', 'APIKEY123');

    const api = await import('../api');
    api.initAxios();

    const requestInterceptor = mockRequestUse.mock.calls[0][0];
    const cfg = { url: '/movies', params: { page: 1 } };

    const res = requestInterceptor(cfg as InternalAxiosRequestConfig);
    expect(res.params).toEqual(expect.objectContaining({ page: 1, api_key: 'APIKEY123' }));
  });

  it('request interceptor initializes params when absent', async () => {
    vi.stubEnv('VITE_TMDB_API_KEY', 'KEY_INIT');

    const api = await import('../api');
    api.initAxios();

    const requestInterceptor = mockRequestUse.mock.calls[0][0];
    const cfg = { url: '/movies' };

    const res = requestInterceptor(cfg as InternalAxiosRequestConfig);
    expect(res.params).toBeDefined();
    expect(res.params.api_key).toBe('KEY_INIT');
  });

  it('request interceptor does not overwrite existing api_key', async () => {
    vi.stubEnv('VITE_TMDB_API_KEY', 'SHOULD_NOT_OVERWRITE');

    const api = await import('../api');
    api.initAxios();

    const requestInterceptor = mockRequestUse.mock.calls[0][0];
    const cfg = { url: '/movies', params: { api_key: 'EXISTING' } };

    const res = requestInterceptor(cfg as InternalAxiosRequestConfig);
    expect(res.params.api_key).toBe('EXISTING');
  });

  it('initAxios uses VITE_TMDB_BASE_URL when provided', async () => {
    vi.stubEnv('VITE_TMDB_BASE_URL', 'https://custom.example/api');
    vi.stubEnv('VITE_TMDB_API_KEY', 'K_BASE');

    const api = await import('../api');
    api.initAxios();

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://custom.example/api',
        timeout: 10000,
      })
    );
  });

  it('response interceptor returns response unchanged', async () => {
    vi.stubEnv('VITE_TMDB_API_KEY', 'X_RESP');

    const api = await import('../api');
    api.initAxios();

    const responseInterceptor = mockResponseUse.mock.calls[0][0];
    const fakeResponse = { config: { url: '/x' }, status: 200, data: { ok: true } };

    const res = responseInterceptor(fakeResponse as AxiosResponse);
    expect(res).toBe(fakeResponse);
  });
});