-- CreateTable
CREATE TABLE `aporte` (
    `codAporte` INTEGER NOT NULL AUTO_INCREMENT,
    `dataInvestimento` DATETIME(3) NOT NULL,
    `bc_valor` DOUBLE NOT NULL,
    `validadoAGEVAP` BOOLEAN NOT NULL DEFAULT false,
    `codInvestidor` INTEGER NOT NULL,
    `codCBH` INTEGER NOT NULL,

    INDEX `aporte_codCBH_idx`(`codCBH`),
    INDEX `aporte_codInvestidor_idx`(`codInvestidor`),
    PRIMARY KEY (`codAporte`)
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

    INDEX `comite_investido_codCBH_idx`(`codCBH`),
    INDEX `codInvestidor`(`codInvestidor`),
    PRIMARY KEY (`codCBH`, `codInvestidor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entidadeexecutora` (
    `codEntExec` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `cnpjcpf` VARCHAR(255) NOT NULL,
    `especialidade` VARCHAR(255) NOT NULL,
    `contato` VARCHAR(255) NOT NULL,
    `codUsuario` INTEGER NOT NULL,

    INDEX `entidadeexecutora_codUsuario_idx`(`codUsuario`),
    PRIMARY KEY (`codEntExec`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entidade_gerenciadora` (
    `codEntGer` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `cnpjcpf` VARCHAR(255) NOT NULL,
    `contato` VARCHAR(255) NOT NULL,
    `codUsuario` INTEGER NOT NULL,

    INDEX `entidade_gerenciadora_codUsuario_idx`(`codUsuario`),
    PRIMARY KEY (`codEntGer`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evidencia_apresentada` (
    `codEvidenciaApresentada` INTEGER NOT NULL AUTO_INCREMENT,
    `caminhoArquivo` VARCHAR(255) NOT NULL,
    `dataUpload` DATETIME(3) NOT NULL,
    `codExecucaoMarco` INTEGER NOT NULL,
    `codEvidenciaDemandada` INTEGER NOT NULL,

    INDEX `codEvidenciaDemandada`(`codEvidenciaDemandada`),
    INDEX `pagto_marco_concluido_codExecucaoMarco_idx`(`codExecucaoMarco`),
    PRIMARY KEY (`codEvidenciaApresentada`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `relatorio_gerenciadora` (
    `codRelGer` INTEGER NOT NULL AUTO_INCREMENT,
    `caminhoArquivo` VARCHAR(255) NOT NULL,
    `dataUpload` DATETIME(3) NOT NULL,
    `codExecucaoMarco` INTEGER NOT NULL,
    `codEntGer` INTEGER NOT NULL,

    PRIMARY KEY (`codRelGer`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evidencia_demandada` (
    `codEvidenciaDemandada` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(255) NOT NULL,
    `tipoArquivo` VARCHAR(255) NOT NULL,
    `codMarcoRecomendado` INTEGER NOT NULL,

    INDEX `evidencia_demandada_codMarcoRecomendado_idx`(`codMarcoRecomendado`),
    PRIMARY KEY (`codEvidenciaDemandada`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `execucao_marco` (
    `codExecucaoMarco` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(255) NULL,
    `descrDetAjustes` VARCHAR(255) NULL,
    `bc_statusValidacaoCBH` ENUM('PENDENTE', 'APROVADO', 'REPROVADO') NULL,
    `codAvaliador` INTEGER NULL,
    `codMarcoRecomendado` INTEGER NOT NULL,
    `codProjeto` INTEGER NOT NULL,
    `valorEstimado` DOUBLE NULL,
    `dataConclusaoEfetiva` DATE NULL,
    `dataConclusaoPrevista` DATE NULL,

    INDEX `codAvaliador`(`codAvaliador`),
    INDEX `codMarcoRecomendado`(`codMarcoRecomendado`),
    INDEX `codProjeto`(`codProjeto`),
    UNIQUE INDEX `execucao_marco_codProjeto_codMarcoRecomendado_key`(`codProjeto`, `codMarcoRecomendado`),
    PRIMARY KEY (`codExecucaoMarco`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `investidor_esg` (
    `codInvestidor` INTEGER NOT NULL AUTO_INCREMENT,
    `razaoSocial` VARCHAR(255) NOT NULL,
    `cnpj` VARCHAR(255) NOT NULL,
    `contato` VARCHAR(255) NOT NULL,
    `codUsuario` INTEGER NOT NULL,

    INDEX `codUsuario`(`codUsuario`),
    PRIMARY KEY (`codInvestidor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `marco_recomendado` (
    `codMarcoRecomendado` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(255) NOT NULL,
    `codTipoProjeto` INTEGER NOT NULL,

    INDEX `marco_recomendado_codTipoProjeto_idx`(`codTipoProjeto`),
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
    `bc_data` DATETIME(3) NOT NULL,
    `bc_valor` DOUBLE NOT NULL,
    `codExecucaoMarco` INTEGER NOT NULL,
    `codProdutor` INTEGER NULL,
    `CodEntExec` INTEGER NULL,

    INDEX `CodEntExec`(`CodEntExec`),
    INDEX `pagto_marco_concluido_codExecucaoMarco_idx2`(`codExecucaoMarco`),
    INDEX `propriedade_codProdutor_idx`(`codProdutor`),
    PRIMARY KEY (`codPagtoMarco`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produtor_rural` (
    `codProdutor` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `cpf` VARCHAR(255) NOT NULL,
    `contato` VARCHAR(255) NOT NULL,
    `codCBH` INTEGER NOT NULL,

    INDEX `produtor_rural_codCBH_idx`(`codCBH`),
    PRIMARY KEY (`codProdutor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projeto` (
    `codProjeto` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(255) NULL,
    `objetivo` VARCHAR(255) NULL,
    `acoes` VARCHAR(255) NULL,
    `cronograma` VARCHAR(255) NULL,
    `orcamento` DOUBLE NULL,
    `codPropriedade` INTEGER NULL,
    `codTipoProjeto` INTEGER NOT NULL,
    `CodEntExec` INTEGER NULL,
    `codEntGer` INTEGER NULL,
    `CodMicroBacia` INTEGER NULL,
    `dataSubmissao` DATE NULL,

    INDEX `CodEntExecutora`(`CodEntExec`),
    INDEX `propriedade_CodMicroBacia_idx`(`CodMicroBacia`),
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
    `cep` VARCHAR(255) NOT NULL,
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

-- CreateTable
CREATE TABLE `fornecedor` (
    `codFornecedor` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `cnpjcpf` VARCHAR(255) NOT NULL,
    `contato` VARCHAR(255) NOT NULL,
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

    INDEX `codExecucaoMarco`(`codExecucaoMarco`),
    INDEX `pagto_servico_codFornecedor_fkey`(`codFornecedor`),
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

    INDEX `transacao_blockchain_codAporte_fkey`(`codAporte`),
    INDEX `transacao_blockchain_codPagtoMarco_fkey`(`codPagtoMarco`),
    INDEX `transacao_blockchain_codPagtoServico_fkey`(`codPagtoServico`),
    PRIMARY KEY (`codTransacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `aporte` ADD CONSTRAINT `aporte_ibfk_1` FOREIGN KEY (`codInvestidor`) REFERENCES `investidor_esg`(`codInvestidor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aporte` ADD CONSTRAINT `aporte_ibfk_2` FOREIGN KEY (`codCBH`) REFERENCES `cbh`(`codCBH`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comite_investido` ADD CONSTRAINT `comite_investido_ibfk_1` FOREIGN KEY (`codInvestidor`) REFERENCES `investidor_esg`(`codInvestidor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comite_investido` ADD CONSTRAINT `comite_investido_ibfk_2` FOREIGN KEY (`codCBH`) REFERENCES `cbh`(`codCBH`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entidadeexecutora` ADD CONSTRAINT `entidadeexecutora_ibfk_1` FOREIGN KEY (`codUsuario`) REFERENCES `usuario`(`codUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entidade_gerenciadora` ADD CONSTRAINT `entidadegerenciadora_ibfk_1` FOREIGN KEY (`codUsuario`) REFERENCES `usuario`(`codUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evidencia_apresentada` ADD CONSTRAINT `evidencia_apresentada_ibfk_1` FOREIGN KEY (`codExecucaoMarco`) REFERENCES `execucao_marco`(`codExecucaoMarco`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evidencia_apresentada` ADD CONSTRAINT `evidencia_apresentada_ibfk_2` FOREIGN KEY (`codEvidenciaDemandada`) REFERENCES `evidencia_demandada`(`codEvidenciaDemandada`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `relatorio_gerenciadora` ADD CONSTRAINT `relatorio_gerenciadora_ibfk_1` FOREIGN KEY (`codExecucaoMarco`) REFERENCES `execucao_marco`(`codExecucaoMarco`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `relatorio_gerenciadora` ADD CONSTRAINT `relatorio_gerenciadora_ibfk_2` FOREIGN KEY (`codEntGer`) REFERENCES `entidade_gerenciadora`(`codEntGer`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evidencia_demandada` ADD CONSTRAINT `evidencia_demandada_ibfk_1` FOREIGN KEY (`codMarcoRecomendado`) REFERENCES `marco_recomendado`(`codMarcoRecomendado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `execucao_marco` ADD CONSTRAINT `execucao_marco_ibfk_2` FOREIGN KEY (`codMarcoRecomendado`) REFERENCES `marco_recomendado`(`codMarcoRecomendado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `execucao_marco` ADD CONSTRAINT `execucao_marco_ibfk_3` FOREIGN KEY (`codProjeto`) REFERENCES `projeto`(`codProjeto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `investidor_esg` ADD CONSTRAINT `investidor_esg_ibfk_1` FOREIGN KEY (`codUsuario`) REFERENCES `usuario`(`codUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE `projeto` ADD CONSTRAINT `projeto_ibfk_4` FOREIGN KEY (`CodMicroBacia`) REFERENCES `microbacia`(`CodMicroBacia`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projeto` ADD CONSTRAINT `projeto_ibfk_5` FOREIGN KEY (`CodEntExec`) REFERENCES `entidadeexecutora`(`codEntExec`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projeto` ADD CONSTRAINT `projeto_ibfk_6` FOREIGN KEY (`codEntGer`) REFERENCES `entidade_gerenciadora`(`codEntGer`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propriedade` ADD CONSTRAINT `propriedade_ibfk_1` FOREIGN KEY (`codProdutor`) REFERENCES `produtor_rural`(`codProdutor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propriedade` ADD CONSTRAINT `propriedade_ibfk_2` FOREIGN KEY (`CodMicroBacia`) REFERENCES `microbacia`(`CodMicroBacia`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`codCBH`) REFERENCES `cbh`(`codCBH`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pagto_servico` ADD CONSTRAINT `pagto_servico_codFornecedor_fkey2` FOREIGN KEY (`codFornecedor`) REFERENCES `fornecedor`(`codFornecedor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pagto_servico` ADD CONSTRAINT `pagto_servico_ibfk_1` FOREIGN KEY (`codExecucaoMarco`) REFERENCES `execucao_marco`(`codExecucaoMarco`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transacao_blockchain` ADD CONSTRAINT `transacao_blockchain_codAporte_fkey1` FOREIGN KEY (`codAporte`) REFERENCES `aporte`(`codAporte`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transacao_blockchain` ADD CONSTRAINT `transacao_blockchain_codPagtoMarco_fkey2` FOREIGN KEY (`codPagtoMarco`) REFERENCES `pagto_marco_concluido`(`codPagtoMarco`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transacao_blockchain` ADD CONSTRAINT `transacao_blockchain_codPagtoServico_fkey3` FOREIGN KEY (`codPagtoServico`) REFERENCES `pagto_servico`(`codPagtoServico`) ON DELETE SET NULL ON UPDATE CASCADE;
