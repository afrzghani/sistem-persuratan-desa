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
