import React from 'react';
import useFavorites from '../hooks/useFavorites';
import { FavoritesContext } from './FavoritesContext';

interface FavoritesProviderProps {
  children: React.ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps): React.JSX.Element => {
  const favApi = useFavorites();
  return <FavoritesContext.Provider value={favApi}>{children}</FavoritesContext.Provider>;
};

export default FavoritesProvider;
