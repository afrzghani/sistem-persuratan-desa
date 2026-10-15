
const STORAGE_KEY = "sapaDesaSurat";

export function getSurat() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Gagal membaca data surat:", error);
    return [];
  }
}

export function simpanSurat(suratBaru) {
  const suratTersimpan = getSurat();

  const dataBaru = [...suratTersimpan, suratBaru];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataBaru));

  return dataBaru;
}

export function cariSurat(id) {
  return getSurat().find((surat) => surat.id === id) ?? null;
}
