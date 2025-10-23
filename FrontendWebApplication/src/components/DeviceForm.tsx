import React, { useEffect, useState } from 'react';
import { DeviceInput, Device } from '../types';
import { isValidIPv4 } from '../api/client';

interface Props {
  initial?: Device | null;
  onSubmit: (values: DeviceInput) => Promise<void>;
  submitting?: boolean;
  error?: string | null;
  // PUBLIC_INTERFACE
  onCancel?: () => void; // optional cancel/back handler
}

// PUBLIC_INTERFACE
export const DeviceForm: React.FC<Props> = ({ initial, onSubmit, submitting = false, error = null, onCancel }) => {
  const [values, setValues] = useState<DeviceInput>({
    name: '',
    ip_address: '',
    device_type: '',
    location: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DeviceInput, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      const { name, ip_address, device_type, location } = initial;
      setValues({ name, ip_address, device_type, location });
    }
  }, [initial]);

  function validate(v: DeviceInput) {
    const e: Partial<Record<keyof DeviceInput, string>> = {};
    if (!v.name.trim()) e.name = 'Name is required.';
    if (!v.ip_address.trim()) e.ip_address = 'IP address is required.';
    else if (!isValidIPv4(v.ip_address)) e.ip_address = 'Please enter a valid IPv4 address.';
    if (!v.device_type.trim()) e.device_type = 'Device type is required.';
    if (!v.location.trim()) e.location = 'Location is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate(values)) return;
    try {
      await onSubmit(values);
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to submit form.');
    }
  }

  function setField<K extends keyof DeviceInput>(key: K, value: DeviceInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  const anyError = submitError || error;

  return (
    <form onSubmit={handleSubmit} aria-labelledby="device-form-title" noValidate>
      <div className="form-group">
        <label htmlFor="name">Device Name</label>
        <input
          id="name"
          type="text"
          value={values.name}
          onChange={(e) => setField('name', e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          data-testid="input-name"
          required
        />
        {errors.name && <div id="name-error" role="alert" className="error-text">{errors.name}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="ip_address">IP Address (IPv4)</label>
        <input
          id="ip_address"
          type="text"
          value={values.ip_address}
          onChange={(e) => setField('ip_address', e.target.value)}
          aria-invalid={!!errors.ip_address}
          aria-describedby={errors.ip_address ? 'ip-error' : undefined}
          data-testid="input-ip"
          required
          inputMode="numeric"
          placeholder="e.g., 192.168.1.10"
        />
        {errors.ip_address && <div id="ip-error" role="alert" className="error-text">{errors.ip_address}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="device_type">Device Type</label>
        <input
          id="device_type"
          type="text"
          value={values.device_type}
          onChange={(e) => setField('device_type', e.target.value)}
          aria-invalid={!!errors.device_type}
          aria-describedby={errors.device_type ? 'type-error' : undefined}
          data-testid="input-type"
          required
        />
        {errors.device_type && <div id="type-error" role="alert" className="error-text">{errors.device_type}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input
          id="location"
          type="text"
          value={values.location}
          onChange={(e) => setField('location', e.target.value)}
          aria-invalid={!!errors.location}
          aria-describedby={errors.location ? 'location-error' : undefined}
          data-testid="input-location"
          required
        />
        {errors.location && <div id="location-error" role="alert" className="error-text">{errors.location}</div>}
      </div>

      {anyError && <div role="alert" className="alert error" data-testid="form-error">{anyError}</div>}

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button
          type="submit"
          className="btn"
          disabled={submitting}
          data-testid="submit-button"
          aria-busy={submitting}
        >
          {submitting ? 'Saving...' : 'Save'}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            data-testid="cancel-button"
            aria-label="Cancel and go back"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
