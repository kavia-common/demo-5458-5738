import { Device, DeviceInput, DeviceListResponse, StatusResponse, ApiError } from '../types';

/**
 * API client
 * - Base URL is constructed from REACT_APP_API_BASE with default same-origin, and '/api' path segment.
 * - All requests send and expect JSON.
 */
const API_BASE = (process.env.REACT_APP_API_BASE || '') + '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<{ data?: T; error?: ApiError; status: number }> {
  const url = `${API_BASE}${path}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
    const status = res.status;
    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await res.json() : undefined;

    if (!res.ok) {
      const error: ApiError = (payload as any)?.error ? (payload as any) : { error: res.statusText || 'Request failed', code: status };
      return { error, status };
    }
    return { data: payload as T, status };
  } catch (e: any) {
    return { error: { error: e?.message || 'Network error' }, status: 0 };
  }
}

// PUBLIC_INTERFACE
export const api = {
  /** List devices (client-side search/sort will be applied in UI) */
  // PUBLIC_INTERFACE
  async listDevices(): Promise<{ data?: Device[]; error?: ApiError }> {
    const res = await request<DeviceListResponse>('/devices', { method: 'GET' });
    if (res.error) return { error: res.error };
    return { data: res.data?.devices || [] };
  },

  // PUBLIC_INTERFACE
  async createDevice(input: DeviceInput): Promise<{ data?: Device; error?: ApiError }> {
    const res = await request<Device>('/devices', { method: 'POST', body: JSON.stringify(input) });
    if (res.error) return { error: res.error };
    return { data: res.data };
  },

  // PUBLIC_INTERFACE
  async getDevice(id: string): Promise<{ data?: Device; error?: ApiError }> {
    const res = await request<Device>(`/devices/${encodeURIComponent(id)}`, { method: 'GET' });
    if (res.error) return { error: res.error };
    return { data: res.data };
  },

  // PUBLIC_INTERFACE
  async updateDevice(id: string, input: DeviceInput): Promise<{ data?: Device; error?: ApiError }> {
    const res = await request<Device>(`/devices/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(input) });
    if (res.error) return { error: res.error };
    return { data: res.data };
  },

  // PUBLIC_INTERFACE
  async deleteDevice(id: string): Promise<{ ok: boolean; error?: ApiError }> {
    const res = await request<void>(`/devices/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.error && res.status !== 204) return { ok: false, error: res.error };
    return { ok: true };
  },

  // PUBLIC_INTERFACE
  async pingDevice(id: string): Promise<{ data?: StatusResponse; error?: ApiError }> {
    const res = await request<StatusResponse>(`/devices/${encodeURIComponent(id)}/status`, { method: 'POST' });
    if (res.error) return { error: res.error };
    return { data: res.data };
  },

  // PUBLIC_INTERFACE
  async getDeviceStatus(id: string): Promise<{ data?: StatusResponse; error?: ApiError }> {
    const res = await request<StatusResponse>(`/devices/${encodeURIComponent(id)}/status`, { method: 'GET' });
    if (res.error) return { error: res.error };
    return { data: res.data };
  },
};

/**
 * PUBLIC_INTERFACE: Re-exported IPv4 validator so existing imports continue working.
 * Prefer importing from "src/validation/ip" in new code.
 */
export function isValidIPv4(ip: string): boolean {
  // Validates IPv4 addresses, disallow leading zeros in octets unless zero itself
  const octets = ip.trim().split('.');
  if (octets.length !== 4) return false;
  return octets.every((oct) => {
    if (!/^\d+$/.test(oct)) return false;
    if (oct.length > 1 && oct.startsWith('0')) return false;
    const n = Number(oct);
    return n >= 0 && n <= 255;
  });
}
