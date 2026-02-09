import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../HomePage/HomePage';
import { Layout } from '../../components';
import { NotFoundPage } from '../NotFoundPage/NotFoundPage';
import SearchPage from '../SearchPage/SearchPage';
import FavoritesPage from '../FavoritesPage/FavoritesPage';
import MovieDetailPage from '../MovieDetail/MovieDetailPage';


export const AppRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path='movie/:id' element={<MovieDetailPage />} />
        <Route path="not-found" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Route>
    </Routes>
  );
};