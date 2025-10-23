import React, { useEffect, useRef } from 'react';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  'data-testid'?: string;
}

// PUBLIC_INTERFACE
export const ConfirmDialog: React.FC<Props> = ({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  'data-testid': dataTestId,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => firstButtonRef.current?.focus(), 0);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onCancel();
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      ref={dialogRef}
      data-testid={dataTestId}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onCancel();
      }}
    >
      <div
        style={{
          background: '#fff',
          color: '#111',
          width: '90%',
          maxWidth: 420,
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        }}
      >
        <h2 id="confirm-title" style={{ marginTop: 0 }}>{title}</h2>
        <p id="confirm-message">{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <button
            ref={firstButtonRef}
            onClick={onCancel}
            className="btn btn-secondary"
            aria-label={`${cancelText} deletion`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-danger"
            data-testid="confirm-delete-button"
            aria-label={`${confirmText} deletion`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
