import React from 'react';

interface LoaderProps {
  /**
   * Optional message displayed alongside the loader spinner.
   */
  message?: string;
  /**
   * Optional data-testid hook to aid testing.
   */
  'data-testid'?: string;
}

// PUBLIC_INTERFACE
export const Loader: React.FC<LoaderProps> = ({ message = 'Loading…', 'data-testid': dataTestId }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      data-testid={dataTestId || 'loader'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: '2px solid #9ca3af',
          borderTopColor: '#3b82f6',
          animation: 'spin 0.9s linear infinite',
          display: 'inline-block',
        }}
      />
      <span>{message}</span>
      <style>
        {`@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}
      </style>
    </div>
  );
};
