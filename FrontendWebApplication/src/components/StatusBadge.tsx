import React from 'react';
import { DeviceStatus } from '../types';

interface Props {
  status: DeviceStatus;
  idForTest?: string;
}

// PUBLIC_INTERFACE
export const StatusBadge: React.FC<Props> = ({ status, idForTest }) => {
  /**
   * Accessible colored badge for device status:
   * - Green: online
   * - Red: offline
   * - Gray: unknown
   */
  const color = status === 'online' ? '#2e7d32' : status === 'offline' ? '#c62828' : '#6c757d';
  const label = status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : 'Unknown';
  return (
    <span
      aria-label={`Status: ${label}`}
      role="status"
      data-testid={idForTest ? `status-badge-${idForTest}` : 'status-badge'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '2px 8px',
        borderRadius: 999,
        background: '#f1f3f5',
        color: '#333',
        fontSize: 12,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: color,
          display: 'inline-block',
          boxShadow: `0 0 0 2px ${color}22`,
        }}
      />
      {label}
    </span>
  );
};
