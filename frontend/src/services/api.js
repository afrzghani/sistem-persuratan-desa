const BASE_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");

const TOKEN_KEY = "sapaDesaToken";
const USER_KEY = "sapaDesaUser";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getApiUrl(path) {
  return `${BASE_URL}${path}`;
}

export async function request(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    auth = true,
  } = options;

  const requestHeaders = { ...headers };
  const token = getToken();

  if (auth && token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  let requestBody = body;

  if (body && !(body instanceof FormData)) {
    requestHeaders["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: requestBody,
  });

  if (response.status === 204) {
    return null;
  }

  let payload;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    if (response.status === 401 && auth) {
      clearSession();

      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    }

    throw new Error(payload?.message || "Terjadi kesalahan pada server.");
  }

  return payload?.data ?? payload;
}
