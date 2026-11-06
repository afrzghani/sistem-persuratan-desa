# Roadmap & Task List — Sistem Persuratan Desa Gempolkurung

Dokumen ini berisi daftar pekerjaan yang tersisa, dibagi per **Frontend (FE)**, **Backend (BE)**, dan **Shared/Integrasi**. Referensi kontrak API ada di [`API_CONTRACT.md`](./API_CONTRACT.md).

Legenda prioritas:
- **P0** = blocker / harus segera
- **P1** = penting, sprint berikutnya
- **P2** = nice to have / polish
- Ukuran: **S** (kecil, <½ hari), **M** (sedang, 1–2 hari), **L** (besar, >2 hari)

---

## 0. Status Saat Ini

Sudah jalan end-to-end:
- Login + JWT, dashboard read, data warga (list/tambah/edit), buat surat (pilih template → OCR/manual → terbit → unduh), riwayat surat.
- Status surat (`Proses`/`Selesai`) + draft proses tersimpan di backend, tampil di arsip.
- Dashboard: Total Surat = jumlah template aktif; Surat Diproses menghitung surat `Proses` + draft.
- Template Surat: tambah template `.docx` sendiri, preview dokumen di modal, dan unduh file.

Sudah dibersihkan:
- File mati dihapus (`UploadKTP.jsx`, `suratService.js`, `App.css`, aset default, `icons.svg`), title & `lang` dirapikan.

Belum tersambung:
- Kelola Admin (list/edit/nonaktif), Pengaturan (profil/password/desa/logo), pagination/filter server-side.

---

## 1. Backend (BE)

### B1 — Perbaikan urgent (P0)
- [x] **B1.1** Perbaiki `prisma/seed.ts`: file `SKTM`/`SKU`/`SKD` sudah diarahkan ke file nyata di `templates/`. — **S**
- [ ] **B1.2** Seed ulang seluruh template valid (26 `.docx`) + set `fields` tiap template sesuai `template_tags_summary.json`. — **M**
- [ ] **B1.3** Amankan `POST /api/auth/register` (jangan publik; pindah ke `POST /api/admins` atau wajib role ADMIN). — **S**
- [ ] **B1.4** Proteksi `GET /api/dashboard` dengan `authenticate`. — **S**
- [ ] **B1.5** Perbaiki CORS agar benar-benar membaca `CORS_ORIGIN` (sekarang selalu allow semua). — **S**
- [ ] **B1.6** Sediakan `backend/.env` dari `.env.example` + dokumentasikan. — **S**

### B2 — Perubahan schema Prisma (P0/P1)
- [x] **B2.1** Tambah `IssuedLetter.status` (`Proses`/`Selesai`/`Dibatalkan`, default `Proses`) + migration. — **M**
- [ ] **B2.2** Tambah `User.status` (`Aktif`/`Nonaktif`) + migration; blokir login user nonaktif. — **M**
- [ ] **B2.3** Buat model `DesaSettings` (namaDesa, kecamatan, kabupaten, alamatDesa, namaKepalaDesa, jabatanKepalaDesa, logoUrl) + migration + seed. — **M**
- [ ] **B2.4** (Opsional) Model field template (`TemplateField`) bila tidak mau simpan `fields` sebagai JSON. — **M**

### B3 — Endpoint baru (P1)
- [ ] **B3.1** Admin: `GET/POST /api/admins`, `PUT /api/admins/:id`, `PATCH /api/admins/:id/deactivate` + `activate`. — **M**
- [ ] **B3.2** Profil: `GET/PUT /api/admin/profile`, `PUT /api/admin/change-password`. — **M**
- [ ] **B3.3** Desa: `GET/PUT /api/desa/settings`, `POST /api/desa/logo`. — **M**
- [ ] **B3.4** Resident: `DELETE /api/residents/:nik` ✅ (soft delete, arsip surat tetap utuh), `PUT /api/residents/:nik` ❌. — **S**
- [x] **B3.5** Surat: `PATCH /api/letters/:id/status`. — **S**
- [x] **B3.9** Draft proses: model `LetterDraft` + `GET/PUT/DELETE /api/letters/draft` + `GET /api/letters/drafts`. — **M**
- [x] **B3.10** Simpan draft terhubung ke surat terbit (`issuedLetterId`) agar pratinjau bertahan sampai status `Selesai`. — **S**
- [ ] **B3.6** Template: `POST /api/letters/templates` ✅ (upload `.docx` + `GET /:id/file`), `PUT /:id` ❌, `PATCH /:id/deactivate` ❌. — **M**
- [ ] **B3.7** Riwayat: filter `search`, `status`, `templateId`, `startDate`, `endDate` di server. — **M**
- [ ] **B3.8** Middleware `authorizeRole('ADMIN')` untuk endpoint admin/template/pengaturan. — **S**

### B4 — Mesin dokumen (P0/P1)
- [ ] **B4.1** Dukung `customData` penuh + validasi field wajib per template (422 bila kurang). — **M**
- [ ] **B4.2** Ambil `Kepala_Desa` dari `DesaSettings`, hapus hardcode `H. SUBANDI`. — **S**
- [ ] **B4.3** Hapus default `keterangan` khusus "belum menikah"; jadikan per-template atau kosong. — **S**
- [ ] **B4.4** Validasi `nomorSurat` duplikat → 409 dengan pesan jelas. — **S**
- [ ] **B4.5** (Opsional) Konversi PDF via LibreOffice headless. — **L**

### B5 — Operasional & kualitas (P1/P2)
- [ ] **B5.1** Health check OCR service + fallback/mock saat OCR mati (agar UI tidak error total). — **M**
- [ ] **B5.2** Bersihkan folder `generated/` berkala (cron/manual). — **S**
- [ ] **B5.3** Rate limiting + request logging. — **M**
- [ ] **B5.4** Test backend (Vitest/Jest + Supertest) minimal untuk auth, resident, issue letter. — **L**
- [ ] **B5.5** Dokumentasi API (Swagger/OpenAPI) atau Postman collection. — **M**

### B6 — Deployment (P2)
- [ ] **B6.1** Docker Compose (MySQL + backend + OCR) untuk memudahkan setup. — **L**
- [ ] **B6.2** Set `NODE_ENV=production`, `JWT_SECRET` kuat, CORS domain produksi. — **S**

---

## 2. Frontend (FE)

### F1 — Quick wins / cleanup (P0)
- [x] **F1.1** Hapus file mati (`UploadKTP.jsx`, `suratService.js`, `App.css`, aset default, `icons.svg`). — **S**
- [x] **F1.2** Rapikan `index.html` (`lang`, title). — **S**
- [x] **F1.3** Refactor duplikasi loader data di `DataWarga.jsx`, `Riwayat.jsx`, `LetterTypeSelector.jsx` (pakai satu fungsi loader). — **S**
- [x] **F1.4** Ganti copy hardcoded "belum menikah" di `LetterDetailsForm.jsx` jadi generik per template. — **S**
- [x] **F1.5** Konsistenkan semua service memakai helper `request()` di `api.js` (hilangkan `fetch` mentah). — **S**
- [ ] **F1.6** Isi `VITE_BACKEND_URL` untuk production (diisi saat deploy; `.env.example` sudah ada). — **S**

### F2 — Fondasi integrasi (P1)
- [x] **F2.1** Tambah `frontend/.env.example` (`VITE_BACKEND_URL`). — **S**
- [ ] **F2.2** Role-based UI: sembunyikan menu Kelola Admin / Pengaturan untuk role `OPERATOR`. — **S**
- [ ] **F2.3** Central error/loading state + error boundary. — **M**
- [ ] **F2.4** Tambah halaman 404 / redirect route tak dikenal. — **S**

### F3 — Fitur surat (P1)
- [ ] **F3.1** Form dinamis berdasarkan `template.fields`; kirim sebagai `customData` ke `POST /api/letters/issue`. — **L**
- [ ] **F3.2** Tampilkan field khusus per template (No_KK, Nama_Anak, Perusahaan, dll). — **M**
- [x] **F3.3** Tampilkan `status` surat & tombol Selesai mengubah status dari `Proses` → `Selesai`. — **M**
- [x] **F3.6** Simpan/restore draft otomatis saat keluar di tahap 2/3, dan hapus draft setelah terbit. — **M**
- [ ] **F3.4** Tangani error duplikat nomor surat dari backend (409) dengan pesan yang jelas. — **S**
- [ ] **F3.5** Preview surat menyesuaikan template (sekarang masih layout SKBM). — **M**

### F4 — Riwayat & Data Warga (P1)
- [ ] **F4.1** Pagination server-side di `Riwayat` (aktifkan `PaginationSurat`). — **M**
- [ ] **F4.2** Filter server-side (search/status/jenis/tanggal) di `Riwayat` (aktifkan `FilterSurat`). — **M**
- [ ] **F4.3** Pagination server-side di `DataWarga` (sekarang ambil `limit=1000`). — **M**
- [x] **F4.4** Hapus warga (pakai `DELETE /api/residents/:nik` + konfirmasi). — **S**
- [ ] **F4.5** Edit warga pakai `PUT /api/residents/:nik` (bukan POST upsert). — **S**
- [ ] **F4.6** Lengkapi field form warga: kewarganegaraan, kelurahan/kecamatan/kabupaten. — **S**
- [x] **F4.7** Tampilkan draft `Proses` di arsip + tambah opsi filter `Proses`. — **M**
- [x] **F4.8** Tambahkan field golongan darah di form Data Warga, form pemohon surat, detail warga, dan pratinjau surat. — **S**
- [x] **F4.9** Pertahankan pratinjau surat sampai Selesai + tombol "Tandai Selesai" di detail arsip. — **S**

### F5 — Kelola Admin & Pengaturan (P1/P2)
- [ ] **F5.1** Sambungkan `AdminTable`/`AdminTableRow`/`AdminStats` ke `GET /api/admins`. — **M**
- [ ] **F5.2** Edit admin (`PUT`) & nonaktifkan/aktifkan (`PATCH`). — **M**
- [ ] **F5.3** Sambungkan `ProfilAdmin` (ubah nama/email + ganti password). — **M**
- [ ] **F5.4** Sambungkan `InformasiDesa` + `DataKepalaDesa` ke `GET/PUT /api/desa/settings`. — **M**
- [ ] **F5.5** Sambungkan `LogoDesa` ke `POST /api/desa/logo`. — **S**
- [x] **F5.6** Sambungkan `FormTemplateSurat` ke `POST /api/letters/templates` (tombol Tambah Template + progress upload). — **M**
- [x] **F5.7** Preview `.docx` di modal Template Surat (`docx-preview`) + tombol unduh. — **M**

### F6 — Kualitas (P2)
- [ ] **F6.1** Code splitting route (bundle >500 kB). — **M**
- [ ] **F6.2** Responsif sidebar (sekarang fixed `w-64`, tidak ada mobile menu). — **M**
- [ ] **F6.3** Aksesibilitas: label, fokus, aria pada modal. — **S**
- [ ] **F6.4** Test frontend (Vitest + Testing Library) untuk alur utama. — **L**

---

## 3. Shared / Integrasi (dikerjakan bareng)

- [ ] **S1** Finalisasi envelope response: semua endpoint baru pakai `{ success, message, data }`; FE unwrap lewat `request()`. — **S**
- [ ] **S2** Buat Postman/Bruno collection dari `API_CONTRACT.md` untuk uji kontrak. — **M**
- [ ] **S3** Buat data seed contoh yang lengkap (beberapa warga + beberapa surat lintas status) untuk demo. — **S**
- [ ] **S4** Samakan enum status surat & role FE↔BE. — **S**
- [ ] **S5** Smoke test end-to-end setiap endpoint baru sebelum FE menyambungkan. — **S**

---

## 4. Urutan Pengerjaan yang Disarankan

### Sprint 1 — Fondasi (fokus BE, FE ikut bantu)
1. B1.1, B1.2 (seed template) — **P0**
2. B2.1, B2.2, B2.3 (schema status + DesaSettings)
3. B1.3, B1.4, B1.5 (keamanan dasar)
4. FE: F1.3, F1.4, F1.5, F1.6 (bersih-bersih + konsistensi)

### Sprint 2 — Endpoint inti + FE menyambung
1. B3.4, B3.5, B3.7 (resident PUT/DELETE, status surat, filter riwayat)
2. B4.1, B4.2, B4.3 (customData + kepala desa)
3. FE: F3.1, F3.3, F4.1, F4.2, F4.4, F4.5

### Sprint 3 — Admin & Pengaturan
1. B3.1, B3.2, B3.3, B3.6, B3.8
2. FE: F5.1–F5.6

### Sprint 4 — Kualitas & deploy
1. B5.*, B6.*
2. FE: F6.*, F2.*

---

## 5. Cara Frontend Bisa Bantu Backend

- Ikut menulis **seed data** template & contoh warga/surat (`prisma/seed.ts`) — tidak butuh ubah arsitektur.
- Membuat **Postman/Bruno collection** dari `API_CONTRACT.md` lalu menguji tiap endpoint; laporkan mismatch response.
- Menulis **test endpoint** dengan Supertest (auth, resident, issue letter).
- Membantu **mapping tag template** (`template_tags_summary.json`) ke `fields` + `customData`.
- Review **kontrak response** sebelum FE menyambung (S1) agar tidak ada rework.
- Menyiapkan **data demo** dan skenario uji (surat lintas status).
