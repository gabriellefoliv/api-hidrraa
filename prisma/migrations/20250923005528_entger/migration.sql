-- AlterTable
ALTER TABLE `projeto` ADD COLUMN `codEntGer` INTEGER NULL;

-- CreateTable
CREATE TABLE `entidade_gerenciadora` (
    `codEntGer` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `cnpjcpf` VARCHAR(255) NOT NULL,
    `especialidade` VARCHAR(255) NOT NULL,
    `contato` VARCHAR(255) NOT NULL,
    `codUsuario` INTEGER NOT NULL,

    INDEX `codUsuario`(`codUsuario`),
    PRIMARY KEY (`codEntGer`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `entidade_gerenciadora` ADD CONSTRAINT `entidadegerenciadora_ibfk_1` FOREIGN KEY (`codUsuario`) REFERENCES `usuario`(`codUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projeto` ADD CONSTRAINT `projeto_ibfk_6` FOREIGN KEY (`codEntGer`) REFERENCES `entidade_gerenciadora`(`codEntGer`) ON DELETE SET NULL ON UPDATE CASCADE;
