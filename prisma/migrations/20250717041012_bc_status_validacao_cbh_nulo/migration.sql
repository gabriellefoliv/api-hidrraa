/*
  Warnings:

  - You are about to drop the column `dataConclusaoPrevistaEfetiva` on the `execucao_marco` table. All the data in the column will be lost.
  - You are about to drop the column `dataConclusaoPrevistaPrevista` on the `execucao_marco` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `execucao_marco` DROP COLUMN `dataConclusaoPrevistaEfetiva`,
    DROP COLUMN `dataConclusaoPrevistaPrevista`,
    ADD COLUMN `dataConclusaoEfetiva` DATE NULL,
    ADD COLUMN `dataConclusaoPrevista` DATE NULL,
    ALTER COLUMN `bc_statusValidacaoCBH` DROP DEFAULT;
