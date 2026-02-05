import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SearchBar } from '../SearchBar/SearchBar';


describe('SearchBar', () => {
  it('shows validation error when submitting empty', async () => {
    const onSearch = vi.fn();
    render(<SearchBar defaultValue="" onSearch={onSearch} />);

    const btn = screen.getByRole('button', { name: /buscar/i });
    await userEvent.click(btn);

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('calls onSearch with trimmed query', async () => {
    const onSearch = vi.fn();
    render(<SearchBar defaultValue="" onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/buscar películas/i);
    await userEvent.type(input, '  matrix  ');
    const btn = screen.getByRole('button', { name: /buscar/i });
    await userEvent.click(btn);

    expect(onSearch).toHaveBeenCalledWith('matrix');
  });
});