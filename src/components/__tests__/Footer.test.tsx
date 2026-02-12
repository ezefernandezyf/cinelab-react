import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../Footer/Footer';

test('renders footer with copyright', () => {
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );
  expect(screen.getByText(/©/)).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: /footer/i })).toBeInTheDocument();
});
