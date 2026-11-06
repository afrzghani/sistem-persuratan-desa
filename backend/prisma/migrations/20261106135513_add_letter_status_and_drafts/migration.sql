-- AlterTable
ALTER TABLE `issued_letters` ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'Proses';

-- CreateTable
CREATE TABLE `letter_drafts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `operatorId` INTEGER NOT NULL,
    `templateId` INTEGER NULL,
    `step` INTEGER NOT NULL DEFAULT 1,
    `formData` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `letter_drafts_operatorId_key`(`operatorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `letter_drafts` ADD CONSTRAINT `letter_drafts_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_drafts` ADD CONSTRAINT `letter_drafts_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `letter_templates`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
