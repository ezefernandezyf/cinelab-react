import { render, waitFor, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import useLocalStorage from '../useLocalStorage';
import userEvent from '@testing-library/user-event';

function TestComponent() {
  const [value, setValue] = useLocalStorage<number>('test-key', 0);

  return (
    <div>
      <div data-testid="value">{value}</div>
      <button data-testid="btn-set-5" onClick={() => setValue(5)}></button>
      <button data-testid="btn-inc" onClick={() => setValue((prev) => prev + 1)}></button>
    </div>
  );
}

describe('useLocalStorage hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes from default value and updates localStorage', async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    expect(screen.getByTestId('value').textContent).toBe('0');
    await user.click(screen.getByTestId('btn-set-5'));
    await screen.findByText('5');
    await waitFor(() => expect(localStorage.getItem('test-key')).toBe('5'));
    await user.click(screen.getByTestId('btn-inc'));
    await screen.findByText('6');
    await waitFor(() => expect(localStorage.getItem('test-key')).toBe('6'));
  });

  it('initializes from existing localStorage value', () => {
    localStorage.setItem('test-key', JSON.stringify(42));
    render(<TestComponent />);
    expect(screen.getByTestId('value').textContent).toBe('42');
  });

  it('handles non-JSON localStorage values gracefully', () => {
    localStorage.setItem('test-key', 'not-a-json');
    render(<TestComponent />);
    expect(screen.getByTestId('value').textContent).toBe('0');
  });
});
