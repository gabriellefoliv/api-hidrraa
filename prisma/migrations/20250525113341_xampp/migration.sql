-- CreateTable
CREATE TABLE `aporte` (
    `codAporte` INTEGER NOT NULL AUTO_INCREMENT,
    `dataInvestimento` DATETIME(0) NOT NULL,
    `bc_valor` INTEGER NOT NULL,
    `validadoAGEVAP` BOOLEAN NOT NULL DEFAULT false,
    `codInvestidor` INTEGER NOT NULL,
    `codCBH` INTEGER NOT NULL,

    INDEX `codCBH`(`codCBH`),
    INDEX `codInvestidor`(`codInvestidor`),
    PRIMARY KEY (`codAporte`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliacao` (
    `codAvaliacao` INTEGER NOT NULL AUTO_INCREMENT,
    `dataIni` DATETIME(0) NOT NULL,
    `dataFim` DATETIME(0) NOT NULL,
    `bc_aprovado` BOOLEAN NOT NULL,
    `bc_valorPagto` FLOAT NOT NULL,
    `codProjeto` INTEGER NOT NULL,
    `codAvaliador` INTEGER NOT NULL,

    INDEX `codAvaliador`(`codAvaliador`),
    INDEX `codProjeto`(`codProjeto`),
    PRIMARY KEY (`codAvaliacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliacao_item` (
    `codAvalItem` INTEGER NOT NULL AUTO_INCREMENT,
    `nota` FLOAT NOT NULL,
    `parecer` VARCHAR(255) NOT NULL,
    `codCriterioAval` INTEGER NOT NULL,

    INDEX `codCriterioAval`(`codCriterioAval`),
    PRIMARY KEY (`codAvalItem`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliador_cbh` (
    `codAvaliador` INTEGER NOT NULL,
    `codCBH` INTEGER NOT NULL,

    UNIQUE INDEX `avaliador_cbh_codAvaliador_key`(`codAvaliador`),
    INDEX `codAvaliador`(`codAvaliador`),
    INDEX `codCBH`(`codCBH`),
    PRIMARY KEY (`codAvaliador`, `codCBH`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cbh` (
    `codCBH` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`codCBH`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comite_investido` (
    `codCBH` INTEGER NOT NULL,
    `codInvestidor` INTEGER NOT NULL,

    INDEX `codCBH`(`codCBH`),
    INDEX `codInvestidor`(`codInvestidor`),
    PRIMARY KEY (`codCBH`, `codInvestidor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `criterio_aval` (
    `codCriterioAval` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(255) NOT NULL,
    `peso` FLOAT NOT NULL,

    PRIMARY KEY (`codCriterioAval`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entidadeexecutora` (
    `codEntExec` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `cnpjcpf` INTEGER NOT NULL,
    `especialidade` VARCHAR(255) NOT NULL,
    `contato` INTEGER NOT NULL,

    PRIMARY KEY (`codEntExec`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evidencia_apresentada` (
    `codEvidenciaApresentada` INTEGER NOT NULL AUTO_INCREMENT,
    `caminhoArquivo` VARCHAR(255) NOT NULL,
    `dataUpload` DATETIME(0) NOT NULL,
    `codExecucaoMarco` INTEGER NOT NULL,
    `codEvidenciaDemandada` INTEGER NOT NULL,

    INDEX `codEvidenciaDemandada`(`codEvidenciaDemandada`),
    INDEX `codExecucaoMarco`(`codExecucaoMarco`),
    PRIMARY KEY (`codEvidenciaApresentada`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evidencia_demandada` (
    `codEvidenciaDemandada` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(255) NOT NULL,
    `tipoArquivo` VARCHAR(255) NOT NULL,
    `codMarcoRecomendado` INTEGER NOT NULL,

    INDEX `codMarcoRecomendado`(`codMarcoRecomendado`),
    PRIMARY KEY (`codEvidenciaDemandada`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `execucao_marco` (
    `codExecucaoMarco` INTEGER NOT NULL AUTO_INCREMENT,
    `dataConclusaoPrevista` DATETIME(0) NOT NULL,
    `descricao` VARCHAR(255) NOT NULL,
    `descrDetAjustes` VARCHAR(255) NULL,
    `bc_statusValidacaoCBH` ENUM('PENDENTE', 'APROVADO', 'REPROVADO', '') NOT NULL,
    `codAvaliador` INTEGER NOT NULL,
    `codMarcoRecomendado` INTEGER NOT NULL,
    `codProjeto` INTEGER NOT NULL,

    INDEX `codAvaliador`(`codAvaliador`),
    INDEX `codMarcoRecomendado`(`codMarcoRecomendado`),
    INDEX `codProjeto`(`codProjeto`),
    PRIMARY KEY (`codExecucaoMarco`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `investidor_esg` (
    `codInvestidor` INTEGER NOT NULL AUTO_INCREMENT,
    `razaoSocial` VARCHAR(255) NOT NULL,
    `cnpj` INTEGER NOT NULL,
    `contato` INTEGER NOT NULL,

    PRIMARY KEY (`codInvestidor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `marco_recomendado` (
    `codMarcoRecomendado` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(255) NOT NULL,
    `valorEstimado` INTEGER NOT NULL,
    `codTipoProjeto` INTEGER NOT NULL,

    INDEX `codTipoProjeto`(`codTipoProjeto`),
    PRIMARY KEY (`codMarcoRecomendado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `microbacia` (
    `CodMicroBacia` INTEGER NOT NULL AUTO_INCREMENT,
    `Nome` VARCHAR(200) NOT NULL,
    `CodCBH` INTEGER NOT NULL,

    INDEX `CodCBH`(`CodCBH`),
    PRIMARY KEY (`CodMicroBacia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pagto_marco_concluido` (
    `codPagtoMarco` INTEGER NOT NULL AUTO_INCREMENT,
    `bc_data` DATETIME(0) NOT NULL,
    `bc_valor` INTEGER NOT NULL,
    `codExecucaoMarco` INTEGER NOT NULL,
    `codProdutor` INTEGER NULL,
    `CodEntExec` INTEGER NULL,

    INDEX `CodEntExec`(`CodEntExec`),
    INDEX `codExecucaoMarco`(`codExecucaoMarco`),
    INDEX `codProdutor`(`codProdutor`),
    PRIMARY KEY (`codPagtoMarco`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produtor_rural` (
    `codProdutor` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `cpf` INTEGER NOT NULL,
    `contato` INTEGER NOT NULL,
    `codCBH` INTEGER NOT NULL,

    INDEX `codCBH`(`codCBH`),
    PRIMARY KEY (`codProdutor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projeto` (
    `codProjeto` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(255) NOT NULL,
    `objetivo` VARCHAR(255) NOT NULL,
    `acoes` VARCHAR(255) NOT NULL,
    `cronograma` VARCHAR(255) NOT NULL,
    `orcamento` INTEGER NOT NULL,
    `codPropriedade` INTEGER NULL,
    `codTipoProjeto` INTEGER NOT NULL,
    `CodEntExec` INTEGER NOT NULL,
    `CodMicroBacia` INTEGER NOT NULL,

    INDEX `CodEntExecutora`(`CodEntExec`),
    INDEX `CodMicroBacia`(`CodMicroBacia`),
    INDEX `codPropriedade`(`codPropriedade`),
    INDEX `codTipoProjeto`(`codTipoProjeto`),
    PRIMARY KEY (`codProjeto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `propriedade` (
    `codPropriedade` INTEGER NOT NULL AUTO_INCREMENT,
    `logradouro` VARCHAR(255) NOT NULL,
    `numero` INTEGER NOT NULL,
    `complemento` VARCHAR(255) NOT NULL,
    `cep` INTEGER NOT NULL,
    `bairro` VARCHAR(255) NOT NULL,
    `cidade` VARCHAR(255) NOT NULL,
    `uf` VARCHAR(255) NOT NULL,
    `codProdutor` INTEGER NOT NULL,
    `CodMicroBacia` INTEGER NOT NULL,

    INDEX `CodMicroBacia`(`CodMicroBacia`),
    INDEX `codProdutor`(`codProdutor`),
    PRIMARY KEY (`codPropriedade`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipo_projeto` (
    `codTipoProjeto` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `descricao` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`codTipoProjeto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `codUsuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(200) NOT NULL,
    `email` VARCHAR(200) NOT NULL,
    `senha` VARCHAR(200) NOT NULL,
    `codCBH` INTEGER NOT NULL,
    `Perfil` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `usuario_email_key`(`email`),
    INDEX `codCBH`(`codCBH`),
    PRIMARY KEY (`codUsuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `aporte` ADD CONSTRAINT `aporte_ibfk_1` FOREIGN KEY (`codInvestidor`) REFERENCES `investidor_esg`(`codInvestidor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aporte` ADD CONSTRAINT `aporte_ibfk_2` FOREIGN KEY (`codCBH`) REFERENCES `cbh`(`codCBH`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacao` ADD CONSTRAINT `avaliacao_ibfk_1` FOREIGN KEY (`codProjeto`) REFERENCES `projeto`(`codProjeto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacao` ADD CONSTRAINT `avaliacao_ibfk_2` FOREIGN KEY (`codAvaliador`) REFERENCES `avaliador_cbh`(`codAvaliador`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacao_item` ADD CONSTRAINT `avaliacao_item_ibfk_1` FOREIGN KEY (`codCriterioAval`) REFERENCES `criterio_aval`(`codCriterioAval`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliador_cbh` ADD CONSTRAINT `avaliador_cbh_ibfk_1` FOREIGN KEY (`codCBH`) REFERENCES `cbh`(`codCBH`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comite_investido` ADD CONSTRAINT `comite_investido_ibfk_1` FOREIGN KEY (`codInvestidor`) REFERENCES `investidor_esg`(`codInvestidor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comite_investido` ADD CONSTRAINT `comite_investido_ibfk_2` FOREIGN KEY (`codCBH`) REFERENCES `cbh`(`codCBH`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evidencia_apresentada` ADD CONSTRAINT `evidencia_apresentada_ibfk_1` FOREIGN KEY (`codExecucaoMarco`) REFERENCES `execucao_marco`(`codExecucaoMarco`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evidencia_apresentada` ADD CONSTRAINT `evidencia_apresentada_ibfk_2` FOREIGN KEY (`codEvidenciaDemandada`) REFERENCES `evidencia_demandada`(`codEvidenciaDemandada`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evidencia_demandada` ADD CONSTRAINT `evidencia_demandada_ibfk_1` FOREIGN KEY (`codMarcoRecomendado`) REFERENCES `marco_recomendado`(`codMarcoRecomendado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `execucao_marco` ADD CONSTRAINT `execucao_marco_ibfk_1` FOREIGN KEY (`codAvaliador`) REFERENCES `avaliador_cbh`(`codAvaliador`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `execucao_marco` ADD CONSTRAINT `execucao_marco_ibfk_2` FOREIGN KEY (`codMarcoRecomendado`) REFERENCES `marco_recomendado`(`codMarcoRecomendado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `execucao_marco` ADD CONSTRAINT `execucao_marco_ibfk_3` FOREIGN KEY (`codProjeto`) REFERENCES `projeto`(`codProjeto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `marco_recomendado` ADD CONSTRAINT `marco_recomendado_ibfk_1` FOREIGN KEY (`codTipoProjeto`) REFERENCES `tipo_projeto`(`codTipoProjeto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `microbacia` ADD CONSTRAINT `microbacia_ibfk_1` FOREIGN KEY (`CodCBH`) REFERENCES `cbh`(`codCBH`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pagto_marco_concluido` ADD CONSTRAINT `pagto_marco_concluido_ibfk_2` FOREIGN KEY (`codExecucaoMarco`) REFERENCES `execucao_marco`(`codExecucaoMarco`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pagto_marco_concluido` ADD CONSTRAINT `pagto_marco_concluido_ibfk_3` FOREIGN KEY (`codProdutor`) REFERENCES `produtor_rural`(`codProdutor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pagto_marco_concluido` ADD CONSTRAINT `pagto_marco_concluido_ibfk_4` FOREIGN KEY (`CodEntExec`) REFERENCES `entidadeexecutora`(`codEntExec`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produtor_rural` ADD CONSTRAINT `produtor_rural_ibfk_1` FOREIGN KEY (`codCBH`) REFERENCES `cbh`(`codCBH`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projeto` ADD CONSTRAINT `projeto_ibfk_1` FOREIGN KEY (`codTipoProjeto`) REFERENCES `tipo_projeto`(`codTipoProjeto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projeto` ADD CONSTRAINT `projeto_ibfk_2` FOREIGN KEY (`codPropriedade`) REFERENCES `propriedade`(`codPropriedade`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projeto` ADD CONSTRAINT `projeto_ibfk_3` FOREIGN KEY (`codProjeto`) REFERENCES `entidadeexecutora`(`codEntExec`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projeto` ADD CONSTRAINT `projeto_ibfk_4` FOREIGN KEY (`CodMicroBacia`) REFERENCES `microbacia`(`CodMicroBacia`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propriedade` ADD CONSTRAINT `propriedade_ibfk_1` FOREIGN KEY (`codProdutor`) REFERENCES `produtor_rural`(`codProdutor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propriedade` ADD CONSTRAINT `propriedade_ibfk_2` FOREIGN KEY (`CodMicroBacia`) REFERENCES `microbacia`(`CodMicroBacia`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`codCBH`) REFERENCES `cbh`(`codCBH`) ON DELETE RESTRICT ON UPDATE CASCADE;
