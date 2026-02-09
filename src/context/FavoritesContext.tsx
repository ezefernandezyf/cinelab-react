import { createContext } from 'react';

export type FavoritesApi = {
  favorites: number[];
  isFavorite: (id: number) => boolean;
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  toggleFavorite: (id: number) => void;
  clearFavorites: () => void;
};

export const FavoritesContext = createContext<FavoritesApi | null>(null);