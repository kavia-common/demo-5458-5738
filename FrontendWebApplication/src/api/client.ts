import { Device, DeviceInput, DeviceListResponse, StatusResponse, ApiError } from '../types';

/**
 * API client
 * - Base URL resolution order:
 *    1) REACT_APP_API_BASE (used as-is)
 *    2) REACT_APP_BACKEND_URL + '/api'
 *    3) '/api' (same-origin default)
 * - All requests send and expect JSON.
 */
const API_BASE = (() => {
  const base = process.env.REACT_APP_API_BASE;
  if (base && base.trim().length > 0) {
    return base.trim().replace(/\/+$/, '') + '/api';
  }
  const backend = process.env.REACT_APP_BACKEND_URL;
  if (backend && backend.trim().length > 0) {
    return backend.trim().replace(/\/+$/, '') + '/api';
  }
  return '/api';
})();

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

  /**
   * PUBLIC_INTERFACE
   * Fetch devices with optional query params to support backend-side search/sort if available.
   * Consumers can re-invoke this to refresh devices while preserving current params.
   */
  // PUBLIC_INTERFACE
  async fetchDevices(params?: { search?: string; sort?: string }): Promise<{ data?: Device[]; error?: ApiError }> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.sort) query.set('sort', params.sort);
    const path = `/devices${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await request<DeviceListResponse>(path, { method: 'GET' });
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
