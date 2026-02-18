import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../HomePage/HomePage';
import { Layout } from '../../components';
import { NotFoundPage } from '../NotFoundPage/NotFoundPage';
import SearchPage from '../SearchPage/SearchPage';
import FavoritesPage from '../FavoritesPage/FavoritesPage';
import MovieDetailPage from '../MovieDetail/MovieDetailPage';
import PrivacyPage from '../PrivacyPage/PrivacyPage';
import AboutPage from '../AboutPage/AboutPage';

export const AppRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="movie/:id" element={<MovieDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="not-found" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Route>
    </Routes>
  );
};
