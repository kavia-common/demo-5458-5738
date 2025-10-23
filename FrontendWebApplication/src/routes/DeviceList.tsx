import React, { useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import { Device } from '../types';
import { DeviceTable } from '../components/DeviceTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Loader } from '../components/Loader';

export const DeviceList: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // start true to avoid flash of empty content
  const [error, setError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [pingLoadingId, setPingLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const mountedRef = useRef(false);

  // PUBLIC_INTERFACE
  async function load() {
    setLoading(true);
    setError(null);
    const res = await api.listDevices();
    if (res.error) {
      setError(res.error.error || 'Failed to load devices.');
      setDevices([]); // ensure empty array on error
    } else {
      setDevices(res.data || []);
    }
    setLoading(false);
  }

  // Initial load on mount and when coming back from other routes to ensure fresh data
  useEffect(() => {
    // When DeviceList mounts or the pathname is '/', fetch data and show loader.
    // location.pathname will be '/' per configured route.
    load();
    mountedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]); // react to navigation events so loader shows on back/forward

  async function handleDelete(id: string) {
    setConfirmId(id);
  }
  async function confirmDelete() {
    if (!confirmId) return;
    setLoading(true); // reflect refetch after deletion
    const res = await api.deleteDevice(confirmId);
    if (!res.ok) {
      setToast(res.error?.error || 'Failed to delete device');
    } else {
      setToast('Device deleted.');
      setDevices((prev) => prev.filter((d) => d.id !== confirmId));
    }
    setConfirmId(null);
    setLoading(false);
  }

  async function handlePing(id: string) {
    setPingLoadingId(id);
    const res = await api.pingDevice(id);
    if (res.error) {
      setToast(res.error.error || 'Failed to ping device');
    } else {
      setToast(`Status: ${res.data?.status}`);
      // Optimistically update device status if exists:
      setDevices((prev) =>
        prev.map((d) => (d.id === id && res.data ? { ...d, status: res.data.status } : d)),
      );
    }
    setPingLoadingId(null);
  }

  // Manual refresh action (optional future-use)
  async function handleRefresh() {
    await load();
  }

  return (
    <div className="container">
      <div className="navbar">
        <h1 className="title">Devices</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            className="btn btn-small"
            onClick={handleRefresh}
            aria-label="Refresh devices"
          >
            Refresh
          </button>
          <Link to="/devices/new" className="btn btn-large">+ Add Device</Link>
        </div>
      </div>

      {error && <div role="alert" className="alert error">{error}</div>}
      {toast && (
        <div role="status" className="alert" aria-live="polite">
          {toast}
          <button className="btn btn-small" onClick={() => setToast(null)} aria-label="Dismiss">✕</button>
        </div>
      )}

      {loading ? (
        <Loader message="Loading devices…" data-testid="devices-loading" />
      ) : (
        <DeviceTable
          devices={devices}
          onView={(id) => navigate(`/devices/${encodeURIComponent(id)}`)}
          onEdit={(id) => navigate(`/devices/${encodeURIComponent(id)}/edit`)}
          onDelete={handleDelete}
          onPing={handlePing}
          pingLoadingId={pingLoadingId}
        />
      )}

      <ConfirmDialog
        open={!!confirmId}
        title="Delete device?"
        message="Are you sure you want to delete this device? This action cannot be undone."
        onCancel={() => setConfirmId(null)}
        onConfirm={confirmDelete}
        data-testid="confirm-dialog"
      />
    </div>
  );
};
