import { useEffect, useRef, useState, useCallback } from 'react';
import { loadAbort } from '../utilities/loadAbort.utility';
import logger from '../utilities/logger';

type Fetcher<T> = (signal?: AbortSignal) => Promise<T>;

export type UseApiOptions<T> = {
  immediate?: boolean;
  initialData?: T | null;
};

export default function useApi<T>(fetcher: Fetcher<T>, options: UseApiOptions<T> = {}) {
  const { immediate = true, initialData = null } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef<number>(0);

  const isAbortError = (err: unknown) => {
    if (!err || typeof err !== 'object') return false;
    const maybe = err as { name?: unknown; code?: unknown };
    return (
      maybe.name === 'AbortError' || maybe.name === 'CanceledError' || maybe.code === 'ERR_CANCELED'
    );
  };

  const fetchData = useCallback(async () => {
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
      if (result === null || typeof result === 'undefined') {
        throw new Error('No data returned from API');
      }
      setData(result);
    } catch (err) {
      if (isAbortError(err)) {
        logger.debug('useApi fetch aborted');
      } else {
        setError(err as Error);
        // Keep error logging but centralised
        logger.error('useApi error:', err);
      }
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [fetcher]);

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
  }, [fetchData, immediate]);

  return { data, loading, error, refetch };
}
