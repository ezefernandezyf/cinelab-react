import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import Header from '../Header/Header';
import { MemoryRouter } from 'react-router-dom';
import { useFavoritesContext } from '../../hooks/useFavoritesContext';
import FavoritesProvider from '../../context/FavoritesProvider';

function TestToggle() {
  const fav = useFavoritesContext();

  return (
    <div>
      <button data-testid="btn-add" onClick={() => fav.addFavorite(42)}>
        Add 42
      </button>
      <button data-testid="btn-toggle" onClick={() => fav.toggleFavorite(42)}>
        Toggle 42
      </button>
      <button data-testid="btn-clear" onClick={() => fav.clearFavorites()}>
        Clear
      </button>
    </div>
  );
}

describe('Header favorites counter (integration with FavoritesProvider)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('muestra 0 inicialmente y se actualiza al agregar un favorito', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <FavoritesProvider>
          <Header />
          <TestToggle />
        </FavoritesProvider>
      </MemoryRouter>
    );

    // Hay al menos un enlace "Favoritos" (puede haber Desktop + Mobile)
    const favLinks = screen.getAllByRole('link', { name: /favoritos/i });
    expect(favLinks.length).toBeGreaterThan(0);

    expect(screen.getByText('0')).toBeInTheDocument();

    await user.click(screen.getByTestId('btn-add'));

    await waitFor(() => expect(screen.getByText('1')).toBeInTheDocument());
  });

  it('se puede alternar y limpiar favoritos y el contador refleja los cambios', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <FavoritesProvider>
          <Header />
          <TestToggle />
        </FavoritesProvider>
      </MemoryRouter>
    );

    // Añadimos
    await user.click(screen.getByTestId('btn-add'));
    await waitFor(() => expect(screen.getByText('1')).toBeInTheDocument());

    // Toggle quita -> 0
    await user.click(screen.getByTestId('btn-toggle'));
    await waitFor(() => expect(screen.getByText('0')).toBeInTheDocument());

    // Añadimos otra vez y luego clear
    await user.click(screen.getByTestId('btn-add'));
    await waitFor(() => expect(screen.getByText('1')).toBeInTheDocument());

    await user.click(screen.getByTestId('btn-clear'));
    await waitFor(() => expect(screen.getByText('0')).toBeInTheDocument());
  });
});
