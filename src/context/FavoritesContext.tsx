import useFavorites from '../hooks/useFavorites';
import { createContext, type ReactNode } from 'react';

type FavoritesContextType = ReturnType<typeof useFavorites> | null;

export const FavoritesContext = createContext<FavoritesContextType>(null);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const favApi = useFavorites();

  return <FavoritesContext.Provider value={favApi}>{children}</FavoritesContext.Provider>;
};

