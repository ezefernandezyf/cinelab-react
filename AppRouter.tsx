import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './src/pages';

export const AppRouter = (): React.JSX.Element => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};