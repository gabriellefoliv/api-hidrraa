import prisma from '../../lib/prisma'

export const execucaoMarcoRepository = {
    findProjectForExecution: async (codProjeto: number) => {
        return prisma.projeto.findUnique({
            where: { codProjeto },
            include: {
                tipo_projeto: {
                    include: {
                        marco_recomendado: {
                            include: {
                                evidencia_demandada: true,
                                execucao_marco: {
                                    select: {
                                        codExecucaoMarco: true,
                                        codMarcoRecomendado: true,
                                        descricao: true,
                                        valorEstimado: true,
                                        dataConclusaoPrevista: true,
                                        dataConclusaoEfetiva: true,
                                        codProjeto: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })
    },

    findExecucaoMarco: async (codExecucaoMarco: number) => {
        return prisma.execucao_marco.findUnique({
            where: { codExecucaoMarco },
        })
    },

    createEvidence: async (data: { caminhoArquivo: string; codExecucaoMarco: number; codEvidenciaDemandada: number }) => {
        return prisma.evidencia_apresentada.create({
            data: {
                ...data,
                dataUpload: new Date(),
            },
        })
    },

    deleteEvidence: async (codEvidenciaApresentada: number) => {
        return prisma.evidencia_apresentada.delete({
            where: { codEvidenciaApresentada },
        })
    },

    findEvidenceById: async (codEvidenciaApresentada: number) => {
        return prisma.evidencia_apresentada.findUnique({
            where: { codEvidenciaApresentada },
        })
    },

    submitEvidences: async (codExecucaoMarco: number) => {
        return prisma.execucao_marco.update({
            where: { codExecucaoMarco },
            data: {
                dataConclusaoEfetiva: new Date(),
                bc_statusValidacaoCBH: null
            }
        })
    },

    listEvaluatedEvidences: async (codProjeto: number) => {
        return prisma.projeto.findUnique({
            where: { codProjeto },
            include: {
                execucao_marco: {
                    include: {
                        evidencia_apresentada: true,
                        relatorio_gerenciadora: true,
                        pagto_marco_concluido: true
                    }
                }
            }
        })
    },

    listEvidencesByMilestone: async (codProjeto: number, codExecucaoMarco: number) => {
        return prisma.execucao_marco.findFirst({
            where: { codProjeto, codExecucaoMarco },
            include: {
                evidencia_apresentada: true,
                relatorio_gerenciadora: true
            }
        })
    },

    findEntExecByUsuario: async (codUsuario: number) => {
        return prisma.entidadeexecutora.findFirst({
            where: { codUsuario },
        })
    },

    getPaymentsSum: async (codExecucaoMarco: number) => {
        return prisma.pagto_marco_concluido.aggregate({
            _sum: { bc_valor: true },
            where: { codExecucaoMarco },
        })
    },

    createPaymentRequest: async (data: { codExecucaoMarco: number; bc_valor: number; CodEntExec: number; servicos: any[] }) => {
        return prisma.$transaction(async tx => {
            const novaSolicitacao = await tx.pagto_marco_concluido.create({
                data: {
                    codExecucaoMarco: data.codExecucaoMarco,
                    bc_valor: data.bc_valor,
                    CodEntExec: data.CodEntExec,
                    bc_data: new Date(),
                },
                select: {
                    codPagtoMarco: true,
                    execucao_marco: { select: { codProjeto: true } },
                }
            })

            const servicosData = data.servicos.map(s => ({
                codExecucaoMarco: data.codExecucaoMarco,
                valor: s.valor,
                docNF: s.docNFPath,
                data: new Date(),
            }))

            await tx.pagto_servico.createMany({
                data: servicosData,
            })

            return {
                ...novaSolicitacao,
                codProjeto: novaSolicitacao.execucao_marco.codProjeto,
            }
        })
    },

    findProjectBudget: async (codProjeto: number) => {
        return prisma.projeto.findUnique({
            where: { codProjeto },
            select: { orcamento: true }
        })
    },

    aggregateProjectPayments: async (codProjeto: number) => {
        return prisma.pagto_marco_concluido.aggregate({
            _sum: { bc_valor: true },
            where: {
                execucao_marco: { codProjeto }
            }
        })
    }
}
