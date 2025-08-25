-- CreateTable
CREATE TABLE `fornecedor` (
    `codFornecedor` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `cnpjcpf` INTEGER NOT NULL,
    `contato` INTEGER NOT NULL,
    `especialidade` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`codFornecedor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pagto_servico` (
    `codPagtoServico` INTEGER NOT NULL AUTO_INCREMENT,
    `data` DATETIME(3) NOT NULL,
    `valor` DOUBLE NOT NULL,
    `docNF` VARCHAR(191) NOT NULL,
    `codFornecedor` INTEGER NOT NULL,
    `codExecucaoMarco` INTEGER NOT NULL,

    PRIMARY KEY (`codPagtoServico`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transacao_blockchain` (
    `codTransacao` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` ENUM('aporte', 'pagamento_servico', 'pagamento_marco') NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `valor` DOUBLE NOT NULL,
    `data` DATETIME(3) NOT NULL,
    `origemWallet` VARCHAR(191) NULL,
    `destinoWallet` VARCHAR(191) NULL,
    `status` ENUM('pendente', 'confirmada', 'falha') NOT NULL DEFAULT 'pendente',
    `codAporte` INTEGER NULL,
    `codPagtoServico` INTEGER NULL,
    `codPagtoMarco` INTEGER NULL,

    PRIMARY KEY (`codTransacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pagto_servico` ADD CONSTRAINT `pagto_servico_codFornecedor_fkey` FOREIGN KEY (`codFornecedor`) REFERENCES `fornecedor`(`codFornecedor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transacao_blockchain` ADD CONSTRAINT `transacao_blockchain_codAporte_fkey` FOREIGN KEY (`codAporte`) REFERENCES `aporte`(`codAporte`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transacao_blockchain` ADD CONSTRAINT `transacao_blockchain_codPagtoServico_fkey` FOREIGN KEY (`codPagtoServico`) REFERENCES `pagto_servico`(`codPagtoServico`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transacao_blockchain` ADD CONSTRAINT `transacao_blockchain_codPagtoMarco_fkey` FOREIGN KEY (`codPagtoMarco`) REFERENCES `pagto_marco_concluido`(`codPagtoMarco`) ON DELETE SET NULL ON UPDATE CASCADE;
