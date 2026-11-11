-- CreateTable
CREATE TABLE `desa_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaDesa` VARCHAR(191) NOT NULL DEFAULT 'Gempolkurung',
    `kecamatan` VARCHAR(191) NOT NULL DEFAULT 'Menganti',
    `kabupaten` VARCHAR(191) NOT NULL DEFAULT 'Gresik',
    `alamatDesa` VARCHAR(191) NOT NULL DEFAULT 'Jl. Desa Gempolkurung No. 332A, Menganti, Gresik 61174',
    `namaKepalaDesa` VARCHAR(191) NOT NULL DEFAULT 'H. SUBANDI',
    `jabatan` VARCHAR(191) NOT NULL DEFAULT 'Kepala Desa',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
