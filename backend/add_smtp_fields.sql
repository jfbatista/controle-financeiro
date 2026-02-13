-- Add SMTP configuration fields to Company table
ALTER TABLE `Company` 
ADD COLUMN `smtpHost` VARCHAR(191) NULL,
ADD COLUMN `smtpPort` INT NULL,
ADD COLUMN `smtpUser` VARCHAR(191) NULL,
ADD COLUMN `smtpPass` VARCHAR(191) NULL,
ADD COLUMN `smtpSecure` BOOLEAN NULL DEFAULT true,
ADD COLUMN `smtpFrom` VARCHAR(191) NULL;
