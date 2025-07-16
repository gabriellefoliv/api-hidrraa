/*
  Warnings:

  - You are about to drop the column `dataConclusaoPrevista` on the `execucao_marco` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `execucao_marco` DROP COLUMN `dataConclusaoPrevista`,
    ADD COLUMN `dataConclusaoPrevistaEfetiva` DATE NULL,
    ADD COLUMN `dataConclusaoPrevistaPrevista` DATE NULL;
