import { request } from "./api";

export function getDesaSettings() {
  return request("/api/desa/settings");
}

export function updateDesaSettings(data) {
  return request("/api/desa/settings", {
    method: "PUT",
    body: data,
  });
}

export function uploadLogoDesa(file) {
  const formData = new FormData();
  formData.append("logo", file);

  return request("/api/desa/logo", {
    method: "POST",
    body: formData,
  });
}
