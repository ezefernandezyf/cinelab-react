import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';

import HeaderSearch from '../HeaderSearch/HeaderSearch';

function LocationDisplay() {
  const location = useLocation();
  return (
    <div data-testid="location">
      {location.pathname}
      {location.search}
    </div>
  );
}

beforeEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('HeaderSearch (MemoryRouter integration)', () => {
  it('renders with role=search and correct aria-label', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <HeaderSearch />
      </MemoryRouter>
    );

    const form = screen.getByRole('search');
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute('aria-label', 'Buscar películas');
  });

  it('navigates to /search?q=... when submitted with text (encoded)', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <HeaderSearch />
        <LocationDisplay />
      </MemoryRouter>
    );

    const input = screen.getByLabelText('Buscar películas', {
      selector: 'input',
    }) as HTMLInputElement;
    const button = screen.getByRole('button', { name: /buscar/i });

    await user.type(input, 'matrix 2000');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toBe('/search?q=matrix%202000');
    });
  });

  it('does NOT navigate when submitted with empty input', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <HeaderSearch />
        <LocationDisplay />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /buscar/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toBe('/');
    });
  });

  it('respects inputId prop and applies className to the form', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <HeaderSearch inputId="mobile-search" className="my-form-class" />
      </MemoryRouter>
    );

    const input = document.getElementById('mobile-search') as HTMLInputElement | null;
    expect(input).toBeTruthy();

    const form = screen.getByRole('search');
    expect(form.classList.contains('my-form-class')).toBe(true);
  });
});
