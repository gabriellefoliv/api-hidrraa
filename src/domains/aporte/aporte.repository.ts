import prisma from '../../lib/prisma'

export const aporteRepository = {
    create: async (data: { codInvestidor: number; codCBH: number; bc_valor: number }) => {
        return prisma.aporte.create({
            data: {
                ...data,
                dataInvestimento: new Date(),
                validadoAGEVAP: false,
            },
        })
    },

    findAllByInvestidor: async (codInvestidor: number) => {
        return prisma.aporte.findMany({
            where: { codInvestidor },
            include: { transacoes: true },
            orderBy: { dataInvestimento: 'desc' },
        })
    },

    findAll: async () => {
        return prisma.aporte.findMany({
            include: {
                investidor_esg: {
                    select: { razaoSocial: true },
                },
            },
            orderBy: { dataInvestimento: 'desc' },
        })
    },

    findByIdWithTraceability: async (codAporte: number) => {
        return prisma.aporte.findUnique({
            where: { codAporte },
            include: {
                transacoes: {
                    where: { tipo: 'aporte' },
                    take: 1,
                },
                alocacoes: {
                    include: {
                        projeto: {
                            include: {
                                execucao_marco: {
                                    include: {
                                        pagto_marco_concluido: {
                                            include: {
                                                transacoes: {
                                                    where: { tipo: 'pagamento_marco' },
                                                    take: 1
                                                },
                                                execucao_marco: {
                                                    include: {
                                                        marco_recomendado: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    },

    validate: async (codAporte: number) => {
        return prisma.aporte.update({
            where: { codAporte },
            data: { validadoAGEVAP: true },
        })
    },

    findInvestidorByUsuario: async (codUsuario: number) => {
        return prisma.investidor_esg.findFirst({
            where: { codUsuario },
        })
    },

    findUsuarioById: async (codUsuario: number) => {
        return prisma.usuario.findUnique({
            where: { codUsuario }
        })
    },

    updateSerialNumber: async (codAporte: number, serialNumber: number) => {
        return prisma.aporte.update({
            where: { codAporte },
            data: { serialNumber: Number(serialNumber) } as any
        })
    }
}
