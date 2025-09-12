/*
  Warnings:

  - You are about to drop the `avaliacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `avaliacao_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `avaliador_cbh` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `criterio_aval` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `avaliacao` DROP FOREIGN KEY `avaliacao_ibfk_1`;

-- DropForeignKey
ALTER TABLE `avaliacao` DROP FOREIGN KEY `avaliacao_ibfk_2`;

-- DropForeignKey
ALTER TABLE `avaliacao_item` DROP FOREIGN KEY `avaliacao_item_ibfk_1`;

-- DropForeignKey
ALTER TABLE `avaliacao_item` DROP FOREIGN KEY `avaliacao_item_ibfk_2`;

-- DropForeignKey
ALTER TABLE `avaliador_cbh` DROP FOREIGN KEY `avaliador_cbh_ibfk_1`;

-- DropForeignKey
ALTER TABLE `execucao_marco` DROP FOREIGN KEY `execucao_marco_ibfk_1`;

-- DropTable
DROP TABLE `avaliacao`;

-- DropTable
DROP TABLE `avaliacao_item`;

-- DropTable
DROP TABLE `avaliador_cbh`;

-- DropTable
DROP TABLE `criterio_aval`;
