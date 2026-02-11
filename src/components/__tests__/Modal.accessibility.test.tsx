import React, { useRef, useState } from 'react';
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import Modal from '../Modal/Modal';

beforeEach(() => {

  document.body.innerHTML = '';
});

afterEach(() => {
  cleanup();
});

function TestWrapper({
  onCloseMock,
  children,
}: {
  onCloseMock: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const openBtnRef = useRef<HTMLButtonElement | null>(null);

  const handleClose = () => {
    onCloseMock();
    setOpen(false);
  };

  return (
    <div>
      <button data-testid="open-button" ref={openBtnRef} onClick={() => setOpen(true)}>
        Open modal
      </button>

      <Modal open={open} onClose={handleClose} title="Test Modal">
        {children}
      </Modal>
    </div>
  );
}

describe('Modal accessibility and keyboard behavior', () => {
  it('renders dialog with role and aria-modal when opened', async () => {
    const mock = vi.fn();

    render(
      <TestWrapper onCloseMock={mock}>
        <div>
          <button>Action</button>
        </div>
      </TestWrapper>
    );

    const openBtn = screen.getByTestId('open-button');
    await userEvent.click(openBtn);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    const title = dialog.querySelector('#modal-title');
    expect(title).toBeTruthy();
  });

  it('pressing Escape calls onClose and closes the modal', async () => {
    const mock = vi.fn();

    render(
      <TestWrapper onCloseMock={mock}>
        <div>
          <button>Action</button>
        </div>
      </TestWrapper>
    );

    const openBtn = screen.getByTestId('open-button');
    await userEvent.click(openBtn);

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(mock).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('clicking on backdrop closes the modal', async () => {
    const mock = vi.fn();

    render(
      <TestWrapper onCloseMock={mock}>
        <div>
          <button>Inner</button>
        </div>
      </TestWrapper>
    );

    const openBtn = screen.getByTestId('open-button');
    await userEvent.click(openBtn);

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    const dialog = screen.getByRole('dialog');

    const overlay = dialog.parentElement as HTMLElement;
    expect(overlay).toBeTruthy();

    fireEvent.mouseDown(overlay);
    fireEvent.mouseUp(overlay);

    await waitFor(() => {
      expect(mock).toHaveBeenCalled();
    });
  });

  it('Tab cycles through focusable elements inside the modal (forward and backward)', async () => {
    const mock = vi.fn();

    render(
      <TestWrapper onCloseMock={mock}>
        <div>
          <button data-testid="b1">B1</button>
          <button data-testid="b2">B2</button>
          <button data-testid="b3">B3</button>
        </div>
      </TestWrapper>
    );

    const openBtn = screen.getByTestId('open-button');
    openBtn.focus();
    await userEvent.click(openBtn);

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    const btn1 = screen.getByTestId('b1') as HTMLElement;
    const btn2 = screen.getByTestId('b2') as HTMLElement;
    const btn3 = screen.getByTestId('b3') as HTMLElement;

    await userEvent.tab();
    expect(document.activeElement).toBe(btn1);

    await userEvent.tab();
    expect(document.activeElement).toBe(btn2);

    await userEvent.tab();
    expect(document.activeElement).toBe(btn3);

    await userEvent.tab();
    expect(document.activeElement).toBe(btn1);

    await userEvent.tab({ shift: true });
    expect(document.activeElement).toBe(btn3);

    await userEvent.tab({ shift: true });
    expect(document.activeElement).toBe(btn2);
  });

  it('restores focus to the trigger button after closing', async () => {
    const mock = vi.fn();

    render(
      <TestWrapper onCloseMock={mock}>
        <div>
          <button data-testid="inner">Inner</button>
        </div>
      </TestWrapper>
    );

    const openBtn = screen.getByTestId('open-button') as HTMLElement;
    // focus the trigger, open modal
    openBtn.focus();
    await userEvent.click(openBtn);

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    // close using Escape
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    await waitFor(() => expect(mock).toHaveBeenCalled());

    // After modal closes, focus should return to trigger button
    await waitFor(() => {
      expect(document.activeElement).toBe(openBtn);
    });
  });
});