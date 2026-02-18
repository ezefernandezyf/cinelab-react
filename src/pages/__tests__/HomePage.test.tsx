import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../pages';

test('renderiza HomePage en la ruta /home', () => {
  render(
    <MemoryRouter initialEntries={['/home']}>
      <AppRoutes />
    </MemoryRouter>
  );
  expect(screen.getByRole('heading', { name: /bienvenido a cinelab|home/i })).toBeInTheDocument();
});
