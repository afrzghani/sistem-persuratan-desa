
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Mengambil semua data warga.
export async function getWarga() {
  const response = await fetch(`${BASE_URL}/api/warga`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || "Gagal mengambil data warga",
    );
  }

  return response.json();
}

// Menambahkan data warga baru.
export async function tambahWarga(dataWarga) {
  const response = await fetch(`${BASE_URL}/api/warga`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataWarga),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || "Gagal menambahkan data warga",
    );
  }

  return response.json();
}

// Memperbarui data warga berdasarkan NIK lama.
export async function updateWarga(nik, dataWarga) {
  const response = await fetch(
    `${BASE_URL}/api/warga/${encodeURIComponent(nik)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataWarga),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || "Gagal mengubah data warga",
    );
  }

  return response.json();
}

// Menghapus data warga berdasarkan NIK.
export async function hapusWarga(nik) {
  const response = await fetch(
    `${BASE_URL}/api/warga/${encodeURIComponent(nik)}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || "Gagal menghapus data warga",
    );
  }

  // Mendukung respons backend tanpa isi (204 No Content).
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Kompatibilitas untuk komponen lama yang masih memakai simpanWarga.
export async function simpanWarga(dataWarga) {
  return tambahWarga(dataWarga);
}