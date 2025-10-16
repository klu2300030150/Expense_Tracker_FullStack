const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

// Check if backend is available
let backendAvailable = null;

async function checkBackend() {
  if (backendAvailable !== null) return backendAvailable;
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
    backendAvailable = res.ok;
  } catch {
    backendAvailable = false;
  }
  return backendAvailable;
}

// Local storage keys for fallback mode
const USERS_KEY = 'xp-local-users';
const AUTH_TOKEN_KEY = 'auth_token';

function getLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLocalUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || null;
}

export function setToken(token) {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
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
  const hasBackend = await checkBackend();
  
  if (hasBackend) {
    // Use real backend API
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }
  
  // Fallback: Local authentication
  const users = getLocalUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw new Error('User not exists');
  }
  
  if (user.password !== password) {
    throw new Error('Invalid credentials');
  }
  
  // Create fake JWT token
  const token = btoa(JSON.stringify({ email: user.email, name: user.name }));
  
  return {
    token,
    user: { name: user.name, email: user.email }
  };
}

export async function registerRequest(email, name, password) {
  const hasBackend = await checkBackend();
  
  if (hasBackend) {
    // Use real backend API
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, name, password }),
    });
  }
  
  // Fallback: Local registration
  const users = getLocalUsers();
  
  if (users.find(u => u.email === email)) {
    throw new Error('Email already in use');
  }
  
  const newUser = { email, name, password };
  users.push(newUser);
  saveLocalUsers(users);
  
  return { id: users.length, email, name };
}

export async function getMe() {
  const hasBackend = await checkBackend();
  
  if (hasBackend) {
    return apiFetch('/auth/me');
  }
  
  // Fallback: Decode local token
  const token = getToken();
  if (!token) throw new Error('No token');
  
  try {
    const user = JSON.parse(atob(token));
    return { user };
  } catch {
    throw new Error('Invalid token');
  }
}
