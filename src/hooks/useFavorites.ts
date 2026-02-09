import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

export default function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<number[]>('cinelab:favorites', []);

  const isFavorite = useCallback((id: number) => favorites.includes(id), [favorites]);

  const addFavorite = useCallback((id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev : [id, ...prev]));
  }, [setFavorites]);

  const removeFavorite = useCallback((id: number) => {
    setFavorites((prev) => prev.filter((favId) => favId !== id));
  }, [setFavorites]);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [id, ...prev]
    );
  }, [setFavorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
  } as const;
}