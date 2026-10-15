
const API_URL = import.meta.env.VITE_BACKEND_URL;

// Ambil daftar template dari backend
export async function getTemplates() {
  const response = await fetch(`${API_URL}/api/templates`);

  if (!response.ok) {
    throw new Error("Gagal mengambil data template dari server.");
  }

  const result = await response.json();

  // Sesuaikan jika backend mengembalikan { data: [...] }
  return Array.isArray(result) ? result : result.data;
}

// Upload template ke backend dengan progress
export function addTemplate(
  namaTemplate,
  fileTemplate,
  onProgress = () => {},
) {
  const formData = new FormData();
  formData.append("namaTemplate", namaTemplate.trim());
  formData.append("file", fileTemplate);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${API_URL}/api/templates`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error("Respons server tidak valid."));
        }
      } else {
        reject(new Error("Gagal mengunggah template ke server."));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Tidak dapat terhubung ke server."));
    };

    xhr.send(formData);
  });
}

// Hapus template melalui backend
export async function deleteTemplate(id) {
  const response = await fetch(`${API_URL}/api/templates/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Gagal menghapus template dari server.");
  }

  return true;
}


/* ================================
   RIWAYAT SURAT
================================ */

// Ambil daftar riwayat surat dari backend
export async function getRiwayatSurat() {
  const response = await fetch(`${API_URL}/api/riwayat-surat`);

  if (!response.ok) {
    throw new Error("Gagal mengambil data riwayat surat dari server.");
  }

  const result = await response.json();

  return Array.isArray(result) ? result : result.data;
}
