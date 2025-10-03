-- CreateEnum
CREATE TYPE "execucao_marco_bc_statusValidacaoCBH" AS ENUM ('PENDENTE', 'APROVADO', 'REPROVADO');

-- CreateEnum
CREATE TYPE "TransacaoTipo" AS ENUM ('aporte', 'pagamento_servico', 'pagamento_marco');

-- CreateEnum
CREATE TYPE "TransacaoStatus" AS ENUM ('pendente', 'confirmada', 'falha');

-- CreateTable
CREATE TABLE "aporte" (
    "codAporte" SERIAL NOT NULL,
    "dataInvestimento" TIMESTAMP(3) NOT NULL,
    "bc_valor" DOUBLE PRECISION NOT NULL,
    "validadoAGEVAP" BOOLEAN NOT NULL DEFAULT false,
    "codInvestidor" INTEGER NOT NULL,
    "codCBH" INTEGER NOT NULL,

    CONSTRAINT "aporte_pkey" PRIMARY KEY ("codAporte")
);

-- CreateTable
CREATE TABLE "cbh" (
    "codCBH" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,

    CONSTRAINT "cbh_pkey" PRIMARY KEY ("codCBH")
);

-- CreateTable
CREATE TABLE "comite_investido" (
    "codCBH" INTEGER NOT NULL,
    "codInvestidor" INTEGER NOT NULL,

    CONSTRAINT "comite_investido_pkey" PRIMARY KEY ("codCBH","codInvestidor")
);

-- CreateTable
CREATE TABLE "entidadeexecutora" (
    "codEntExec" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "cnpjcpf" VARCHAR(255) NOT NULL,
    "especialidade" VARCHAR(255) NOT NULL,
    "contato" VARCHAR(255) NOT NULL,
    "codUsuario" INTEGER NOT NULL,

    CONSTRAINT "entidadeexecutora_pkey" PRIMARY KEY ("codEntExec")
);

-- CreateTable
CREATE TABLE "entidade_gerenciadora" (
    "codEntGer" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "cnpjcpf" VARCHAR(255) NOT NULL,
    "contato" VARCHAR(255) NOT NULL,
    "codUsuario" INTEGER NOT NULL,

    CONSTRAINT "entidade_gerenciadora_pkey" PRIMARY KEY ("codEntGer")
);

-- CreateTable
CREATE TABLE "evidencia_apresentada" (
    "codEvidenciaApresentada" SERIAL NOT NULL,
    "caminhoArquivo" VARCHAR(255) NOT NULL,
    "dataUpload" TIMESTAMP(3) NOT NULL,
    "codExecucaoMarco" INTEGER NOT NULL,
    "codEvidenciaDemandada" INTEGER NOT NULL,

    CONSTRAINT "evidencia_apresentada_pkey" PRIMARY KEY ("codEvidenciaApresentada")
);

-- CreateTable
CREATE TABLE "relatorio_gerenciadora" (
    "codRelGer" SERIAL NOT NULL,
    "caminhoArquivo" VARCHAR(255) NOT NULL,
    "dataUpload" TIMESTAMP(3) NOT NULL,
    "codExecucaoMarco" INTEGER NOT NULL,
    "codEntGer" INTEGER NOT NULL,

    CONSTRAINT "relatorio_gerenciadora_pkey" PRIMARY KEY ("codRelGer")
);

-- CreateTable
CREATE TABLE "evidencia_demandada" (
    "codEvidenciaDemandada" SERIAL NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "tipoArquivo" VARCHAR(255) NOT NULL,
    "codMarcoRecomendado" INTEGER NOT NULL,

    CONSTRAINT "evidencia_demandada_pkey" PRIMARY KEY ("codEvidenciaDemandada")
);

-- CreateTable
CREATE TABLE "execucao_marco" (
    "codExecucaoMarco" SERIAL NOT NULL,
    "descricao" VARCHAR(255),
    "descrDetAjustes" VARCHAR(255),
    "bc_statusValidacaoCBH" "execucao_marco_bc_statusValidacaoCBH",
    "codAvaliador" INTEGER,
    "codMarcoRecomendado" INTEGER NOT NULL,
    "codProjeto" INTEGER NOT NULL,
    "valorEstimado" DOUBLE PRECISION,
    "dataConclusaoEfetiva" DATE,
    "dataConclusaoPrevista" DATE,

    CONSTRAINT "execucao_marco_pkey" PRIMARY KEY ("codExecucaoMarco")
);

-- CreateTable
CREATE TABLE "investidor_esg" (
    "codInvestidor" SERIAL NOT NULL,
    "razaoSocial" VARCHAR(255) NOT NULL,
    "cnpj" VARCHAR(255) NOT NULL,
    "contato" VARCHAR(255) NOT NULL,
    "codUsuario" INTEGER NOT NULL,

    CONSTRAINT "investidor_esg_pkey" PRIMARY KEY ("codInvestidor")
);

-- CreateTable
CREATE TABLE "marco_recomendado" (
    "codMarcoRecomendado" SERIAL NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "codTipoProjeto" INTEGER NOT NULL,

    CONSTRAINT "marco_recomendado_pkey" PRIMARY KEY ("codMarcoRecomendado")
);

-- CreateTable
CREATE TABLE "microbacia" (
    "CodMicroBacia" SERIAL NOT NULL,
    "Nome" VARCHAR(200) NOT NULL,
    "CodCBH" INTEGER NOT NULL,

    CONSTRAINT "microbacia_pkey" PRIMARY KEY ("CodMicroBacia")
);

-- CreateTable
CREATE TABLE "pagto_marco_concluido" (
    "codPagtoMarco" SERIAL NOT NULL,
    "bc_data" TIMESTAMP(3) NOT NULL,
    "bc_valor" DOUBLE PRECISION NOT NULL,
    "codExecucaoMarco" INTEGER NOT NULL,
    "codProdutor" INTEGER,
    "CodEntExec" INTEGER,

    CONSTRAINT "pagto_marco_concluido_pkey" PRIMARY KEY ("codPagtoMarco")
);

-- CreateTable
CREATE TABLE "produtor_rural" (
    "codProdutor" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "cpf" VARCHAR(255) NOT NULL,
    "contato" VARCHAR(255) NOT NULL,
    "codCBH" INTEGER NOT NULL,

    CONSTRAINT "produtor_rural_pkey" PRIMARY KEY ("codProdutor")
);

-- CreateTable
CREATE TABLE "projeto" (
    "codProjeto" SERIAL NOT NULL,
    "titulo" VARCHAR(255),
    "objetivo" VARCHAR(255),
    "acoes" VARCHAR(255),
    "cronograma" VARCHAR(255),
    "orcamento" DOUBLE PRECISION,
    "codPropriedade" INTEGER,
    "codTipoProjeto" INTEGER NOT NULL,
    "CodEntExec" INTEGER,
    "codEntGer" INTEGER,
    "CodMicroBacia" INTEGER,
    "dataSubmissao" DATE,

    CONSTRAINT "projeto_pkey" PRIMARY KEY ("codProjeto")
);

-- CreateTable
CREATE TABLE "propriedade" (
    "codPropriedade" SERIAL NOT NULL,
    "logradouro" VARCHAR(255) NOT NULL,
    "numero" INTEGER NOT NULL,
    "complemento" VARCHAR(255) NOT NULL,
    "cep" VARCHAR(255) NOT NULL,
    "bairro" VARCHAR(255) NOT NULL,
    "cidade" VARCHAR(255) NOT NULL,
    "uf" VARCHAR(255) NOT NULL,
    "codProdutor" INTEGER NOT NULL,
    "CodMicroBacia" INTEGER NOT NULL,

    CONSTRAINT "propriedade_pkey" PRIMARY KEY ("codPropriedade")
);

-- CreateTable
CREATE TABLE "tipo_projeto" (
    "codTipoProjeto" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,

    CONSTRAINT "tipo_projeto_pkey" PRIMARY KEY ("codTipoProjeto")
);

-- CreateTable
CREATE TABLE "usuario" (
    "codUsuario" SERIAL NOT NULL,
    "nome" VARCHAR(200) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "senha" VARCHAR(200) NOT NULL,
    "codCBH" INTEGER NOT NULL,
    "Perfil" VARCHAR(100) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("codUsuario")
);

-- CreateTable
CREATE TABLE "fornecedor" (
    "codFornecedor" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "cnpjcpf" VARCHAR(255) NOT NULL,
    "contato" VARCHAR(255) NOT NULL,
    "especialidade" VARCHAR(255) NOT NULL,

    CONSTRAINT "fornecedor_pkey" PRIMARY KEY ("codFornecedor")
);

-- CreateTable
CREATE TABLE "pagto_servico" (
    "codPagtoServico" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "docNF" TEXT NOT NULL,
    "codFornecedor" INTEGER NOT NULL,
    "codExecucaoMarco" INTEGER NOT NULL,

    CONSTRAINT "pagto_servico_pkey" PRIMARY KEY ("codPagtoServico")
);

-- CreateTable
CREATE TABLE "transacao_blockchain" (
    "codTransacao" SERIAL NOT NULL,
    "tipo" "TransacaoTipo" NOT NULL,
    "hash" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "origemWallet" TEXT,
    "destinoWallet" TEXT,
    "status" "TransacaoStatus" NOT NULL DEFAULT 'pendente',
    "codAporte" INTEGER,
    "codPagtoServico" INTEGER,
    "codPagtoMarco" INTEGER,

    CONSTRAINT "transacao_blockchain_pkey" PRIMARY KEY ("codTransacao")
);

-- CreateIndex
CREATE INDEX "aporte_codCBH_idx" ON "aporte"("codCBH");

-- CreateIndex
CREATE INDEX "aporte_codInvestidor_idx" ON "aporte"("codInvestidor");

-- CreateIndex
CREATE INDEX "comite_investido_codCBH_idx" ON "comite_investido"("codCBH");

-- CreateIndex
CREATE INDEX "codInvestidor" ON "comite_investido"("codInvestidor");

-- CreateIndex
CREATE INDEX "entidadeexecutora_codUsuario_idx" ON "entidadeexecutora"("codUsuario");

-- CreateIndex
CREATE INDEX "entidade_gerenciadora_codUsuario_idx" ON "entidade_gerenciadora"("codUsuario");

-- CreateIndex
CREATE INDEX "codEvidenciaDemandada" ON "evidencia_apresentada"("codEvidenciaDemandada");

-- CreateIndex
CREATE INDEX "pagto_marco_concluido_codExecucaoMarco_idx" ON "evidencia_apresentada"("codExecucaoMarco");

-- CreateIndex
CREATE INDEX "evidencia_demandada_codMarcoRecomendado_idx" ON "evidencia_demandada"("codMarcoRecomendado");

-- CreateIndex
CREATE INDEX "codAvaliador" ON "execucao_marco"("codAvaliador");

-- CreateIndex
CREATE INDEX "codMarcoRecomendado" ON "execucao_marco"("codMarcoRecomendado");

-- CreateIndex
CREATE INDEX "codProjeto" ON "execucao_marco"("codProjeto");

-- CreateIndex
CREATE UNIQUE INDEX "execucao_marco_codProjeto_codMarcoRecomendado_key" ON "execucao_marco"("codProjeto", "codMarcoRecomendado");

-- CreateIndex
CREATE INDEX "codUsuario" ON "investidor_esg"("codUsuario");

-- CreateIndex
CREATE INDEX "marco_recomendado_codTipoProjeto_idx" ON "marco_recomendado"("codTipoProjeto");

-- CreateIndex
CREATE INDEX "CodCBH" ON "microbacia"("CodCBH");

-- CreateIndex
CREATE INDEX "CodEntExec" ON "pagto_marco_concluido"("CodEntExec");

-- CreateIndex
CREATE INDEX "pagto_marco_concluido_codExecucaoMarco_idx2" ON "pagto_marco_concluido"("codExecucaoMarco");

-- CreateIndex
CREATE INDEX "propriedade_codProdutor_idx" ON "pagto_marco_concluido"("codProdutor");

-- CreateIndex
CREATE INDEX "produtor_rural_codCBH_idx" ON "produtor_rural"("codCBH");

-- CreateIndex
CREATE INDEX "CodEntExecutora" ON "projeto"("CodEntExec");

-- CreateIndex
CREATE INDEX "propriedade_CodMicroBacia_idx" ON "projeto"("CodMicroBacia");

-- CreateIndex
CREATE INDEX "codPropriedade" ON "projeto"("codPropriedade");

-- CreateIndex
CREATE INDEX "codTipoProjeto" ON "projeto"("codTipoProjeto");

-- CreateIndex
CREATE INDEX "CodMicroBacia" ON "propriedade"("CodMicroBacia");

-- CreateIndex
CREATE INDEX "codProdutor" ON "propriedade"("codProdutor");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE INDEX "codCBH" ON "usuario"("codCBH");

-- CreateIndex
CREATE INDEX "codExecucaoMarco" ON "pagto_servico"("codExecucaoMarco");

-- CreateIndex
CREATE INDEX "pagto_servico_codFornecedor_fkey" ON "pagto_servico"("codFornecedor");

-- CreateIndex
CREATE INDEX "transacao_blockchain_codAporte_fkey" ON "transacao_blockchain"("codAporte");

-- CreateIndex
CREATE INDEX "transacao_blockchain_codPagtoMarco_fkey" ON "transacao_blockchain"("codPagtoMarco");

-- CreateIndex
CREATE INDEX "transacao_blockchain_codPagtoServico_fkey" ON "transacao_blockchain"("codPagtoServico");

-- AddForeignKey
ALTER TABLE "aporte" ADD CONSTRAINT "aporte_ibfk_1" FOREIGN KEY ("codInvestidor") REFERENCES "investidor_esg"("codInvestidor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aporte" ADD CONSTRAINT "aporte_ibfk_2" FOREIGN KEY ("codCBH") REFERENCES "cbh"("codCBH") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comite_investido" ADD CONSTRAINT "comite_investido_ibfk_1" FOREIGN KEY ("codInvestidor") REFERENCES "investidor_esg"("codInvestidor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comite_investido" ADD CONSTRAINT "comite_investido_ibfk_2" FOREIGN KEY ("codCBH") REFERENCES "cbh"("codCBH") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entidadeexecutora" ADD CONSTRAINT "entidadeexecutora_ibfk_1" FOREIGN KEY ("codUsuario") REFERENCES "usuario"("codUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entidade_gerenciadora" ADD CONSTRAINT "entidadegerenciadora_ibfk_1" FOREIGN KEY ("codUsuario") REFERENCES "usuario"("codUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidencia_apresentada" ADD CONSTRAINT "evidencia_apresentada_ibfk_1" FOREIGN KEY ("codExecucaoMarco") REFERENCES "execucao_marco"("codExecucaoMarco") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidencia_apresentada" ADD CONSTRAINT "evidencia_apresentada_ibfk_2" FOREIGN KEY ("codEvidenciaDemandada") REFERENCES "evidencia_demandada"("codEvidenciaDemandada") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_gerenciadora" ADD CONSTRAINT "relatorio_gerenciadora_ibfk_1" FOREIGN KEY ("codExecucaoMarco") REFERENCES "execucao_marco"("codExecucaoMarco") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_gerenciadora" ADD CONSTRAINT "relatorio_gerenciadora_ibfk_2" FOREIGN KEY ("codEntGer") REFERENCES "entidade_gerenciadora"("codEntGer") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidencia_demandada" ADD CONSTRAINT "evidencia_demandada_ibfk_1" FOREIGN KEY ("codMarcoRecomendado") REFERENCES "marco_recomendado"("codMarcoRecomendado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "execucao_marco" ADD CONSTRAINT "execucao_marco_ibfk_2" FOREIGN KEY ("codMarcoRecomendado") REFERENCES "marco_recomendado"("codMarcoRecomendado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "execucao_marco" ADD CONSTRAINT "execucao_marco_ibfk_3" FOREIGN KEY ("codProjeto") REFERENCES "projeto"("codProjeto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investidor_esg" ADD CONSTRAINT "investidor_esg_ibfk_1" FOREIGN KEY ("codUsuario") REFERENCES "usuario"("codUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marco_recomendado" ADD CONSTRAINT "marco_recomendado_ibfk_1" FOREIGN KEY ("codTipoProjeto") REFERENCES "tipo_projeto"("codTipoProjeto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "microbacia" ADD CONSTRAINT "microbacia_ibfk_1" FOREIGN KEY ("CodCBH") REFERENCES "cbh"("codCBH") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagto_marco_concluido" ADD CONSTRAINT "pagto_marco_concluido_ibfk_2" FOREIGN KEY ("codExecucaoMarco") REFERENCES "execucao_marco"("codExecucaoMarco") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagto_marco_concluido" ADD CONSTRAINT "pagto_marco_concluido_ibfk_3" FOREIGN KEY ("codProdutor") REFERENCES "produtor_rural"("codProdutor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagto_marco_concluido" ADD CONSTRAINT "pagto_marco_concluido_ibfk_4" FOREIGN KEY ("CodEntExec") REFERENCES "entidadeexecutora"("codEntExec") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtor_rural" ADD CONSTRAINT "produtor_rural_ibfk_1" FOREIGN KEY ("codCBH") REFERENCES "cbh"("codCBH") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto" ADD CONSTRAINT "projeto_ibfk_1" FOREIGN KEY ("codTipoProjeto") REFERENCES "tipo_projeto"("codTipoProjeto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto" ADD CONSTRAINT "projeto_ibfk_2" FOREIGN KEY ("codPropriedade") REFERENCES "propriedade"("codPropriedade") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto" ADD CONSTRAINT "projeto_ibfk_4" FOREIGN KEY ("CodMicroBacia") REFERENCES "microbacia"("CodMicroBacia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto" ADD CONSTRAINT "projeto_ibfk_5" FOREIGN KEY ("CodEntExec") REFERENCES "entidadeexecutora"("codEntExec") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto" ADD CONSTRAINT "projeto_ibfk_6" FOREIGN KEY ("codEntGer") REFERENCES "entidade_gerenciadora"("codEntGer") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propriedade" ADD CONSTRAINT "propriedade_ibfk_1" FOREIGN KEY ("codProdutor") REFERENCES "produtor_rural"("codProdutor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propriedade" ADD CONSTRAINT "propriedade_ibfk_2" FOREIGN KEY ("CodMicroBacia") REFERENCES "microbacia"("CodMicroBacia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_ibfk_1" FOREIGN KEY ("codCBH") REFERENCES "cbh"("codCBH") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagto_servico" ADD CONSTRAINT "pagto_servico_codFornecedor_fkey2" FOREIGN KEY ("codFornecedor") REFERENCES "fornecedor"("codFornecedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagto_servico" ADD CONSTRAINT "pagto_servico_ibfk_1" FOREIGN KEY ("codExecucaoMarco") REFERENCES "execucao_marco"("codExecucaoMarco") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacao_blockchain" ADD CONSTRAINT "transacao_blockchain_codAporte_fkey1" FOREIGN KEY ("codAporte") REFERENCES "aporte"("codAporte") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacao_blockchain" ADD CONSTRAINT "transacao_blockchain_codPagtoMarco_fkey2" FOREIGN KEY ("codPagtoMarco") REFERENCES "pagto_marco_concluido"("codPagtoMarco") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacao_blockchain" ADD CONSTRAINT "transacao_blockchain_codPagtoServico_fkey3" FOREIGN KEY ("codPagtoServico") REFERENCES "pagto_servico"("codPagtoServico") ON DELETE SET NULL ON UPDATE CASCADE;
