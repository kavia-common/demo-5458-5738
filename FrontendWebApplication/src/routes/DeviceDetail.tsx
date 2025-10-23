import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { Device, StatusResponse } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const DeviceDetail: React.FC = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState<Device | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  async function load() {
    setLoading(true);
    const res = await api.getDevice(id);
    if (res.error) {
      setError(res.error.error || 'Failed to load device.');
      setLoading(false);
      return;
    }
    setDevice(res.data || null);
    setLoading(false);
  }

  async function loadStatus() {
    setStatusLoading(true);
    const res = await api.getDeviceStatus(id);
    if (res.error) {
      setToast(res.error.error || 'Failed to load status.');
    } else {
      setStatus(res.data || null);
      if (res.data) {
        setDevice((prev) => (prev ? { ...prev, status: res.data!.status } : prev));
      }
    }
    setStatusLoading(false);
  }

  useEffect(() => {
    load();
    loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handlePing() {
    setStatusLoading(true);
    const res = await api.pingDevice(id);
    if (res.error) {
      setToast(res.error.error || 'Failed to ping device.');
    } else {
      setToast(`Status: ${res.data?.status}`);
      setStatus(res.data || null);
      if (res.data) {
        setDevice((prev) => (prev ? { ...prev, status: res.data!.status } : prev));
      }
    }
    setStatusLoading(false);
  }

  async function handleDelete() {
    setConfirmOpen(true);
  }
  async function confirmDelete() {
    const res = await api.deleteDevice(id);
    if (!res.ok) {
      setToast(res.error?.error || 'Failed to delete device.');
    } else {
      navigate('/');
    }
  }

  if (loading) return <div className="container" role="status" aria-busy="true">Loading…</div>;
  if (error) return <div className="container"><div role="alert" className="alert error">{error}</div></div>;
  if (!device) return <div className="container">Device not found.</div>;

  return (
    <div className="container">
      <div className="navbar">
        <h1 className="title">Device Detail</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={handlePing} disabled={statusLoading} aria-busy={statusLoading}>
            {statusLoading ? 'Checking…' : 'Refresh Status'}
          </button>
          <Link to={`/devices/${encodeURIComponent(id)}/edit`} className="btn">Edit</Link>
          <button className="btn btn-danger" onClick={handleDelete} data-testid="delete-button">Delete</button>
        </div>
      </div>

      {toast && (
        <div role="status" className="alert" aria-live="polite">
          {toast}
          <button className="btn btn-small" onClick={() => setToast(null)} aria-label="Dismiss">✕</button>
        </div>
      )}

      <div className="card">
        <div className="row">
          <div className="col"><strong>Name</strong></div>
          <div className="col">{device.name}</div>
        </div>
        <div className="row">
          <div className="col"><strong>IP Address</strong></div>
          <div className="col">{device.ip_address}</div>
        </div>
        <div className="row">
          <div className="col"><strong>Type</strong></div>
          <div className="col">{device.device_type}</div>
        </div>
        <div className="row">
          <div className="col"><strong>Location</strong></div>
          <div className="col">{device.location}</div>
        </div>
        <div className="row">
          <div className="col"><strong>Status</strong></div>
          <div className="col"><StatusBadge status={device.status} idForTest={device.id} /></div>
        </div>
        <div className="row">
          <div className="col"><strong>Last Checked</strong></div>
          <div className="col">{status?.last_checked ? new Date(status.last_checked).toLocaleString() : '—'}</div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete device?"
        message="Are you sure you want to delete this device? This cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        data-testid="confirm-dialog"
      />
    </div>
  );
};
