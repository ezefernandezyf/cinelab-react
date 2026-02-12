import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, afterEach, vi, type Mock } from 'vitest';
import useApi, { type UseApiOptions } from '../useApi';

type FetcherMock<T> = Mock & ((signal?: AbortSignal) => Promise<T>);

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

function makeTestComponent<T>(fetcher: FetcherMock<T>, options?: UseApiOptions<T>) {
  return function TestComponent() {
    const { data, loading, error, refetch } = useApi<T>(fetcher, options);
    return (
      <div>
        <div data-testid="data">{JSON.stringify(data)}</div>
        <div data-testid="loading">{String(loading)}</div>
        <div data-testid="error">{error ? String(error) : ''}</div>
        <button data-testid="refetch" onClick={() => void refetch()}>
          refetch
        </button>
      </div>
    );
  };
}

describe('useApi hook', () => {
  it('A - immediate=true: starts loading then resolves and sets data', async () => {
    type Payload = { foo: string };
    const value: Payload = { foo: 'bar' };

    let resolver: (v: Payload) => void = () => {};
    const promise = new Promise<Payload>((res) => {
      resolver = res;
    });

    const fetcher = vi.fn(() => promise) as FetcherMock<Payload>;

    const TestComponent = makeTestComponent<Payload>(fetcher);
    render(<TestComponent />);

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('loading').textContent).toBe('true');

    resolver(value);

    await waitFor(() => {
      expect(screen.getByTestId('data').textContent).toContain(JSON.stringify(value));
    });

    expect(screen.getByTestId('loading').textContent).toBe('false');
    expect(screen.getByTestId('error').textContent).toBe('');
  });

  it('A2 - immediate=false and initialData: does not call fetcher until refetch and shows initialData', async () => {
    type Payload = { foo: string };
    // initial now matches the Payload shape to satisfy TypeScript
    const initial: Payload = { foo: 'init' };
    const value: Payload = { foo: 'baz' };

    const fetcher = vi.fn().mockResolvedValue(value) as FetcherMock<Payload>;

    const TestComponent = makeTestComponent<Payload>(fetcher, { immediate: false, initialData: initial });
    render(<TestComponent />);

    expect(fetcher).not.toHaveBeenCalled();
    expect(screen.getByTestId('data').textContent).toContain(JSON.stringify(initial));
    expect(screen.getByTestId('loading').textContent).toBe('false');

    const user = userEvent.setup();
    await user.click(screen.getByTestId('refetch'));

    expect(fetcher).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByTestId('data').textContent).toContain(JSON.stringify(value));
    });
    expect(screen.getByTestId('loading').textContent).toBe('false');
    expect(screen.getByTestId('error').textContent).toBe('');
  });

  it('B - fetcher resolves correctly: data set and loading false', async () => {
    type Payload = { hello: string };
    const value: Payload = { hello: 'world' };
    const fetcher = vi.fn().mockResolvedValue(value) as FetcherMock<Payload>;

    const TestComponent = makeTestComponent<Payload>(fetcher);
    render(<TestComponent />);

    expect(fetcher).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByTestId('data').textContent).toContain(JSON.stringify(value));
    });

    expect(screen.getByTestId('loading').textContent).toBe('false');
    expect(screen.getByTestId('error').textContent).toBe('');
  });

  it('C - fetcher rejects: error is exposed and loading becomes false', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('boom')) as FetcherMock<unknown>;

    const TestComponent = makeTestComponent(fetcher);
    render(<TestComponent />);

    expect(fetcher).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toContain('boom');
    });

    expect(screen.getByTestId('loading').textContent).toBe('false');
  });

  it('D - refetch calls fetcher again and updates data with latest result', async () => {
    type V = { step: number };
    const v1: V = { step: 1 };
    const v2: V = { step: 2 };

    const fetcherMock = vi
      .fn()
      .mockResolvedValueOnce(v1)
      .mockResolvedValueOnce(v2) as FetcherMock<V>;

    const TestComponent = makeTestComponent<V>(fetcherMock, { immediate: false, initialData: null });
    render(<TestComponent />);

    const user = userEvent.setup();

    await user.click(screen.getByTestId('refetch'));
    expect(fetcherMock).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByTestId('data').textContent).toContain(JSON.stringify(v1)));

    await user.click(screen.getByTestId('refetch'));
    expect(fetcherMock).toHaveBeenCalledTimes(2);
    await waitFor(() => expect(screen.getByTestId('data').textContent).toContain(JSON.stringify(v2)));
  });

  it('E - AbortSignal: aborted request does not set data; later successful request applies', async () => {
    type R = { from: string };

    const fetcher = vi
      .fn()
      .mockImplementationOnce((signal?: AbortSignal) => {
        return new Promise<R>((resolve, reject) => {
          if (signal?.aborted) return reject(Object.assign(new Error('Aborted'), { name: 'AbortError' }));
          const onAbort = () => reject(Object.assign(new Error('Aborted'), { name: 'AbortError' }));
          signal?.addEventListener('abort', onAbort);
          const id = setTimeout(() => {
            signal?.removeEventListener('abort', onAbort);
            resolve({ from: 'first' });
          }, 80);
          signal?.addEventListener('abort', () => clearTimeout(id));
        });
      })
      .mockImplementationOnce(() => Promise.resolve({ from: 'second' })) as FetcherMock<R>;

    const TestComponent = makeTestComponent<R>(fetcher, { immediate: false, initialData: null });
    render(<TestComponent />);

    const user = userEvent.setup();

    await user.click(screen.getByTestId('refetch'));
    expect(fetcher).toHaveBeenCalledTimes(1);
    await user.click(screen.getByTestId('refetch'));
    expect(fetcher).toHaveBeenCalledTimes(2);

    await waitFor(() => expect(screen.getByTestId('data').textContent).toContain(JSON.stringify({ from: 'second' })));
    expect(screen.getByTestId('error').textContent).toBe('');
  });
});