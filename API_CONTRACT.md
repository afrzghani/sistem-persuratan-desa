# Kontrak API — Sistem Persuratan Desa Gempolkurung

Dokumen ini adalah **spesifikasi kontrak API yang dibutuhkan frontend**. Mohon backend menyesuaikan (atau menambah endpoint) sesuai dokumen ini agar frontend bisa langsung disambungkan tanpa perubahan besar.

- Versi: 1.0
- Tanggal: 6 November 2026
- Frontend: React + Vite (`http://localhost:5173`)
- Backend: Express + Prisma (`http://localhost:5000`)

---

## 1. Konvensi Umum

### 1.1 Base URL
- Development: `http://localhost:5000`
- Frontend memanggil lewat prefix `/api`.
- Frontend dev memakai proxy Vite (`/api` → `http://localhost:5000`), jadi `VITE_BACKEND_URL` boleh kosong saat dev. **Untuk production, frontend akan mengisi `VITE_BACKEND_URL`.**

### 1.2 Autentikasi
- Semua endpoint yang ditandai **Protected: Ya** wajib menerima header:
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- Token didapat dari `POST /api/auth/login`.
- Jika token tidak ada / kedaluwarsa / invalid: balas **HTTP 401**.

### 1.3 Format Response (WAJIB SERAGAM)
Semua response sukses memakai envelope:

```json
{
  "success": true,
  "message": "Pesan singkat",
  "data": {}
}
```

Semua response error memakai envelope:

```json
{
  "success": false,
  "message": "Pesan error yang bisa ditampilkan ke user",
  "errors": [
    { "field": "email", "message": "Format email tidak valid" }
  ]
}
```

> Catatan: `data` boleh `null`/tidak dikirim untuk endpoint tanpa data. `errors` opsional, dipakai untuk validasi.

### 1.4 Status Code yang Dipakai
| Code | Arti |
|:--|:--|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request / validasi umum |
| 401 | Tidak terautentikasi |
| 403 | Tidak punya akses (role) |
| 404 | Data tidak ditemukan |
| 409 | Konflik (duplikat / relasi) |
| 413 | File terlalu besar |
| 422 | Validasi gagal (biasanya Zod) |
| 500 | Error server |

### 1.5 Format Tanggal
- Tanggal dari backend: **ISO 8601** (`2026-11-06T10:30:00.000Z`).
- Tanggal input dari frontend untuk `tanggalLahir`: `YYYY-MM-DD`.

### 1.6 Role & Status
- `role`: `"ADMIN"` | `"OPERATOR"`
- `status` user/admin: `"Aktif"` | `"Nonaktif"`
- `status` surat: `"Proses"` | `"Selesai"` | `"Dibatalkan"`

---

## 2. Ringkasan Endpoint

| # | Method | Endpoint | Protected | Status saat ini |
|:--|:--|:--|:--:|:--|
| 1 | POST | `/api/auth/login` | Tidak | ✅ Ada |
| 2 | POST | `/api/auth/register` | Tidak | ⚠️ Ada, perlu diubah |
| 3 | GET | `/api/auth/me` | Ya | ✅ Ada |
| 4 | POST | `/api/auth/logout` | Ya | ✅ Ada |
| 5 | POST | `/api/ocr/ktp` | Ya | ✅ Ada |
| 6 | GET | `/api/residents` | Ya | ✅ Ada |
| 7 | GET | `/api/residents/nik/:nik` | Ya | ✅ Ada |
| 8 | POST | `/api/residents` | Ya | ✅ Ada |
| 9 | PUT | `/api/residents/:nik` | Ya | ❌ **Diminta** |
| 10 | DELETE | `/api/residents/:nik` | Ya | ✅ Ada |
| 11 | GET | `/api/letters/templates` | Ya | ✅ Ada, perlu tambah `fields` |
| 12 | POST | `/api/letters/templates` | Ya | ✅ Ada (upload `.docx`) |
| 13 | PUT | `/api/letters/templates/:id` | Ya | ❌ **Diminta** |
| 14 | PATCH | `/api/letters/templates/:id/deactivate` | Ya | ❌ **Diminta** |
| 15 | POST | `/api/letters/issue` | Ya | ✅ Ada, perlu `customData` |
| 16 | GET | `/api/letters/history` | Ya | ✅ Ada, support `status` |
| 17 | PATCH | `/api/letters/:id/status` | Ya | ✅ Ada |
| 18 | GET | `/api/letters/download/:filename` | Tidak | ✅ Ada |
| 19 | GET | `/api/dashboard` | Ya | ⚠️ Ada, belum diproteksi |
| 20 | GET | `/api/admins` | Ya | ❌ **Diminta** |
| 21 | POST | `/api/admins` | Ya | ❌ **Diminta** |
| 22 | PUT | `/api/admins/:id` | Ya | ❌ **Diminta** |
| 23 | PATCH | `/api/admins/:id/deactivate` | Ya | ❌ **Diminta** |
| 24 | PATCH | `/api/admins/:id/activate` | Ya | ❌ **Diminta** (opsional) |
| 25 | GET | `/api/admin/profile` | Ya | ❌ **Diminta** |
| 26 | PUT | `/api/admin/profile` | Ya | ❌ **Diminta** |
| 27 | PUT | `/api/admin/change-password` | Ya | ❌ **Diminta** |
| 28 | GET | `/api/desa/settings` | Ya | ❌ **Diminta** |
| 29 | PUT | `/api/desa/settings` | Ya | ❌ **Diminta** |
| 30 | POST | `/api/desa/logo` | Ya | ❌ **Diminta** |
| 31 | GET | `/api/letters/draft` | Ya | ✅ Ada |
| 32 | PUT | `/api/letters/draft` | Ya | ✅ Ada |
| 33 | DELETE | `/api/letters/draft` | Ya | ✅ Ada |
| 34 | GET | `/api/letters/drafts` | Ya | ✅ Ada |
| 35 | GET | `/api/letters/templates/:id/file` | Ya | ✅ Ada (preview/unduh `.docx`) |

---

## 3. Model Data (Response)

### 3.1 User / Admin
```json
{
  "id": 1,
  "name": "Operator Pelayanan Desa",
  "email": "operator@gempolkurung.desa.id",
  "role": "OPERATOR",
  "status": "Aktif",
  "createdAt": "2026-09-28T17:29:52.000Z"
}
```

### 3.2 Resident
```json
{
  "nik": "3515081234560001",
  "nama": "Budi Santoso",
  "tempatLahir": "Gresik",
  "tanggalLahir": "1990-05-15T00:00:00.000Z",
  "jenisKelamin": "LAKI-LAKI",
  "golonganDarah": "O",
  "alamat": "Jl. Melati No. 12",
  "rt": "002",
  "rw": "001",
  "kelDesa": "Gempolkurung",
  "kecamatan": "Menganti",
  "kabupaten": "Gresik",
  "agama": "Islam",
  "statusPerkawinan": "Kawin",
  "pekerjaan": "Wiraswasta",
  "kewarganegaraan": "WNI",
  "deletedAt": null,
  "createdAt": "2026-09-28T17:29:52.000Z",
  "updatedAt": "2026-09-28T17:29:52.000Z"
}
```
`deletedAt` terisi saat warga dihapus dari daftar aktif (soft delete); data tetap tersimpan untuk kebutuhan arsip surat.

### 3.3 LetterTemplate
```json
{
  "id": 4,
  "kodeSurat": "SKBM",
  "namaSurat": "Surat Keterangan Belum Menikah",
  "templateFile": "C_SURAT KETERANGAN BELUM MENIKAH.docx",
  "deskripsi": "Surat keterangan belum pernah menikah.",
  "isActive": true,
  "fields": [
    { "key": "Keterangan", "label": "Keterangan", "type": "textarea", "required": false },
    { "key": "Keperluan", "label": "Keperluan", "type": "text", "required": true }
  ],
  "createdAt": "2026-09-28T17:29:52.000Z",
  "updatedAt": "2026-09-28T17:29:52.000Z"
}
```

> **`fields` adalah field tambahan (di luar data KTP) yang harus diisi operator.** `key` HARUS sama persis dengan nama tag di dokumen `.docx` (contoh: `No_KK`, `Nama_Anak`, `Nama_Perusahaan`). Referensi tag ada di `template_tags_summary.json`.

### 3.4 IssuedLetter
```json
{
  "id": 12,
  "nomorSurat": "470/123/2026",
  "residentNik": "3515081234560001",
  "templateId": 4,
  "operatorId": 1,
  "keperluan": "Persyaratan beasiswa",
  "status": "Selesai",
  "generatedFile": "Surat_SKBM_470_123_2026_1760000000000.docx",
  "issuedAt": "2026-11-06T10:30:00.000Z",
  "resident": { "...": "objek Resident" },
  "template": { "...": "objek LetterTemplate" },
  "operator": { "id": 1, "name": "Operator", "email": "operator@desa.id" }
}
```

### 3.5 LetterDraft
Draft proses yang belum selesai (disimpan otomatis saat operator keluar di tahap 2/3). Setelah surat diterbitkan, draft tetap disimpan dengan `step: 3` dan `issuedLetterId` terisi sampai operator menekan **Selesai**, sehingga pratinjau surat dapat dipulihkan saat halaman dibuka kembali.
```json
{
  "id": 1,
  "operatorId": 1,
  "templateId": 4,
  "step": 2,
  "formData": {
    "nik": "",
    "fullName": "",
    "nomorSurat": "",
    "purpose": ""
  },
  "issuedLetterId": null,
  "createdAt": "2026-11-06T10:00:00.000Z",
  "updatedAt": "2026-11-06T10:05:00.000Z",
  "template": { "...": "objek LetterTemplate" },
  "issuedLetter": null
}
```

### 3.5 DesaSettings
```json
{
  "id": 1,
  "namaDesa": "Gempolkurung",
  "kecamatan": "Menganti",
  "kabupaten": "Gresik",
  "alamatDesa": "Jl. Raya Gempolkurung No. 1",
  "namaKepalaDesa": "H. SUBANDI",
  "jabatanKepalaDesa": "Kepala Desa",
  "logoUrl": "/uploads/logo-desa.png",
  "updatedAt": "2026-11-06T10:30:00.000Z"
}
```

---

## 4. Detail Endpoint

### 4.1 Auth

#### `POST /api/auth/login` (Protected: Tidak)
Request:
```json
{ "email": "operator@gempolkurung.desa.id", "password": "password123" }
```
Response `200`:
```json
{
  "success": true,
  "message": "Login berhasil.",
  "data": {
    "token": "eyJhbGciOi...",
    "user": { "id": 1, "name": "Operator Pelayanan Desa", "email": "operator@gempolkurung.desa.id", "role": "OPERATOR" }
  }
}
```

#### `POST /api/auth/register` (Protected: Tidak — **PERLU DIUBAH**)
> **Perubahan yang diminta:** endpoint ini jangan terbuka untuk umum. Pindahkan ke `POST /api/admins` (protected, role ADMIN) atau minimal wajibkan token + role `ADMIN`. Saat ini siapa pun bisa membuat akun `ADMIN`.

#### `GET /api/auth/me` (Protected: Ya)
Response `200`:
```json
{ "success": true, "message": "Data pengguna berhasil diambil.", "data": { "id": 1, "email": "...", "name": "...", "role": "OPERATOR", "createdAt": "..." } }
```

#### `POST /api/auth/logout` (Protected: Ya)
Response `200`:
```json
{ "success": true, "message": "Logout berhasil." }
```

---

### 4.2 OCR

#### `POST /api/ocr/ktp` (Protected: Ya)
Request: `multipart/form-data`
| Field | Tipe | Wajib | Keterangan |
|:--|:--|:--:|:--|
| `file` | File | Ya | `.jpg`, `.jpeg`, `.png`, maks 5 MB |

Response `200`:
```json
{
  "success": true,
  "message": "Ekstraksi OCR KTP berhasil.",
  "data": {
    "extracted": {
      "nik": "3515081234560001",
      "nama": "BUDI SANTOSO",
      "tempatLahir": "GRESIK",
      "tanggalLahir": "15-05-1990",
      "jenisKelamin": "LAKI-LAKI",
      "golonganDarah": "O",
      "alamat": "JL. MELATI NO. 12",
      "rt": "002",
      "rw": "001",
      "kelDesa": "GEMPOLKURUNG",
      "kecamatan": "MENGANTI",
      "kotaKab": "GRESIK",
      "provinsi": "JAWA TIMUR",
      "agama": "ISLAM",
      "statusPerkawinan": "KAWIN",
      "pekerjaan": "WIRASWASTA",
      "kewarganegaraan": "WNI",
      "berlaku": "SEUMUR HIDUP",
      "perluReview": true
    },
    "isExistingResident": false,
    "existingProfile": null
  }
}
```
> `existingProfile` berisi objek Resident (lihat 3.2) jika NIK sudah terdaftar, selain itu `null`.

---

### 4.3 Data Warga (Resident)

#### `GET /api/residents` (Protected: Ya)
Query:
| Param | Default | Keterangan |
|:--|:--|:--|
| `search` | `""` | cari NIK / nama / alamat |
| `page` | `1` | halaman |
| `limit` | `10` | jumlah per halaman |

Response `200`:
```json
{
  "success": true,
  "message": "Daftar warga berhasil dimuat.",
  "data": {
    "residents": [ { "...": "Resident" } ],
    "pagination": { "total": 120, "page": 1, "limit": 10, "totalPages": 12 }
  }
}
```

#### `GET /api/residents/nik/:nik` (Protected: Ya)
Response `200`:
```json
{ "success": true, "message": "Data warga berhasil ditemukan.", "data": { "...": "Resident", "issuedLetters": [] } }
```
Response `404` jika tidak ditemukan.

#### `POST /api/residents` (Protected: Ya — upsert)
Request body: field yang sama dengan model Resident (lihat 3.2). Field wajib: `nik` (16 digit), `nama`, `tempatLahir`, `tanggalLahir`, `jenisKelamin`, `alamat`.

Response `200`/`201`:
```json
{ "success": true, "message": "Data kependudukan berhasil disimpan.", "data": { "...": "Resident" } }
```

#### `PUT /api/residents/:nik` (**DIMINTA** — Protected: Ya)
Request body: sama seperti `POST` tanpa `nik` (atau `nik` harus sama).
Response `200`:
```json
{ "success": true, "message": "Data warga berhasil diperbarui.", "data": { "...": "Resident" } }
```
Response `404` jika NIK tidak ada.

#### `DELETE /api/residents/:nik` (Protected: Ya)
Menghapus warga dari daftar aktif menggunakan soft delete (`deletedAt`). Relasi ke surat terbit tetap disimpan sehingga arsip surat dan nama pemohon tetap utuh. NIK yang sama bisa didaftarkan kembali, dan data lama akan diaktifkan lagi.
Response `200`:
```json
{ "success": true, "message": "Data warga berhasil dihapus dari daftar aktif. Riwayat surat tetap tersimpan.", "data": { "nik": "3515081234560001" } }
```
Response `404` jika NIK tidak ditemukan atau sudah dihapus dari daftar aktif.

---

### 4.4 Template Surat

#### `GET /api/letters/templates` (Protected: Ya)
> **Perubahan yang diminta:** tambahkan properti `fields` pada setiap template (lihat 3.3).

Response `200`:
```json
{ "success": true, "message": "Daftar template surat berhasil dimuat.", "data": [ { "...": "LetterTemplate" } ] }
```
Hanya template `isActive: true` yang dikembalikan.

#### `POST /api/letters/templates` (Protected: Ya, role ADMIN belum diterapkan)
Request: `multipart/form-data`
| Field | Tipe | Wajib | Keterangan |
|:--|:--|:--:|:--|
| `kodeSurat` | string | Ya | unik, contoh `SKBM`; otomatis di-uppercase |
| `namaSurat` | string | Ya | nama tampil di UI |
| `deskripsi` | string | Tidak | deskripsi singkat |
| `fields` | string (JSON) | Tidak | belum diimplementasikan |
| `file` | File | Ya | template `.docx`, maks 10 MB |

Response `201`:
```json
{ "success": true, "message": "Template surat berhasil ditambahkan.", "data": { "...": "LetterTemplate" } }
```
Response `409` bila `kodeSurat` sudah dipakai. File disimpan ke folder `backend/templates/` dengan nama unik.

#### `GET /api/letters/templates/:id/file` (Protected: Ya)
Mengembalikan file `.docx` mentah (`Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document`) sehingga bisa dipreview di browser (frontend memakai `docx-preview`) atau diunduh.
Query opsional `?download=1` untuk memaksa unduhan (`Content-Disposition: attachment`).
Response `404` bila template atau file tidak ditemukan.

#### `PUT /api/letters/templates/:id` (**DIMINTA** — Protected: Ya)
Request (JSON): `{ "namaSurat": "...", "deskripsi": "...", "fields": [ ... ], "isActive": true }`
Response `200`:
```json
{ "success": true, "message": "Template berhasil diperbarui.", "data": { "...": "LetterTemplate" } }
```

#### `PATCH /api/letters/templates/:id/deactivate` (**DIMINTA** — Protected: Ya)
Response `200`:
```json
{ "success": true, "message": "Template berhasil dinonaktifkan.", "data": { "...": "LetterTemplate" } }
```

---

### 4.5 Surat (Issued Letter)

#### `POST /api/letters/issue` (Protected: Ya)
> **Perubahan yang diminta:** dukung `customData` untuk template dengan field tambahan, dan ambil `kepala_desa` dari setting desa (bukan hardcode).

Request:
```json
{
  "residentNik": "3515081234560001",
  "templateId": 4,
  "nomorSurat": "470/123/2026",
  "keperluan": "Persyaratan beasiswa",
  "keterangan": "Opsional",
  "customData": {
    "No_KK": "3515081234560002",
    "Nama_Anak": "Siti Aminah",
    "Nama_Perusahaan": "CV Maju Jaya"
  }
}
```
Validasi yang diminta:
- `residentNik`: 16 digit & harus ada di DB.
- `templateId`: harus ada & `isActive`.
- `nomorSurat`: unik (jika duplikat → `409`).
- Field `fields[].required` pada template wajib ada di `customData` (jika tidak → `422`).

Response `201`:
```json
{
  "success": true,
  "message": "Surat berhasil diterbitkan.",
  "data": {
    "issuedLetter": { "...": "IssuedLetter" },
    "downloadUrl": "/api/letters/download/Surat_SKBM_470_123_2026_1760000000000.docx",
    "filePath": "C:\\...\\generated\\Surat_SKBM_470_123_2026_1760000000000.docx"
  }
}
```
Response `409` jika `nomorSurat` sudah dipakai:
```json
{ "success": false, "message": "Nomor surat sudah pernah digunakan. Silakan gunakan nomor surat lain." }
```

#### `GET /api/letters/history` (Protected: Ya)
Query yang diminta:
| Param | Default | Keterangan |
|:--|:--|:--|
| `page` | `1` | |
| `limit` | `10` | |
| `search` | `""` | cari nomor surat / nama pemohon / jenis surat |
| `status` | `""` | `Proses` / `Selesai` / `Dibatalkan` |
| `templateId` | `""` | filter jenis surat |
| `startDate` | `""` | `YYYY-MM-DD` (filter `issuedAt >=`) |
| `endDate` | `""` | `YYYY-MM-DD` (filter `issuedAt <=`) |
| `sort` | `issuedAt:desc` | opsional |

Response `200`:
```json
{
  "success": true,
  "message": "Riwayat surat berhasil dimuat.",
  "data": {
    "letters": [ { "...": "IssuedLetter" } ],
    "pagination": { "total": 120, "page": 1, "limit": 10, "totalPages": 12 }
  }
}
```

#### `PATCH /api/letters/:id/status` (Protected: Ya)
Saat status diubah menjadi `Selesai` atau `Dibatalkan`, draft yang terhubung ke surat tersebut otomatis dihapus. Request:
```json
{ "status": "Selesai" }
```
Response `200`:
```json
{ "success": true, "message": "Status surat berhasil diperbarui menjadi Selesai.", "data": { "issuedLetter": { "...": "IssuedLetter" } } }
```

#### `GET /api/letters/draft` (Protected: Ya)
Mengambil draft milik operator yang login. Response `data` = `LetterDraft` atau `null`. Jika draft sudah terhubung ke surat terbit, `issuedLetter` ikut disertakan agar frontend dapat memulihkan pratinjau.

#### `PUT /api/letters/draft` (Protected: Ya)
Membuat/memperbarui draft milik operator (satu draft per operator). Request:
```json
{ "templateId": 4, "step": 2, "formData": { "fullName": "" } }
```
Response `200`:
```json
{ "success": true, "message": "Draft surat berhasil disimpan.", "data": { "...": "LetterDraft" } }
```

#### `DELETE /api/letters/draft` (Protected: Ya)
Menghapus draft milik operator. Response `200`:
```json
{ "success": true, "message": "Draft surat berhasil dihapus.", "data": { "deleted": 1 } }
```

#### `GET /api/letters/drafts` (Protected: Ya)
Daftar draft yang belum terhubung ke surat terbit (untuk ditampilkan sebagai status `Proses` di arsip). Draft dengan `issuedLetterId` terisi tidak disertakan karena suratnya sudah tampil di riwayat. Response `data` = array `LetterDraft`.

#### `GET /api/letters/download/:filename` (Protected: Tidak)
- Response langsung file `.docx` (`Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `Content-Disposition: attachment`).
- Wajib sanitasi path traversal (`path.basename`).
- Frontend mengunduh lewat `<a href>`, jadi endpoint ini **tidak mengirim header Authorization**. Jika ingin diproteksi, sediakan opsi token di query, mis. `?token=<JWT>`.
- Nama file sebaiknya sulit ditebak / bisa diberi token agar tidak bisa diunduh orang luar.

---

### 4.6 Dashboard

#### `GET /api/dashboard?year=2026` (Protected: **Ya — perlu ditambahkan**)
Response `200`:
```json
{
  "success": true,
  "message": "Data dashboard berhasil dimuat",
  "data": {
    "totalSurat": 120,
    "suratDiproses": 5,
    "suratSelesai": 115,
    "suratDibatalkan": 0,
    "totalWarga": 350,
    "tahunTersedia": ["2024", "2025", "2026"],
    "suratTerbaru": [
      {
        "id": 12,
        "nomorSurat": "470/123/2026",
        "jenisSurat": "Surat Keterangan Belum Menikah",
        "pemohon": "Budi Santoso",
        "status": "Selesai"
      }
    ],
    "suratSelesaiBulanan": [
      { "bulan": "Jan", "jumlah": 8 },
      { "bulan": "Feb", "jumlah": 12 }
    ]
  }
}
```
> `suratDiproses` dan `status` **jangan hardcode**; hitung dari field `status` surat.

---

### 4.7 Kelola Admin (**SEMUA DIMINTA** — Protected: Ya, role ADMIN)

#### `GET /api/admins`
Response `200`:
```json
{ "success": true, "message": "Daftar admin berhasil dimuat.", "data": [ { "...": "User/Admin" } ] }
```

#### `POST /api/admins`
Request:
```json
{ "name": "Andi Saputra", "email": "andi@desa.id", "password": "rahasia123", "role": "ADMIN" }
```
Response `201`:
```json
{ "success": true, "message": "Akun admin berhasil ditambahkan.", "data": { "...": "User/Admin" } }
```
Error `409` jika email sudah terdaftar.

#### `PUT /api/admins/:id`
Request:
```json
{ "name": "Andi Saputra", "email": "andi@desa.id", "role": "ADMIN" }
```
Response `200`:
```json
{ "success": true, "message": "Data admin berhasil diperbarui.", "data": { "...": "User/Admin" } }
```

#### `PATCH /api/admins/:id/deactivate`
Response `200`:
```json
{ "success": true, "message": "Admin berhasil dinonaktifkan.", "data": { ... } }
```
> Admin yang dinonaktifkan tidak boleh bisa login.

#### `PATCH /api/admins/:id/activate` (opsional)
Response `200`:
```json
{ "success": true, "message": "Admin berhasil diaktifkan kembali.", "data": { ... } }
```

---

### 4.8 Profil Admin (**SEMUA DIMINTA** — Protected: Ya)

#### `GET /api/admin/profile`
Response `200`:
```json
{ "success": true, "message": "Profil berhasil dimuat.", "data": { "id": 1, "name": "...", "email": "...", "role": "OPERATOR", "createdAt": "..." } }
```

#### `PUT /api/admin/profile`
Request:
```json
{ "name": "Nama Baru", "email": "email.baru@desa.id" }
```
Response `200`:
```json
{ "success": true, "message": "Profil berhasil diperbarui.", "data": { "...": "User" } }
```
Error `409` jika email dipakai akun lain.

#### `PUT /api/admin/change-password`
Request:
```json
{ "currentPassword": "passwordlama", "newPassword": "passwordbaru123" }
```
Response `200`:
```json
{ "success": true, "message": "Password berhasil diubah." }
```
Error `400`/`401` jika password saat ini salah.

---

### 4.9 Pengaturan Desa (**SEMUA DIMINTA** — Protected: Ya)

#### `GET /api/desa/settings`
Response `200`:
```json
{ "success": true, "message": "Pengaturan desa berhasil dimuat.", "data": { "...": "DesaSettings" } }
```

#### `PUT /api/desa/settings`
Request:
```json
{
  "namaDesa": "Gempolkurung",
  "kecamatan": "Menganti",
  "kabupaten": "Gresik",
  "alamatDesa": "Jl. Raya Gempolkurung No. 1",
  "namaKepalaDesa": "H. SUBANDI",
  "jabatanKepalaDesa": "Kepala Desa"
}
```
Response `200`:
```json
{ "success": true, "message": "Pengaturan desa berhasil disimpan.", "data": { "...": "DesaSettings" } }
```

#### `POST /api/desa/logo`
Request: `multipart/form-data`
| Field | Tipe | Wajib | Keterangan |
|:--|:--|:--:|:--|
| `logo` | File | Ya | `.png`, `.jpg`, `.jpeg`, maks 5 MB |

Response `200`:
```json
{ "success": true, "message": "Logo desa berhasil diunggah.", "data": { "logoUrl": "/uploads/logo-desa.png" } }
```

---

## 5. Perubahan Wajib di Backend (di luar endpoint baru)

1. ✅ **`IssuedLetter.status`**: sudah ditambahkan (`default "Proses"`) + migration, plus model `LetterDraft` untuk draft proses.
2. ✅ **Dashboard**: `totalSurat` = jumlah template aktif; `suratDiproses` = surat `Proses` + draft; `suratSelesai` = surat `Selesai`.
3. **Data desa & kepala desa**: tambah model `DesaSettings` + migration.
4. **Status user**: tambah kolom `status` (`"Aktif"`/`"Nonaktif"`) di tabel `users`.
5. **Seed template**:
   - ✅ File seed utama sudah diperbaiki: `SKTM` → `JA_SURAT KETERANGAN MISKIN KIS.docx`, `SKU` → `NA_SURAT KETERANGAN USAHA.docx`, `SKD` → `DA_SURAT KETERANGAN DOMISILI WARGA.docx`, `SKBM` tetap valid.
   - Sisa: daftarkan seluruh template valid di folder `templates/` beserta `fields` masing-masing sesuai `template_tags_summary.json`.
6. **Generator surat**:
   - Ambil `Kepala_Desa` / `kepala_desa` dari `DesaSettings`, jangan hardcode `"H. SUBANDI"`.
   - Hapus default `keterangan` khusus "belum menikah" untuk semua template; jadikan per-template atau kosong.
   - Mapping `customData` harus masuk ke variabel docxtemplater dengan nama tag yang sama.
7. **Keamanan**:
   - Proteksi `GET /api/dashboard` dengan `authenticate`.
   - Amankan/ubah `POST /api/auth/register` (lihat 4.1).
   - Tambah middleware `authorizeRole('ADMIN')` untuk endpoint kelola admin, template, dan pengaturan desa.
   - Perbaiki CORS agar benar-benar memakai `CORS_ORIGIN` (saat ini selalu mengizinkan semua origin).
8. **File `.env`**: sediakan `.env` aktual dari `.env.example` agar backend bisa dijalankan.
9. **OCR Service**: pastikan service Python FastAPI tersedia/dijalankan, atau sediakan fallback/mock saat OCR mati.

---

## 6. Contoh Alur Kerja (Happy Path)

1. `POST /api/auth/login` → simpan `token`.
2. `GET /api/letters/templates` → tampilkan pilihan + `fields`.
3. `POST /api/ocr/ktp` (upload KTP) → isi form otomatis.
4. `POST /api/residents` → simpan/perbarui data warga.
5. `POST /api/letters/issue` (+`customData` sesuai `fields`) → dapat `downloadUrl`.
6. `GET /api/letters/download/:filename` → unduh `.docx`.
7. `GET /api/letters/history` → tampilkan arsip (dengan filter & pagination).
8. `GET /api/dashboard?year=2026` → tampilkan statistik dari `status` sebenarnya.

---

## 7. Catatan untuk Frontend Setelah Backend Selesai

- Ganti `adminService.js`, `desaService.js`, `profileService.js` agar memakai helper `request()` (mengirim JWT & otomatis membuka envelope `data`).
- Isi `VITE_BACKEND_URL` untuk build production.
- Render form dinamis berdasarkan `template.fields` dan kirim sebagai `customData`.
- Aktifkan `PaginationSurat` / filter server-side di Riwayat dan Data Warga.
- Sambungkan komponen `AdminTable`, `ProfilAdmin`, `InformasiDesa`, `DataKepalaDesa`, `LogoDesa` yang saat ini belum dipakai.
- ✅ `FormTemplateSurat` sudah tersambung ke `POST /api/letters/templates`; preview `.docx` memakai `docx-preview` + `GET /api/letters/templates/:id/file`.
