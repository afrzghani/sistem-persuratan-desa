-- Surat yang dibuat sebelum fitur status dianggap sudah selesai,
-- karena UI lama selalu menampilkan status "Selesai" untuk semua surat.
UPDATE `issued_letters`
SET `status` = 'Selesai'
WHERE `status` = 'Proses'
  AND `createdAt` < '2026-11-06 13:55:13.000';
