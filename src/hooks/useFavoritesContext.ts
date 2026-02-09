import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import useFavorites from './useFavorites';

export function useFavoritesContext() {
  const ctx = useContext(FavoritesContext);
  if (ctx) {
    return ctx;
  }
  return useFavorites();
}
