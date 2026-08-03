import prisma from '../../lib/prisma'

export const analiseEvidenciaRepository = {
    findExecutionMilestone: async (codExecucaoMarco: number) => {
        return prisma.execucao_marco.findUnique({
            where: { codExecucaoMarco },
            select: {
                dataConclusaoEfetiva: true,
                codProjeto: true
            },
        })
    },

    updateValidation: async (codExecucaoMarco: number, data: any) => {
        return prisma.execucao_marco.update({
            where: { codExecucaoMarco },
            data,
        })
    },

    listProjectsWithEvidences: async () => {
        return prisma.projeto.findMany({
            where: {
                execucao_marco: {
                    some: {
                        dataConclusaoEfetiva: { not: null },
                    },
                },
                titulo: { not: null },
                objetivo: { not: null },
                acoes: { not: null },
                cronograma: { not: null },
            },
            include: {
                tipo_projeto: {
                    include: {
                        marco_recomendado: {
                            include: {
                                execucao_marco: true,
                            },
                        },
                    },
                },
                microbacia: true,
                entidadeexecutora: true,
            },
            orderBy: {
                dataSubmissao: 'desc',
            },
        })
    },

    listCompletedMilestones: async (codProjeto: number) => {
        return prisma.execucao_marco.findMany({
            where: {
                codProjeto,
                dataConclusaoEfetiva: { not: null },
                evidencia_apresentada: { some: {} },
            },
            select: {
                codExecucaoMarco: true,
                descricao: true,
                bc_statusValidacaoCBH: true,
                dataConclusaoEfetiva: true,
                evidencia_apresentada: {
                    select: {
                        codEvidenciaApresentada: true,
                        caminhoArquivo: true,
                        dataUpload: true,
                        codEvidenciaDemandada: true,
                    },
                    orderBy: { dataUpload: 'desc' },
                },
                relatorio_gerenciadora: {
                    select: {
                        codRelGer: true,
                        caminhoArquivo: true,
                        dataUpload: true,
                    },
                    orderBy: { dataUpload: 'desc' },
                },
            },
            orderBy: {
                dataConclusaoEfetiva: 'desc',
            },
        })
    },

    findEntGerByUsuario: async (codUsuario: number) => {
        return prisma.entidade_gerenciadora.findFirst({
            where: { codUsuario }
        })
    },

    createRelatorioGerenciadora: async (data: { caminhoArquivo: string; codExecucaoMarco: number; codEntGer: number }) => {
        return prisma.relatorio_gerenciadora.create({
            data: {
                ...data,
                dataUpload: new Date()
            }
        })
    },

    getProjectWithEvaluatedMilestones: async (codProjeto: number) => {
        return prisma.projeto.findUnique({
            where: { codProjeto },
            select: {
                titulo: true,
                objetivo: true,
                acoes: true,
                cronograma: true,
                orcamento: true,
                dataSubmissao: true,
                caminhoArquivo: true,
                execucao_marco: {
                    where: {
                        dataConclusaoEfetiva: { not: null },
                        evidencia_apresentada: { some: {} },
                        relatorio_gerenciadora: { some: {} }
                    },
                    select: {
                        codExecucaoMarco: true,
                        descricao: true,
                        valorEstimado: true,
                        dataConclusaoEfetiva: true,
                        descrDetAjustes: true,
                        bc_statusValidacaoCBH: true,
                        evidencia_apresentada: {
                            select: {
                                codEvidenciaApresentada: true,
                                caminhoArquivo: true,
                                dataUpload: true,
                                codEvidenciaDemandada: true,
                            },
                            orderBy: { dataUpload: 'desc' },
                        },
                        relatorio_gerenciadora: {
                            select: {
                                codRelGer: true,
                                caminhoArquivo: true,
                                dataUpload: true,
                            },
                            orderBy: { dataUpload: 'desc' },
                        },
                    },
                    orderBy: { dataConclusaoEfetiva: 'desc' },
                }
            }
        })
    }
}
