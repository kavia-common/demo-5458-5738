import React, { useState } from 'react';
import { DeviceForm } from '../components/DeviceForm';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { DeviceInput } from '../types';

export const DeviceCreate: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function onSubmit(values: DeviceInput) {
    setSubmitting(true);
    setError(null);
    const res = await api.createDevice(values);
    setSubmitting(false);
    if (res.error) {
      setError(res.error.error || 'Failed to create device.');
      return;
    }
    // Always redirect back to the devices list on success
    navigate('/', { replace: true });
  }

  function handleCancel() {
    // Navigate back to devices list without submitting
    navigate('/', { replace: true });
  }

  return (
    <div className="container">
      <div className="navbar">
        <h1 className="title">Add Device</h1>
        <div>
          <button
            type="button"
            className="btn btn-small"
            onClick={handleCancel}
            data-testid="back-button"
            aria-label="Back to devices list"
          >
            Back
          </button>
        </div>
      </div>
      <DeviceForm
        initial={null}
        onSubmit={onSubmit}
        submitting={submitting}
        error={error}
        onCancel={handleCancel}
      />
    </div>
  );
};
