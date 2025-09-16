-- DropForeignKey
ALTER TABLE `projeto` DROP FOREIGN KEY `projeto_ibfk_5`;

-- AlterTable
ALTER TABLE `projeto` MODIFY `CodEntExec` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `projeto` ADD CONSTRAINT `projeto_ibfk_5` FOREIGN KEY (`CodEntExec`) REFERENCES `entidadeexecutora`(`codEntExec`) ON DELETE SET NULL ON UPDATE CASCADE;
