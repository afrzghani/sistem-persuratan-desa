# Template Extra Fields — Referensi Lengkap

Dokumen ini menjelaskan field tambahan yang dibutuhkan oleh setiap template surat, **di luar data KTP standar** yang sudah otomatis diisi dari database warga.

---

## Apa yang Sudah Otomatis Diisi?

Backend sudah otomatis mengisi field-field berikut dari data warga (tabel `residents`) dan pengaturan desa:

| Field di Docx | Sumber Data |
|---|---|
| `Nama` | Nama lengkap warga |
| `NIK` | NIK warga |
| `Tempat` / `Tempat_Lahir` | Tempat lahir warga |
| `Tanggal` / `Tanggal_Lahir` | Tanggal lahir warga (format: 29 September 2026) |
| `Kelamin` / `Jenis_Kelamin` | Jenis kelamin warga |
| `Agama` | Agama warga |
| `Alamat` | Alamat + RT/RW warga |
| `RT` / `RW` | RT dan RW warga |
| `Pekerjaan` | Pekerjaan warga |
| `Status_Kawin` / `Status_Perkawinan` | Status perkawinan warga |
| `Kewarganegaraan` | Kewarganegaraan (default: WNI) |
| `No_Surat` | Nomor surat yang diinput operator |
| `Keperluan` | Keperluan surat yang diinput operator |
| `Tanggal_Surat` | Tanggal hari ini (otomatis) |
| `Kepala_Desa` | Nama kepala desa (dari pengaturan desa) |

**Kesimpulan:** Field-field di atas tidak perlu diisi ulang oleh operator. Yang perlu diisi adalah field-field tambahan di bawah ini, yang berbeda-beda tergantung jenis surat.

---

## Ringkasan per Template

### Tanpa Field Tambahan (7 template)

Template-template ini **tidak memerlukan input tambahan** selain data KTP + nomor surat + keperluan.

| Kode | Nama Surat |
|---|---|
| `SKD` | Surat Keterangan Domisili Warga |
| `SKBM` | Surat Keterangan Belum Menikah |
| `SKDS` | Surat Keterangan Domisili Sekolah |
| `SKJU` | Surat Keterangan Janda Umum |
| `SKJCM` | Surat Keterangan Janda Cerai Mati |
| `SKKK` | Surat Keterangan KK Baru |
| `SKJMC` | Surat Keterangan Janda Mati CPNS |

---

### Dengan Field Tambahan (20 template)

---

#### `FPBK` — Form Permohonan Bantuan KIS

Formulir permohonan Kartu Indonesia Sehat. Butuh data anggota keluarga lain selain pemohon.

| Field | Label | Tipe | Wajib? |
|---|---|---|---|
| `Nama_Istri` | Nama Istri | Teks | Ya |
| `Nama_Anak1` | Nama Anak Pertama | Teks | Tidak |
| `Nama_Anak2` | Nama Anak Kedua | Teks | Tidak |

---

#### `SPMK` — Surat Pernyataan Miskin KIS

| Field | Label | Tipe | Wajib? |
|---|---|---|---|
| `Nama_Anak` | Nama Anak Tanggungan | Teks | Ya |

---

#### `SKBN` — Surat Keterangan Beda Nama

Surat untuk menyatakan bahwa dua nama pada dua dokumen berbeda merujuk pada orang yang sama. Butuh detail kedua dokumen tersebut.

| Field | Label | Tipe | Wajib? |
|---|---|---|---|
| `Dokumen_A` | Jenis Dokumen A | Teks | Ya |
| `Nama_A` | Nama pada Dokumen A | Teks | Ya |
| `Dokumen_B` | Jenis Dokumen B | Teks | Ya |
| `Nama_B` | Nama pada Dokumen B | Teks | Ya |

> **Contoh:** Dokumen A = "KTP", Nama A = "Ahmad Fauzi". Dokumen B = "Ijazah", Nama B = "Achmad Fauzi".

---

#### `SKDL` — Surat Keterangan Domisili Lembaga

Domisili lembaga/organisasi. KTP yang di-scan adalah orang yang mewakili lembaga tersebut.

| Field | Label | Tipe | Wajib? |
|---|---|---|---|
| `Jabatan` | Jabatan Pemohon di Lembaga | Teks | Ya |
| `Alamat_Lembaga` | Alamat Lembaga | Teks | Ya |

---

#### `SKDP` — Surat Keterangan Domisili Perusahaan

Domisili perusahaan standar tanpa akta notaris.

| Field | Label | Tipe | Wajib? |
|---|---|---|---|
| `Nama_Perusahaan` | Nama Perusahaan | Teks | Ya |
| `Jenis_Usaha` | Jenis Usaha | Teks | Ya |
| `Alamat_Perusahaan` | Alamat Perusahaan | Teks | Ya |
| `Pimpinan_Perusahaan` | Nama Pimpinan | Teks | Ya |
| `Jabatan_Perusahaan` | Jabatan Pimpinan di Perusahaan | Teks | Ya |
| `Akhir_Berlaku` | Tanggal Akhir Berlaku | Tanggal | Tidak |

---

#### `SKDPN` — Surat Keterangan Domisili Perusahaan Akta Notaris

Versi lengkap dengan akta pendirian dan data notaris wajib diisi semua.

| Field | Label | Tipe | Wajib? |
|---|---|---|---|
| `Nama_Perusahaan` | Nama Perusahaan | Teks | Ya |
| `Jenis_Usaha` | Jenis Usaha | Teks | Ya |
| `Alamat_Perusahaan` | Alamat Perusahaan | Teks | Ya |
| `Pimpinan_Perusahaan` | Nama Pimpinan | Teks | Ya |
| `Jabatan_Perusahaan` | Jabatan Pimpinan | Teks | Ya |
| `Akta_Pendirian` | Nomor Akta Pendirian | Teks | Ya |
| `Nama_Notaris` | Nama Notaris | Teks | Ya |
| `Nomor_Notaris` | Nomor Akta Notaris | Teks | Ya |
| `Tanggal_Notaris` | Tanggal Akta Notaris | Tanggal | Ya |
| `Akhir_Berlaku` | Tanggal Akhir Berlaku | Tanggal | Tidak |

---

#### `SKDY` — Surat Keterangan Domisili Yayasan

Surat untuk yayasan. KTP yang di-scan bisa berupa perwakilan yayasan.

| Field | Label | Tipe | Wajib? |
|---|---|---|---|
| `Nama_Yayasan` | Nama Yayasan | Teks | Ya |
| `Pimpinan_Yayasan` | Nama Ketua / Pimpinan | Teks | Ya |
| `Alamat_Yayasan` | Alamat Yayasan | Teks | Ya |

---

#### `SKTM` — Surat Keterangan Tidak Mampu

Surat untuk keperluan beasiswa, keringanan RS, atau bantuan sosial. Butuh nomor KK dan data pejabat camat (karena surat ini biasanya memerlukan tanda tangan camat juga).

| Field | Label | Tipe | Wajib? |
|---|---|---|---|
| `No_KK` | Nomor Kartu Keluarga | Teks | Ya |
| `Camat_Menganti` | Nama Camat Menganti | Teks | Ya |
| `Ket_Camat` | Jabatan Camat | Teks | Ya |
| `NIP_Camat` | NIP Camat | Teks | Ya |

> **Catatan:** Data camat bisa distandarisasi dan dijadikan setting desa di versi mendatang agar operator tidak perlu mengisi berulang.

---

#### `SPMKT` — Surat Pernyataan Miskin KIS (RT/RW)

Versi pernyataan miskin dengan pengesahan RT dan RW serta camat.

| Field | Label | Tipe | Wajib? |
|---|---|---|---|
| `Ketua_RT` | Nama Ketua RT | Teks | Ya |
| `Ketua_RW` | Nama Ketua RW | Teks | Ya |
| `Ket_Camat` | Jabatan Camat | Teks | Ya |
| `NIP_Camat` | NIP Camat | Teks | Ya |

---

#### `SKKU` — Surat Keterangan Keringanan UKT

Surat untuk mahasiswa yang memerlukan keringanan UKT. KTP yang di-scan adalah orang tua/wali. Field tambahan berisi data sang anak/mahasiswa.

| Field | Label | Tipe | Wajib? |
|---|---|---|---|
| `No_KK` | Nomor Kartu Keluarga | Teks | Ya |
| `Nama_Anak` | Nama Mahasiswa (Anak) | Teks | Ya |
| `NIK_Anak` | NIK Mahasiswa | Teks | Ya |
| `Kelamin_Anak` | Jenis Kelamin Mahasiswa | Pilihan | Ya |
| `Tempat_Anak` | Tempat Lahir Mahasiswa | Teks | Ya |
| `Tanggal_Anak` | Tanggal Lahir Mahasiswa | Tanggal | Ya |
| `Universitas_Anak` | Nama Universitas / Kampus | Teks | Ya |

---

#### `SKTMS` — Surat Keterangan Tidak Mampu Sekolah

Mirip SKKU, tapi untuk siswa sekolah (bukan mahasiswa).

| Field | Label | Tipe | Wajib? |
|---|---|---|---|
| `No_KK` | Nomor Kartu Keluarga | Teks | Ya |
| `Nama_Anak` | Nama Anak / Siswa | Teks | Ya |
| `Kelamin_Anak` | Jenis Kelamin Anak | Pilihan | Ya |
| `Tempat_Anak` | Tempat Lahir Anak | Teks | Ya |
| `Tanggal_Anak` | Tanggal Lahir Anak | Tanggal | Ya |
| `Sekolah_Anak` | Nama Sekolah | Teks | Ya |

---

#### `SKNP` — Surat Keterangan Nadzir Perseorangan

Template paling kompleks. Butuh data 4 orang pengurus nadzir (Ketua, Sekretaris, Bendahara, Anggota) dan data masjid/musholla yang dikelola.

**Data Masjid:**

| Field | Label | Tipe | Wajib? |
|---|---|---|---|
| `Masjid` | Nama Masjid / Musholla | Teks | Ya |
| `Dusun` | Nama Dusun | Teks | Ya |

**Data Ketua, Sekretaris, Bendahara, dan Anggota** (masing-masing memiliki):

| Field (suffix) | Label | Tipe |
|---|---|---|
| `Nama_[Jabatan]` | Nama Lengkap | Teks |
| `NIK_[Jabatan]` | NIK | Teks |
| `Tempat_[Jabatan]` | Tempat Lahir | Teks |
| `Tanggal_[Jabatan]` | Tanggal Lahir | Tanggal |
| `Umur_[Jabatan]` | Umur (tahun) | Angka |
| `Pekerjaan_[Jabatan]` | Pekerjaan | Teks |
| `TempatTinggal_[Jabatan]` | Alamat Tempat Tinggal | Teks |

> Total: 2 + (4 jabatan × 7 field) = **30 field tambahan.**

---

#### `SKPBU` — Surat Keterangan Penghasilan Banding UKT

| Field | Label | Tipe | Wajib? |
|---|---|---|---|
| `Status` | Status Perkawinan | Teks | Ya |
| `Penghasilan` | Penghasilan per Bulan | Teks | Ya |
| `Universitas` | Nama Universitas | Teks | Ya |

> **Catatan:** Field `Status` di template ini berbeda dari `Status_Kawin` yang otomatis diisi. Karena itu tetap perlu diisi manual.

---

#### `SPL` — Surat Pengesahan Lembaga

| Field | Label | Tipe | Wajib? |
|---|---|---|---|
| `Lembaga` | Nama Lembaga | Teks | Ya |
| `Tanggal_Lembaga` | Tanggal Berdiri Lembaga | Tanggal | Ya |
| `Alamat_Lembaga` | Alamat Lembaga | Teks | Ya |
| `Ketua` | Nama Ketua Lembaga | Teks | Ya |
| `Alamat_Ketua` | Alamat Ketua | Teks | Ya |
| `Camat_Menganti` | Nama Camat Menganti | Teks | Ya |
| `NIP_Camat` | NIP Camat | Teks | Ya |

---

#### `SKBD` — Surat Keterangan Bersih Diri

| Field | Label | Tipe | Wajib? |
|---|---|---|---|
| `No_KK` | Nomor Kartu Keluarga | Teks | Ya |
| `Dusun` | Nama Dusun | Teks | Ya |
| `Tujuan` | Tujuan Pembuatan Surat | Teks | Ya |

---

#### `SKUD` — Surat Keterangan Usaha Domisili

| Field | Label | Tipe | Wajib? |
|---|---|---|---|
| `Umur` | Umur Pemohon (tahun) | Angka | Ya |
| `Usaha` | Jenis / Nama Usaha | Teks | Ya |
| `Alamat_Usaha` | Alamat Lokasi Usaha | Teks | Ya |

---

#### `SKU` — Surat Keterangan Usaha

| Field | Label | Tipe | Wajib? |
|---|---|---|---|
| `Umur` | Umur Pemohon (tahun) | Angka | Ya |
| `Usaha` | Jenis / Nama Usaha | Teks | Ya |

---

#### `SKDU` — Surat Keterangan Domisili Usaha

| Field | Label | Tipe | Wajib? |
|---|---|---|---|
| `Usaha` | Nama Usaha | Teks | Ya |
| `Pimpinan` | Nama Pimpinan Usaha | Teks | Ya |
| `Alamat_Pimpinan` | Alamat Pimpinan | Teks | Ya |
| `Bidang_Usaha` | Bidang Usaha | Teks | Ya |
| `Alamat_Usaha` | Alamat Lokasi Usaha | Teks | Ya |

---

#### `SKW` — Surat Keterangan Wali

Surat wali pernikahan. KTP yang di-scan bisa berupa wali atau pemohon. Semua field menggunakan suffix untuk membedakan data wali dan data calon mempelai.

**Data Wali:**

| Field | Label | Tipe | Wajib? |
|---|---|---|---|
| `Nama_Wali` | Nama Wali | Teks | Ya |
| `NIK_Wali` | NIK Wali | Teks | Ya |
| `Tempat_Wali` | Tempat Lahir Wali | Teks | Ya |
| `Tanggal_Wali` | Tanggal Lahir Wali | Tanggal | Ya |
| `Pekerjaan_Wali` | Pekerjaan Wali | Teks | Ya |
| `Alamat_Wali` | Alamat Wali | Teks | Ya |
| `Status_Wali` | Hubungan Wali dengan Mempelai | Teks | Ya |

**Data Calon Mempelai:**

| Field | Label | Tipe | Wajib? |
|---|---|---|---|
| `Nama_Mempelai` | Nama Calon Mempelai | Teks | Ya |
| `NIK_Mempelai` | NIK Calon Mempelai | Teks | Ya |
| `Tempat_Mempelai` | Tempat Lahir Calon Mempelai | Teks | Ya |
| `Tanggal_Mempelai` | Tanggal Lahir Calon Mempelai | Tanggal | Ya |
| `Pekerjaan_Mempelai` | Pekerjaan Calon Mempelai | Teks | Ya |
| `Alamat_Mempelai` | Alamat Calon Mempelai | Teks | Ya |

---

## Rekapitulasi Jumlah Field Tambahan

| Kode | Jumlah Field Tambahan |
|---|---|
| `SKBM`, `SKD`, `SKDS`, `SKJU`, `SKJCM`, `SKKK`, `SKJMC` | 0 |
| `SPMK` | 1 |
| `SKDL`, `SKDY` | 2 |
| `SKUD`, `SKPBU` | 3 |
| `SKBN`, `SPMKT`, `SKBD`, `SKDU` | 4 |
| `FPBK` | 3 |
| `SKDP` | 6 |
| `SKKU`, `SKTMS`, `SPL` | 6–7 |
| `SKDPN` | 10 |
| `SKW` | 13 |
| `SKNP` | 30 |

---

## Catatan Penting untuk Implementasi

1. **`Umur`** pada `SKU` dan `SKUD` tidak dihitung otomatis dari `tanggalLahir`. Operator wajib mengisi manual.
2. **Data Camat** (`Camat_Menganti`, `Ket_Camat`, `NIP_Camat`) muncul di `SKTM`, `SPMKT`, dan `SPL`. Ke depan bisa disimpan di tabel `DesaSetting` agar tidak perlu diisi berulang.
3. **`Status`** pada `SKPBU` berbeda dari `Status_Kawin` yang sudah diisi otomatis — field ini menggunakan nama tag yang berbeda di template docx-nya.
4. **`SKNP`** adalah template terberat dengan 30 field tambahan. Pertimbangkan memberi UI khusus (misalnya dengan section/accordion per jabatan) agar UX tidak terlalu panjang.
