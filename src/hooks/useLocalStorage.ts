import { useCallback, useEffect, useState } from 'react';

export default function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const raw =
        typeof window !== 'undefined' && window.localStorage
          ? window.localStorage.getItem(key)
          : null;
      return raw
        ? (JSON.parse(raw) as T)
        : typeof initialValue === 'function'
          ? (initialValue as () => T)()
          : initialValue;
    } catch {
      return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {}
  }, [key, storedValue]);

  const setLocalValue = useCallback((valueOrUpdater: T | ((prev: T) => T)) => {
    setStoredValue((prev) =>
      typeof valueOrUpdater === 'function' ? (valueOrUpdater as (p: T) => T)(prev) : valueOrUpdater
    );
  }, []);

  return [storedValue, setLocalValue] as const;
}
