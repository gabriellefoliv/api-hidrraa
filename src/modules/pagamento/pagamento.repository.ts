import prisma from '../../lib/prisma'

export const pagamentoRepository = {
    findPaymentById: async (codPagtoMarco: number) => {
        return prisma.pagto_marco_concluido.findUnique({
            where: { codPagtoMarco },
            include: {
                execucao_marco: {
                    include: { projeto: true }
                }
            }
        })
    },

    listAvailableAportes: async () => {
        return prisma.aporte.findMany({
            where: { validadoAGEVAP: true },
            orderBy: { dataInvestimento: 'asc' },
            include: { alocacoes: true }
        })
    },

    createAllocationsAndTransaction: async (
        allocations: { codAporte: number; codProjeto: number; valor: number; txHash: string }[],
        transactionData: { hash: string; valor: number; data: Date; codPagtoMarco: number }
    ) => {
        return prisma.$transaction(async (tx) => {
            for (const aloc of allocations) {
                await tx.alocacao_recurso.create({
                    data: {
                        codAporte: aloc.codAporte,
                        codProjeto: aloc.codProjeto,
                        valor: aloc.valor,
                        data: new Date(),
                        txHash: aloc.txHash
                    }
                })
            }

            return tx.transacao_blockchain.create({
                data: {
                    tipo: 'pagamento_marco',
                    hash: transactionData.hash,
                    valor: transactionData.valor,
                    data: transactionData.data,
                    status: 'confirmada',
                    codPagtoMarco: transactionData.codPagtoMarco
                }
            })
        })
    },

    createSimpleTransaction: async (data: any) => {
        return prisma.transacao_blockchain.create({ data })
    },

    getAporteBalances: async () => {
        return prisma.aporte.findMany({
            include: {
                alocacoes: true,
                investidor_esg: true,
            },
            where: { validadoAGEVAP: true }
        })
    },

    listProjectsWithRequests: async () => {
        const projects = await prisma.projeto.findMany({
            where: {
                dataSubmissao: { not: null },
                execucao_marco: {
                    some: {
                        pagto_marco_concluido: {
                            some: {}
                        }
                    }
                }
            },
            include: {
                tipo_projeto: {
                    include: {
                        marco_recomendado: {
                            include: { execucao_marco: true }
                        }
                    }
                },
                microbacia: true,
                entidadeexecutora: true,
                execucao_marco: {
                    include: {
                        pagto_marco_concluido: {
                            include: { transacoes: true }
                        }
                    }
                }
            }
        })

        return projects
    },

    listEvidencesWithRequests: async (codProjeto: number) => {
        return prisma.projeto.findUnique({
            where: { codProjeto },
            include: {
                execucao_marco: {
                    include: {
                        evidencia_apresentada: true,
                        relatorio_gerenciadora: true,
                        pagto_marco_concluido: {
                            include: { transacoes: true }
                        },
                        pagto_servico: true
                    }
                }
            }
        })
    },

    findPaymentTransactionByHash: async (hash: string) => {
        return prisma.transacao_blockchain.findFirst({
            where: { hash }
        })
    }
}
