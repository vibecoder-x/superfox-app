'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type ActivityDialogProps = {
  label: string;
  onClose: () => void;
  className?: string;
  closeOnBackdrop?: boolean;
  children: ReactNode;
};

/** Native modal dialogs isolate the background and keep keyboard focus inside. */
export default function ActivityDialog({ label, onClose, className = '', closeOnBackdrop = false, children }: ActivityDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();

    const handleCancel = (event: Event) => {
      event.preventDefault();
      closeRef.current();
    };
    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      onClick={event => { if (closeOnBackdrop && event.target === event.currentTarget) onClose(); }}
      className={`m-0 h-[100dvh] max-h-none w-full max-w-none border-0 text-inherit ${className}`}
    >
      {children}
    </dialog>
  );
}
