import { request } from "./api";

export function getAdmins() {
  return request("/api/admins");
}

export function createAdmin({ name, email, password }) {
  return request("/api/admins", {
    method: "POST",
    body: { name, email, password },
  });
}

export function updateAdmin(id, { name, email }) {
  return request(`/api/admins/${id}`, {
    method: "PUT",
    body: { name, email },
  });
}

export function deactivateAdmin(id) {
  return request(`/api/admins/${id}/deactivate`, {
    method: "PATCH",
  });
}

export function activateAdmin(id) {
  return request(`/api/admins/${id}/activate`, {
    method: "PATCH",
  });
}
