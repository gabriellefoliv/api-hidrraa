import prisma from '../../lib/prisma'

export interface FindProjetosAprovadosFilters {
    CodEntExec?: number
    codEntGer?: number
}

export const projetoRepository = {
    findAprovados: async (filters: FindProjetosAprovadosFilters) => {
        const whereClause: any = {
            dataSubmissao: { not: null },
            titulo: { not: null },
            objetivo: { not: null },
            acoes: { not: null },
            cronograma: { not: null },
            ...filters,
        }

        return prisma.projeto.findMany({
            where: whereClause,
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
                entidade_gerenciadora: true,
            },
            orderBy: {
                dataSubmissao: 'desc',
            },
        })
    },

    create: async (data: any) => {
        return prisma.projeto.create({ data })
    },

    update: async (codProjeto: number, data: any) => {
        return prisma.projeto.update({
            where: { codProjeto },
            data,
        })
    },

    findById: async (codProjeto: number) => {
        return prisma.projeto.findUnique({
            where: { codProjeto },
            include: {
                tipo_projeto: true,
                microbacia: true,
                entidadeexecutora: true,
                entidade_gerenciadora: true,
            },
        })
    },

    delete: async (codProjeto: number) => {
        return prisma.projeto.delete({
            where: { codProjeto },
        })
    },

    findSubmetidosPorEntExec: async () => {
        return prisma.projeto.findMany({
            where: { dataSubmissao: { not: null } },
            include: {
                entidadeexecutora: true,
                entidade_gerenciadora: true,
                tipo_projeto: true,
                microbacia: true
            },
            orderBy: { dataSubmissao: 'desc' }
        })
    },

    findSalvosPorEntExec: async () => {
        return prisma.projeto.findMany({
            where: { dataSubmissao: null },
            include: {
                entidadeexecutora: true,
                tipo_projeto: true,
                microbacia: true
            }
        })
    },

    findTipoProjetoById: async (codTipoProjeto: number) => {
        return prisma.tipo_projeto.findUnique({
            where: { codTipoProjeto },
            include: {
                marco_recomendado: {
                    include: { evidencia_demandada: true }
                }
            }
        })
    },

    findAllTiposProjeto: async () => {
        return prisma.tipo_projeto.findMany({
            include: {
                marco_recomendado: {
                    include: { evidencia_demandada: true }
                }
            }
        })
    },

    findWithSubmissaoCheck: async (codProjeto: number) => {
        return prisma.projeto.findUnique({
            where: { codProjeto, dataSubmissao: { not: null } }
        })
    },

    getProjectBalance: async (codProjeto: number) => {
        const alocacoes = await prisma.alocacao_recurso.aggregate({
            _sum: { valor: true },
            where: { codProjeto }
        })

        const pagamentos = await prisma.pagto_marco_concluido.aggregate({
            _sum: { bc_valor: true },
            where: {
                execucao_marco: {
                    codProjeto: codProjeto
                }
            }
        })

        return {
            totalAlocado: alocacoes._sum.valor ?? 0,
            totalGasto: pagamentos._sum.bc_valor ?? 0
        }
    }
}
