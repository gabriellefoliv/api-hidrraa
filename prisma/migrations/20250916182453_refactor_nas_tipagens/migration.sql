-- AlterTable
ALTER TABLE `entidadeexecutora` MODIFY `cnpjcpf` VARCHAR(255) NOT NULL,
    MODIFY `contato` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `investidor_esg` MODIFY `cnpj` VARCHAR(255) NOT NULL,
    MODIFY `contato` VARCHAR(255) NOT NULL;
