import type { Crater } from '../types/crater';

const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error ${res.status}`);
  }
  return res.json();
}

// --- Potholes ---

export async function fetchPotholes(): Promise<Crater[]> {
  const data = await request<{ potholes: Crater[] }>('/potholes');
  return data.potholes;
}

export async function fetchPothole(id: number): Promise<Crater> {
  return request<Crater>(`/potholes/${id}`);
}

export async function createPothole(data: {
  latitude: number;
  longitude: number;
  size_category: string;
  description?: string | null;
}): Promise<Crater> {
  return request<Crater>('/potholes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function confirmPothole(id: number): Promise<{ confirmed: boolean }> {
  return request<{ confirmed: boolean }>(`/potholes/${id}/confirm`, {
    method: 'POST',
  });
}

export async function updatePothole(
  id: number,
  data: { verified?: boolean; fixed?: boolean },
): Promise<Crater> {
  return request<Crater>(`/potholes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// --- Auth ---

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}): Promise<{ user_id: number; token: string }> {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<{ user_id: number; token: string }> {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
