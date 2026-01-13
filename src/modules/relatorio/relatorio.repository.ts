import prisma from '../../lib/prisma'

export const relatorioRepository = {
    findExecutionMilestone: async (codExecucaoMarco: number) => {
        return prisma.execucao_marco.findUnique({
            where: { codExecucaoMarco },
            select: { dataConclusaoEfetiva: true },
        })
    },

    createReport: async (data: { codExecucaoMarco: number; caminhoArquivo: string; codEntGer: number }) => {
        return prisma.relatorio_gerenciadora.create({
            data: {
                ...data,
                dataUpload: new Date(),
            },
        })
    },

    listSubmittedEvidences: async (codProjeto: number, codExecucaoMarco: number) => {
        return prisma.execucao_marco.findMany({
            where: {
                codProjeto,
                codExecucaoMarco,
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
                },
            },
            orderBy: { dataConclusaoEfetiva: 'desc' },
        })
    }
}
