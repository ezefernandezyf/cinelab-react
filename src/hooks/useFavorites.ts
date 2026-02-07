import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'cinelab:favorites';

export default function useFavorites () {
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as number[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const isFavorite = useCallback((id: number) => favorites.includes(id), [favorites]);

  const addFavorite = useCallback((id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removeFavorite = useCallback((id: number) => {
    setFavorites((prev) => prev.filter((favId) => favId !== id));
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
  } as const;
};
