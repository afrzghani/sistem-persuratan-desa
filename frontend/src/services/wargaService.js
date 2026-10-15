
const STORAGE_KEY = "sapaDesaWarga";

// Mengambil semua data warga.
export function getWarga() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Gagal membaca data warga:", error);
    return [];
  }
}

// Menambahkan warga baru atau memperbarui warga berdasarkan NIK.
export function simpanWarga(wargaBaru) {
  const wargaTersimpan = getWarga();

  const index = wargaTersimpan.findIndex(
    (warga) => warga.nik === wargaBaru.nik
  );

  let dataBaru;

  if (index !== -1) {
    dataBaru = [...wargaTersimpan];
    dataBaru[index] = {
      ...dataBaru[index],
      ...wargaBaru,
    };
  } else {
    dataBaru = [...wargaTersimpan, wargaBaru];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataBaru));
  return dataBaru;
}

// Menghapus warga berdasarkan NIK.
export function hapusWarga(nik) {
  const dataBaru = getWarga().filter((warga) => warga.nik !== nik);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataBaru));
  return dataBaru;
}
