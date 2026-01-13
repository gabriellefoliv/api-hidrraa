import prisma from '../../lib/prisma'

export const authRepository = {
    findUserByEmail: async (email: string) => {
        return prisma.usuario.findUnique({
            where: { email },
        })
    },

    findUserById: async (codUsuario: number) => {
        return prisma.usuario.findUnique({
            where: { codUsuario },
        })
    },

    createEntidadeExecutora: async (userData: any, entData: any) => {
        return prisma.$transaction(async tx => {
            const user = await tx.usuario.create({
                data: {
                    ...userData,
                    Perfil: 'entidade_executora',
                },
            })
            await tx.entidadeexecutora.create({
                data: {
                    ...entData,
                    codUsuario: user.codUsuario,
                },
            })
            return user
        })
    },

    createEntidadeGerenciadora: async (userData: any, entData: any) => {
        return prisma.$transaction(async tx => {
            const user = await tx.usuario.create({
                data: {
                    ...userData,
                    Perfil: 'ent_ger',
                },
            })
            await tx.entidade_gerenciadora.create({
                data: {
                    ...entData,
                    codUsuario: user.codUsuario,
                },
            })
            return user
        })
    },

    createInvestidor: async (userData: any, entData: any) => {
        return prisma.$transaction(async tx => {
            const user = await tx.usuario.create({
                data: {
                    ...userData,
                    Perfil: 'investidor',
                }
            })
            await tx.investidor_esg.create({
                data: {
                    ...entData,
                    codUsuario: user.codUsuario
                }
            })
            return user
        })
    },

    findAllEntExecs: async () => {
        return prisma.entidadeexecutora.findMany()
    },

    findAllEntGers: async () => {
        return prisma.entidade_gerenciadora.findMany()
    },

    findEntGerByCodUsuario: async (codUsuario: number) => {
        return prisma.entidade_gerenciadora.findFirst({
            where: { codUsuario }
        })
    },

    findInvestidorByCodUsuario: async (codUsuario: number) => {
        return prisma.investidor_esg.findFirst({
            where: { codUsuario },
            include: { usuario: true }
        })
    }
}
