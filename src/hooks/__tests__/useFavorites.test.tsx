import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import  useFavorites from '../useFavorites';


function TestComponent() {
  const { favorites, isFavorite, toggleFavorite, addFavorite, removeFavorite, clearFavorites } = useFavorites();

  return (
    <div>
      <div data-testid="favorites">{JSON.stringify(favorites)}</div>
      <button onClick={() => addFavorite(1)} data-testid="add-1">add-1</button>
      <button onClick={() => toggleFavorite(1)} data-testid="toggle-1">toggle-1</button>
      <button onClick={() => removeFavorite(1)} data-testid="remove-1">remove-1</button>
      <button onClick={() => clearFavorites()} data-testid="clear">clear</button>
      <div data-testid="isFav-1">{String(isFavorite(1))}</div>
    </div>
  );
}

describe('useFavorites hook (integration test via component)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes from empty localStorage and toggles favorites + persists', async () => {
    const user = userEvent.setup();

    render(<TestComponent />);

    expect(screen.getByTestId('favorites').textContent).toBe('[]');
    expect(screen.getByTestId('isFav-1').textContent).toBe('false');

    await user.click(screen.getByTestId('add-1'));
    expect(screen.getByTestId('favorites').textContent).toBe('[1]');
    expect(screen.getByTestId('isFav-1').textContent).toBe('true');

    expect(JSON.parse(localStorage.getItem('cinelab:favorites') || '[]')).toEqual([1]);

    await user.click(screen.getByTestId('toggle-1'));
    expect(screen.getByTestId('favorites').textContent).toBe('[]');
    expect(screen.getByTestId('isFav-1').textContent).toBe('false');
    expect(JSON.parse(localStorage.getItem('cinelab:favorites') || '[]')).toEqual([]);

    await user.click(screen.getByTestId('toggle-1'));
    expect(screen.getByTestId('favorites').textContent).toBe('[1]');
    expect(JSON.parse(localStorage.getItem('cinelab:favorites') || '[]')).toEqual([1]);

    await user.click(screen.getByTestId('remove-1'));
    expect(screen.getByTestId('favorites').textContent).toBe('[]');

    await user.click(screen.getByTestId('add-1'));
    expect(screen.getByTestId('favorites').textContent).toBe('[1]');
    await user.click(screen.getByTestId('clear'));
    expect(screen.getByTestId('favorites').textContent).toBe('[]');
  });

  it('initializes from existing localStorage value', () => {
    localStorage.setItem('cinelab:favorites', JSON.stringify([2, 3]));
    render(<TestComponent />);
    expect(screen.getByTestId('favorites').textContent).toBe('[2,3]');
    expect(screen.getByTestId('isFav-1').textContent).toBe('false');
  });
});