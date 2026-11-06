ALTER TABLE `letter_drafts` ADD COLUMN `issuedLetterId` INTEGER NULL;

CREATE UNIQUE INDEX `letter_drafts_issuedLetterId_key` ON `letter_drafts`(`issuedLetterId`);

ALTER TABLE `letter_drafts` ADD CONSTRAINT `letter_drafts_issuedLetterId_fkey` FOREIGN KEY (`issuedLetterId`) REFERENCES `issued_letters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
