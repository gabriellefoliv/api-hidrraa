/*
  Warnings:

  - You are about to alter the column `orcamento` on the `projeto` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `fornecedor` MODIFY `cnpjcpf` VARCHAR(255) NOT NULL,
    MODIFY `contato` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `produtor_rural` MODIFY `cpf` VARCHAR(255) NOT NULL,
    MODIFY `contato` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `projeto` MODIFY `orcamento` DOUBLE NULL;

-- AlterTable
ALTER TABLE `propriedade` MODIFY `cep` VARCHAR(255) NOT NULL;
