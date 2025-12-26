-- CreateTable
CREATE TABLE `alocacao_recurso` (
    `codAlocacao` INTEGER NOT NULL AUTO_INCREMENT,
    `codAporte` INTEGER NOT NULL,
    `codProjeto` INTEGER NOT NULL,
    `valor` DOUBLE NOT NULL,
    `data` DATETIME(3) NOT NULL,
    `txHash` VARCHAR(255) NULL,

    INDEX `alocacao_recurso_codAporte_idx`(`codAporte`),
    INDEX `alocacao_recurso_codProjeto_idx`(`codProjeto`),
    PRIMARY KEY (`codAlocacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `alocacao_recurso` ADD CONSTRAINT `alocacao_recurso_ibfk_1` FOREIGN KEY (`codAporte`) REFERENCES `aporte`(`codAporte`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alocacao_recurso` ADD CONSTRAINT `alocacao_recurso_ibfk_2` FOREIGN KEY (`codProjeto`) REFERENCES `projeto`(`codProjeto`) ON DELETE RESTRICT ON UPDATE CASCADE;
