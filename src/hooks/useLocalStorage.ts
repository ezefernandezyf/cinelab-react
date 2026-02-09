import { useCallback, useEffect, useState } from 'react';

export default function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const raw = typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(key) : null;
      return raw ? (JSON.parse(raw) as T) : typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
    } catch (e) {
      if (import.meta.env.DEV) {
        console.warn(`useLocalStorage: failed to parse key "${key}", using initialValue`, e);
      }
      return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (e) {
      if (import.meta.env.DEV) {
        console.warn(`useLocalStorage: failed to persist key "${key}"`, e);
      }
    }
  }, [key, storedValue]);

  const setLocalValue = useCallback((valueOrUpdater: T | ((prev: T) => T)) => {
    setStoredValue((prev) =>
      typeof valueOrUpdater === 'function' ? (valueOrUpdater as (p: T) => T)(prev) : valueOrUpdater
    );
  }, []);

  return [storedValue, setLocalValue] as const;
}