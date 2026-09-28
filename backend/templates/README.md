# Letter Templates Guide

Place Microsoft Word (`.docx`) template files here.

### Registered Templates in Database Seed:
1. `sktm_template.docx` - Surat Keterangan Tidak Mampu
2. `sku_template.docx` - Surat Keterangan Usaha
3. `skd_template.docx` - Surat Keterangan Domisili

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
