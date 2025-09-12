/*
  Warnings:

  - You are about to alter the column `bc_valor` on the `pagto_marco_concluido` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `pagto_marco_concluido` MODIFY `bc_valor` DOUBLE NOT NULL;

-- CreateIndex
CREATE INDEX `codExecucaoMarco` ON `pagto_servico`(`codExecucaoMarco`);

-- AddForeignKey
ALTER TABLE `pagto_servico` ADD CONSTRAINT `pagto_servico_ibfk_1` FOREIGN KEY (`codExecucaoMarco`) REFERENCES `execucao_marco`(`codExecucaoMarco`) ON DELETE RESTRICT ON UPDATE CASCADE;
