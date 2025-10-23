export type DeviceStatus = 'online' | 'offline' | 'unknown';

export interface Device {
  id: string;
  name: string;
  ip_address: string;
  device_type: string;
  location: string;
  status: DeviceStatus;
}

export interface DeviceInput {
  name: string;
  ip_address: string;
  device_type: string;
  location: string;
}

export interface DeviceListResponse {
  devices: Device[];
}

export interface StatusResponse {
  status: DeviceStatus;
  last_checked: string; // ISO date-time
}

export interface ApiError {
  error: string;
  code?: number;
}
