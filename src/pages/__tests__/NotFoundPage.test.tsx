import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../pages';

test('renderiza NotFoundPage para rutas inexistentes', () => {
  render(
    <MemoryRouter initialEntries={['/ruta-que-no-existe']}>
      <AppRoutes />
    </MemoryRouter>
  );
  expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
});
