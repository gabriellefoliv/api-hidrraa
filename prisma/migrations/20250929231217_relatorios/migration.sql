-- CreateTable
CREATE TABLE `relatorio_gerenciadora` (
    `codRelGer` INTEGER NOT NULL AUTO_INCREMENT,
    `caminhoArquivo` VARCHAR(255) NOT NULL,
    `dataUpload` DATETIME(0) NOT NULL,
    `codExecucaoMarco` INTEGER NOT NULL,
    `codEntGer` INTEGER NOT NULL,

    PRIMARY KEY (`codRelGer`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `relatorio_gerenciadora` ADD CONSTRAINT `relatorio_gerenciadora_ibfk_1` FOREIGN KEY (`codExecucaoMarco`) REFERENCES `execucao_marco`(`codExecucaoMarco`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `relatorio_gerenciadora` ADD CONSTRAINT `relatorio_gerenciadora_ibfk_2` FOREIGN KEY (`codEntGer`) REFERENCES `entidade_gerenciadora`(`codEntGer`) ON DELETE RESTRICT ON UPDATE CASCADE;
