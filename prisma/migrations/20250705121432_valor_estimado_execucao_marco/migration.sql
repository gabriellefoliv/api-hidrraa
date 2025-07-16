/*
  Warnings:

  - You are about to alter the column `bc_valor` on the `aporte` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `bc_statusValidacaoCBH` on the `execucao_marco` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.
  - You are about to drop the column `valorEstimado` on the `marco_recomendado` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codProjeto,codMarcoRecomendado]` on the table `execucao_marco` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codAvaliacao` to the `avaliacao_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codUsuario` to the `entidadeexecutora` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codUsuario` to the `investidor_esg` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `projeto` DROP FOREIGN KEY `projeto_ibfk_3`;

-- AlterTable
ALTER TABLE `aporte` MODIFY `bc_valor` FLOAT NOT NULL;

-- AlterTable
ALTER TABLE `avaliacao_item` ADD COLUMN `codAvaliacao` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `entidadeexecutora` ADD COLUMN `codUsuario` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `execucao_marco` ADD COLUMN `valorEstimado` FLOAT NULL,
    MODIFY `dataConclusaoPrevista` DATE NULL,
    MODIFY `descricao` VARCHAR(255) NULL,
    MODIFY `bc_statusValidacaoCBH` ENUM('PENDENTE', 'APROVADO', 'REPROVADO') NULL DEFAULT 'PENDENTE',
    MODIFY `codAvaliador` INTEGER NULL;

-- AlterTable
ALTER TABLE `investidor_esg` ADD COLUMN `codUsuario` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `marco_recomendado` DROP COLUMN `valorEstimado`;

-- AlterTable
ALTER TABLE `projeto` ADD COLUMN `dataSubmissao` DATE NULL,
    MODIFY `titulo` VARCHAR(255) NULL,
    MODIFY `objetivo` VARCHAR(255) NULL,
    MODIFY `acoes` VARCHAR(255) NULL,
    MODIFY `cronograma` VARCHAR(255) NULL,
    MODIFY `orcamento` INTEGER NULL,
    MODIFY `CodMicroBacia` INTEGER NULL;

-- CreateIndex
CREATE INDEX `codAvaliacao` ON `avaliacao_item`(`codAvaliacao`);

-- CreateIndex
CREATE INDEX `codUsuario` ON `entidadeexecutora`(`codUsuario`);

-- CreateIndex
CREATE UNIQUE INDEX `execucao_marco_codProjeto_codMarcoRecomendado_key` ON `execucao_marco`(`codProjeto`, `codMarcoRecomendado`);

-- CreateIndex
CREATE INDEX `codUsuario` ON `investidor_esg`(`codUsuario`);

-- AddForeignKey
ALTER TABLE `avaliacao_item` ADD CONSTRAINT `avaliacao_item_ibfk_2` FOREIGN KEY (`codAvaliacao`) REFERENCES `avaliacao`(`codAvaliacao`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entidadeexecutora` ADD CONSTRAINT `entidadeexecutora_ibfk_1` FOREIGN KEY (`codUsuario`) REFERENCES `usuario`(`codUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `investidor_esg` ADD CONSTRAINT `investidor_esg_ibfk_1` FOREIGN KEY (`codUsuario`) REFERENCES `usuario`(`codUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projeto` ADD CONSTRAINT `projeto_ibfk_5` FOREIGN KEY (`CodEntExec`) REFERENCES `entidadeexecutora`(`codEntExec`) ON DELETE RESTRICT ON UPDATE CASCADE;
