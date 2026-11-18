# Letter Templates Guide

Place Microsoft Word (`.docx`) template files here.

### Registered Templates in Database Seed:
| Kode | Nama Surat | File |
| :--- | :--- | :--- |
| `SKTM` | Surat Keterangan Tidak Mampu | `JA_SURAT KETERANGAN MISKIN KIS.docx` |
| `SKU` | Surat Keterangan Usaha | `NA_SURAT KETERANGAN USAHA.docx` |
| `SKD` | Surat Keterangan Domisili | `DA_SURAT KETERANGAN DOMISILI WARGA.docx` |
| `SKBM` | Surat Keterangan Belum Menikah | `C_SURAT KETERANGAN BELUM MENIKAH.docx` |
| `FPBK` | Form Permohonan Bantuan KIS | `AA_FORM PERMOHONAN BANTUAN KIS.docx` |
| `SPMK` | Surat Pernyataan Miskin KIS | `AB_SURAT PERNYATAAN MISKIN KIS.docx` |
| `SKBN` | Surat Keterangan Beda Nama | `B_SURAT-KETERANGAN-BEDA-NAMA.docx` |
| `SKDL` | Surat Keterangan Domisili Lembaga | `DB_SURAT KETERANGAN DOMISILI LEMBAGA.docx` |
| `SKDP` | Surat Keterangan Domisili Perusahaan | `DC_SURAT KETERANGAN DOMISILI PERUSAHAAN.docx` |
| `SKDP2` | Surat Keterangan Domisili Perusahaan (Variasi 2) | `EA_SURAT KETERANGAN DOMISILI PERUSAHAAN.docx` |
| `SKDPN` | Surat Keterangan Domisili Perusahaan Akta Notaris | `EB_SURAT KETERANGAN DOMISILI PERUSAHAAN AKTA NOTARIS.docx` |
| `SKDS` | Surat Keterangan Domisili Sekolah | `F_SURAT KETERANGAN DOMISILI SEKOLAH.docx` |
| `SKDY` | Surat Keterangan Domisili Yayasan | `G_SURAT KETERANGAN DOMISILI YAYASAN.docx` |
| `SKJU` | Surat Keterangan Janda Umum | `HA_SURAT KETERANGAN JANDA UMUM.docx` |
| `SKJCM` | Surat Keterangan Janda Cerai Mati | `HB_SURAT KETERANGAN JANDA CERAI MATI.docx` |
| `SKKK` | Surat Keterangan KK Baru | `I_SURAT KETERANGAN KK BARU.docx` |
| `SPMK2` | Surat Pernyataan Miskin KIS (RT/RW) | `JB_SURAT PERNYATAAN MISKIN KIS.docx` |
| `SKKU` | Surat Keterangan Keringanan UKT | `KA_SURAT KETERANGAN KERINGANAN UKT.docx` |
| `SKTMS` | Surat Keterangan Tidak Mampu Sekolah | `KB_SURAT KETERANGAN TIDAK MAMPU SEKOLAH.docx` |
| `SKNP` | Surat Keterangan Nadzir Perseorangan | `LA_SURAT KETERANGAN NADZIR PERSEORANGAN.docx` |
| `SKPBU` | Surat Keterangan Penghasilan Banding UKT | `LB_SURAT KETERANGAN PENGHASILAN BANDING UKT.docx` |
| `SPL` | Surat Pengesahan Lembaga | `LC_PENGESAHAN LEMBAGA.docx` |
| `SKJMC` | Surat Keterangan Janda Mati CPNS | `LD_SURAT KETERANGAN JANDA MATI CPNS.docx` |
| `SKBD` | Surat Keterangan Bersih Diri | `LE_SURAT KETERANGAN BERSIH DIRI.docx` |
| `SKUD` | Surat Keterangan Usaha Domisili | `M_SURAT-KETERANGAN-USAHA-DOMISILI.docx` |
| `SKDU` | Surat Keterangan Domisili Usaha | `NB_SURAT KETERANGAN DOMISILI USAHA.docx` |
| `SKW` | Surat Keterangan Wali | `O_SURAT-KETERANGAN-WALI.docx` |

Template baru dapat ditambahkan melalui halaman **Arsip Surat > Template Surat > Tambah Template** (isi nama, kode, deskripsi opsional, dan file `.docx`).

### Available Placeholders for Docxtemplater:
Use double curly braces inside Word:
- `{{nomor_surat}}` - Nomor surat resmi desa (e.g. `470/12/437.105.08/2026`)
- `{{keperluan}}` - Keperluan pengajuan surat
- `{{tanggal_surat}}` - Tanggal penerbitan surat (e.g. `29 September 2026`)
- `{{nik}}` - NIK 16 digit warga
- `{{nama}}` - Nama lengkap warga
- `{{tempat_lahir}}` - Tempat lahir
- `{{tanggal_lahir}}` - Tanggal lahir terformat
- `{{jenis_kelamin}}` - Jenis kelamin
- `{{golongan_darah}}` - Golongan darah (atau `-`)
- `{{alamat}}` - Alamat lengkap
- `{{rt}}` - Nomor RT
- `{{rw}}` - Nomor RW
- `{{kel_desa}}` - Desa (Gempolkurung)
- `{{kecamatan}}` - Kecamatan (Menganti)
- `{{agama}}` - Agama
- `{{status_perkawinan}}` - Status perkawinan
- `{{pekerjaan}}` - Pekerjaan
- `{{kewarganegaraan}}` - Kewarganegaraan (WNI)
