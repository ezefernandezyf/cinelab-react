import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import useFavorites from './useFavorites';

export function useFavoritesContext() {
  const ctx = useContext(FavoritesContext);
  const fallback = useFavorites();
  return ctx ?? fallback;
}

export default useFavoritesContext;
