import { getApiUrl, request } from "./api";

export function getRiwayatSurat({ page = 1, limit = 100 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return request(`/api/letters/history?${params.toString()}`);
}

export function issueLetter(payload) {
  return request("/api/letters/issue", {
    method: "POST",
    body: payload,
  });
}

export function updateLetterStatus(id, status) {
  return request(`/api/letters/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function getDraftSurat() {
  return request("/api/letters/draft");
}

export function simpanDraftSurat(payload) {
  return request("/api/letters/draft", {
    method: "PUT",
    body: payload,
  });
}

export function hapusDraftSurat() {
  return request("/api/letters/draft", {
    method: "DELETE",
  });
}

export function getDaftarDraftSurat() {
  return request("/api/letters/drafts");
}

export function getDownloadUrl(filename) {
  return getApiUrl(`/api/letters/download/${encodeURIComponent(filename)}`);
}
