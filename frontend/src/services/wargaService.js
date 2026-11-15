import { request } from "./api";

function toResidentPayload(dataWarga) {
  return {
    nik: String(dataWarga.nik ?? "").trim(),
    nama: String(dataWarga.nama ?? "").trim(),
    tempatLahir: String(dataWarga.tempatLahir ?? "").trim(),
    tanggalLahir: dataWarga.tanggalLahir,
    jenisKelamin: dataWarga.jenisKelamin,
    golonganDarah: dataWarga.golonganDarah || undefined,
    alamat: String(dataWarga.alamat ?? "").trim(),
    rt: dataWarga.rt || undefined,
    rw: dataWarga.rw || undefined,
    kelDesa: dataWarga.kelDesa || "Gempolkurung",
    kecamatan: dataWarga.kecamatan || "Menganti",
    kabupaten: dataWarga.kabupaten || "Gresik",
    agama: dataWarga.agama || undefined,
    statusPerkawinan: dataWarga.statusPerkawinan || undefined,
    pekerjaan: dataWarga.pekerjaan || undefined,
    kewarganegaraan: dataWarga.kewarganegaraan || "WNI",
  };
}

export function getWarga({ search = "", page = 1, limit = 1000 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search.trim()) {
    params.set("search", search.trim());
  }

  return request(`/api/residents?${params.toString()}`);
}

export function tambahWarga(dataWarga) {
  return request("/api/residents", {
    method: "POST",
    body: toResidentPayload(dataWarga),
  });
}

export function updateWarga(_nik, dataWarga) {
  return tambahWarga(dataWarga);
}

export function hapusWarga(nik) {
  return request(`/api/residents/${encodeURIComponent(nik)}`, {
    method: "DELETE",
  });
}
