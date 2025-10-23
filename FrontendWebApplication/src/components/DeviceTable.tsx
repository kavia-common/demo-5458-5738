import React, { useMemo, useState, useEffect } from 'react';
import { Device } from '../types';
import { StatusBadge } from './StatusBadge';

type SortKey = keyof Device;
type SortDir = 'asc' | 'desc';

interface Props {
  devices: Device[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPing: (id: string) => void;
  pingLoadingId?: string | null;
  /** Optional table-level loading indicator (overlay) */
  loading?: boolean;
}

// PUBLIC_INTERFACE
export const DeviceTable: React.FC<Props> = ({
  devices,
  onView,
  onEdit,
  onDelete,
  onPing,
  pingLoadingId = null,
  loading = false,
}) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = useMemo(() => {
    if (!debouncedSearch) return devices;
    return devices.filter((d) => {
      const blob = `${d.name} ${d.ip_address} ${d.device_type} ${d.location} ${d.status}`.toLowerCase();
      return blob.includes(debouncedSearch);
    });
  }, [devices, debouncedSearch]);

  const sorted = useMemo(() => {
    const clone = [...filtered];
    clone.sort((a: any, b: any) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va === vb) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === 'string' && typeof vb === 'string') {
        const cmp = va.localeCompare(vb, undefined, { numeric: true, sensitivity: 'base' });
        return sortDir === 'asc' ? cmp : -cmp;
      }
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      return 0;
    });
    return clone;
  }, [filtered, sortKey, sortDir]);

  function toggleSort(col: SortKey) {
    if (sortKey === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col);
      setSortDir('asc');
    }
  }

  function sortIndicator(col: SortKey) {
    return sortKey === col ? (sortDir === 'asc' ? '▲' : '▼') : '⇅';
    }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, gap: 8 }}>
        <input
          type="search"
          placeholder="Search devices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search devices"
          data-testid="search-input"
          style={{ flex: 1, minWidth: 200 }}
        />
      </div>

      <div style={{ position: 'relative', overflowX: 'auto' }}>
        {loading && (
          <div
            aria-live="polite"
            role="status"
            aria-busy="true"
            data-testid="devices-loading"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5,
              backdropFilter: 'blur(1px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
              <span>Loading devices…</span>
            </div>
          </div>
        )}
        <table className="table" role="table">
          <thead>
            <tr>
              <th>
                <button
                  className="sort-btn"
                  onClick={() => toggleSort('name')}
                  aria-label="Sort by name"
                  data-testid="sort-name"
                >
                  Name {sortIndicator('name')}
                </button>
              </th>
              <th>
                <button
                  className="sort-btn"
                  onClick={() => toggleSort('ip_address')}
                  aria-label="Sort by IP address"
                  data-testid="sort-ip_address"
                >
                  IP {sortIndicator('ip_address')}
                </button>
              </th>
              <th>
                <button
                  className="sort-btn"
                  onClick={() => toggleSort('device_type')}
                  aria-label="Sort by device type"
                  data-testid="sort-device_type"
                >
                  Type {sortIndicator('device_type')}
                </button>
              </th>
              <th>
                <button
                  className="sort-btn"
                  onClick={() => toggleSort('location')}
                  aria-label="Sort by location"
                  data-testid="sort-location"
                >
                  Location {sortIndicator('location')}
                </button>
              </th>
              <th>Status</th>
              <th aria-label="Actions column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((d) => (
              <tr key={d.id} data-testid={`device-row-${d.id}`}>
                <td>{d.name}</td>
                <td>{d.ip_address}</td>
                <td>{d.device_type}</td>
                <td>{d.location}</td>
                <td>
                  <StatusBadge status={d.status} idForTest={d.id} />
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button className="btn btn-small" onClick={() => onView(d.id)}>
                    View
                  </button>
                  <button className="btn btn-small" onClick={() => onEdit(d.id)} data-testid={`edit-button-${d.id}`}>
                    Edit
                  </button>
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => onDelete(d.id)}
                    data-testid={`delete-button-${d.id}`}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-small"
                    onClick={() => onPing(d.id)}
                    disabled={pingLoadingId === d.id}
                    aria-busy={pingLoadingId === d.id}
                  >
                    {pingLoadingId === d.id ? 'Pinging…' : 'Ping'}
                  </button>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#666' }}>
                  No devices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
