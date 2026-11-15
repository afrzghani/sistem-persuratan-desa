import { request } from "./api";

export function getAdminProfile() {
  return request("/api/admin/profile");
}

export function updateAdminProfile({ name, email }) {
  return request("/api/admin/profile", {
    method: "PUT",
    body: { name, email },
  });
}

export function changePassword({ currentPassword, newPassword }) {
  return request("/api/admin/change-password", {
    method: "PUT",
    body: { currentPassword, newPassword },
  });
}
