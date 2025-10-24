-- DropForeignKey
ALTER TABLE `pagto_servico` DROP FOREIGN KEY `pagto_servico_codFornecedor_fkey2`;

-- AlterTable
ALTER TABLE `pagto_servico` MODIFY `codFornecedor` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `pagto_servico` ADD CONSTRAINT `pagto_servico_codFornecedor_fkey2` FOREIGN KEY (`codFornecedor`) REFERENCES `fornecedor`(`codFornecedor`) ON DELETE SET NULL ON UPDATE CASCADE;
