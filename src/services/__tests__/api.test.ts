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
    const payload = { results: [{ id: 1, title: 'X' }] };
    mockGet.mockResolvedValue({ data: payload });

    const api = await import('../api');

    const data = await api.apiGet('/movies?page=1', { params: { page: 1 } });

    expect(mockGet).toHaveBeenCalledWith('/movies?page=1', { params: { page: 1 } });
    expect(data).toEqual(payload);
  });

  it('apiGet propaga errores cuando axios.get rechaza', async () => {
    mockGet.mockRejectedValue(new Error('network error'));

    const api = await import('../api');

    await expect(api.apiGet('/bad')).rejects.toThrow('network error');
    expect(mockGet).toHaveBeenCalledWith('/bad', undefined);
  });
});
