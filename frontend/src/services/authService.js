import { request } from "./api";

export function login(email, password) {
  return request("/api/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}

export function getMe() {
  return request("/api/auth/me");
}

export function logout() {
  return request("/api/auth/logout", { method: "POST" }).catch(() => null);
}
