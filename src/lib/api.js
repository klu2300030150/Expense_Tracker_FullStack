const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export function getToken() {
  return localStorage.getItem('auth_token') || null;
}

export function setToken(token) {
  if (token) localStorage.setItem('auth_token', token);
}

export function clearToken() {
  localStorage.removeItem('auth_token');
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export async function loginRequest(email, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerRequest(email, name, password) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, name, password }),
  });
}

export async function getMe() {
  return apiFetch('/auth/me');
}
