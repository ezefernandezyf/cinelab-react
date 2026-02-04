import { useEffect, useRef, useState } from 'react';
import { loadAbort } from '../utilities/loadAbort.utility';

type Fetcher<T> = (signal?: AbortSignal) => Promise<T>;

type UseApiOptions<T> = {
  immediate?: boolean;
  deps?: any[];
  initialData?: T | null;
};

export default function useApi<T>(fetcher: Fetcher<T>, options: UseApiOptions<T> = {}) {
  const {
    immediate = true,
    deps = [],
    initialData = null,
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef<number>(0);

  const isAbortError = (error: unknown) => {
    const e: any = error;
    return e?.name === 'AbortError' || e?.name === 'CanceledError' || e?.code === 'ERR_CANCELED';
  };

  const fetchData = async () => {
    const requestId = ++requestIdRef.current;

    if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = loadAbort();

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher(abortControllerRef.current.signal);
      if (requestId !== requestIdRef.current) return;
      if (!result) {
        throw new Error('No data returned from API');
      }
      setData(result);
    } catch (err) {
      if (isAbortError(err)) {
        console.debug('Fetch aborted');
      } else {
        setError(err as Error);
        if (import.meta.env.DEV) {
          console.error('useApi error:', err);
        }
      }
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  };

  const refetch = async () => {
    await fetchData();
  };

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
    return () => {
      if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
        abortControllerRef.current.abort();
      }
    };
  }, deps);

  return { data, loading, error, refetch };
}
