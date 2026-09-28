-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'OPERATOR',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `residents` (
    `nik` VARCHAR(16) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `tempatLahir` VARCHAR(191) NOT NULL,
    `tanggalLahir` DATETIME(3) NOT NULL,
    `jenisKelamin` VARCHAR(191) NOT NULL,
    `golonganDarah` VARCHAR(191) NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `rt` VARCHAR(5) NULL,
    `rw` VARCHAR(5) NULL,
    `kelDesa` VARCHAR(191) NOT NULL DEFAULT 'Gempolkurung',
    `kecamatan` VARCHAR(191) NOT NULL DEFAULT 'Menganti',
    `kabupaten` VARCHAR(191) NOT NULL DEFAULT 'Gresik',
    `agama` VARCHAR(191) NULL,
    `statusPerkawinan` VARCHAR(191) NULL,
    `pekerjaan` VARCHAR(191) NULL,
    `kewarganegaraan` VARCHAR(191) NOT NULL DEFAULT 'WNI',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`nik`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `letter_templates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kodeSurat` VARCHAR(191) NOT NULL,
    `namaSurat` VARCHAR(191) NOT NULL,
    `templateFile` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `letter_templates_kodeSurat_key`(`kodeSurat`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `issued_letters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomorSurat` VARCHAR(191) NOT NULL,
    `residentNik` VARCHAR(16) NOT NULL,
    `templateId` INTEGER NOT NULL,
    `operatorId` INTEGER NOT NULL,
    `keperluan` TEXT NOT NULL,
    `generatedFile` VARCHAR(191) NULL,
    `issuedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `issued_letters_nomorSurat_key`(`nomorSurat`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `issued_letters` ADD CONSTRAINT `issued_letters_residentNik_fkey` FOREIGN KEY (`residentNik`) REFERENCES `residents`(`nik`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `issued_letters` ADD CONSTRAINT `issued_letters_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `letter_templates`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `issued_letters` ADD CONSTRAINT `issued_letters_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
