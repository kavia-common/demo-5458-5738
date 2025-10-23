import React, { useEffect, useState } from 'react';
import { DeviceForm } from '../components/DeviceForm';
import { api } from '../api/client';
import { useNavigate, useParams } from 'react-router-dom';
import { Device, DeviceInput } from '../types';

export const DeviceEdit: React.FC = () => {
  const { id = '' } = useParams();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await api.getDevice(id);
      if (res.error) {
        setError(res.error.error || 'Failed to load device.');
      } else {
        setDevice(res.data || null);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  async function onSubmit(values: DeviceInput) {
    setSubmitting(true);
    setError(null);
    const res = await api.updateDevice(id, values);
    setSubmitting(false);
    if (res.error) {
      setError(res.error.error || 'Failed to update device.');
      return;
    }
    navigate(`/devices/${encodeURIComponent(id)}`);
  }

  if (loading) return <div className="container" role="status" aria-busy="true">Loading…</div>;
  if (error) return <div className="container"><div role="alert" className="alert error">{error}</div></div>;
  if (!device) return <div className="container">Device not found.</div>;

  return (
    <div className="container">
      <div className="navbar">
        <h1 className="title">Edit Device</h1>
      </div>
      <DeviceForm initial={device} onSubmit={onSubmit} submitting={submitting} error={null} />
    </div>
  );
};
