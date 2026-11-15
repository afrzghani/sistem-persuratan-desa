import { clearSession, getApiUrl, getToken, request } from "./api";

export function getTemplates() {
  return request("/api/letters/templates");
}

export function createTemplate(
  { namaSurat, kodeSurat, deskripsi, file },
  onProgress,
) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("namaSurat", namaSurat);
    formData.append("kodeSurat", kodeSurat);

    if (deskripsi) {
      formData.append("deskripsi", deskripsi);
    }

    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", getApiUrl("/api/letters/templates"));

    const token = getToken();

    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === "function") {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      let payload;

      try {
        payload = JSON.parse(xhr.responseText);
      } catch {
        payload = null;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(payload?.data ?? payload);
        return;
      }

      if (xhr.status === 401) {
        clearSession();

        if (!window.location.pathname.startsWith("/login")) {
          window.location.assign("/login");
        }
      }

      reject(new Error(payload?.message || "Gagal mengunggah template."));
    };

    xhr.onerror = () => {
      reject(new Error("Tidak dapat terhubung ke server."));
    };

    xhr.send(formData);
  });
}

export async function getTemplateFile(id) {
  const token = getToken();
  const response = await fetch(
    getApiUrl(`/api/letters/templates/${id}/file`),
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );

  if (!response.ok) {
    let payload;

    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (response.status === 401) {
      clearSession();

      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    }

    throw new Error(payload?.message || "Gagal memuat file template.");
  }

  return response.blob();
}
