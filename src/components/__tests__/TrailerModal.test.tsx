import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import TrailerModal from '../Modal/TrailerModal';
import { useState } from 'react';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

function TestWrapper({
  initialOpen = true,
  trailerKey,
  onCloseMock,
}: {
  initialOpen?: boolean;
  trailerKey?: string | undefined;
  onCloseMock?: () => void;
}) {
  const [open, setOpen] = useState(initialOpen);
  const handleClose = () => {
    onCloseMock?.();
    setOpen(false);
  };
  return (
    <TrailerModal
      trailerKey={trailerKey}
      open={open}
      onClose={handleClose}
      title="Test Movie"
    />
  );
}

describe('TrailerModal', () => {
  it('does not render the dialog when open is false', async () => {
    render(<TestWrapper initialOpen={false} trailerKey="abc123" />);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });

  it('renders iframe with correct src when open and trailerKey provided', async () => {
    render(<TestWrapper initialOpen={true} trailerKey="abc123" />);

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    const iframe = await screen.findByTitle('Trailer de Test Movie');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', expect.stringContaining('abc123'));
  });

  it('shows "No hay trailer disponible" when open but trailerKey is not provided', async () => {
    render(<TestWrapper initialOpen={true} trailerKey={undefined} />);

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    expect(screen.getByText(/No hay trailer disponible/i)).toBeInTheDocument();
    expect(screen.queryByTitle(/Trailer de Test Movie/i)).toBeNull();
  });

  it('calls onClose and unmounts when the close button is clicked', async () => {
    const onCloseMock = vi.fn();
    render(<TestWrapper initialOpen={true} trailerKey="xyz789" onCloseMock={onCloseMock} />);

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    const closeBtn = screen.getByLabelText('Cerrar trailer');
    await userEvent.click(closeBtn);

    expect(onCloseMock).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });

  it('clears iframe src before calling onClose when clicking the close button (defensive)', async () => {
    const onCloseMock = vi.fn();
    render(<TestWrapper initialOpen={true} trailerKey="clearme" onCloseMock={onCloseMock} />);

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    const iframe = await screen.findByTitle('Trailer de Test Movie');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', expect.stringContaining('clearme'));

    const closeBtn = screen.getByLabelText('Cerrar trailer');
    fireEvent.click(closeBtn);

    expect(onCloseMock).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.queryByTitle('Trailer de Test Movie')).toBeNull();
    });
  });
});