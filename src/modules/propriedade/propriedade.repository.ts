import prisma from '../../lib/prisma'

export interface CreatePropriedadeData {
    logradouro: string
    numero: number
    complemento: string
    cep: string
    bairro: string
    cidade: string
    uf: string
    codProdutor: number
    CodMicroBacia: number
}

export interface UpdatePropriedadeData {
    codPropriedade: number
    logradouro: string
    numero: number
    complemento: string
    cep: string
    bairro: string
    cidade: string
    uf: string
    codProdutor: number
    CodMicroBacia: number
}

export const propriedadeRepository = {
    create: async (data: CreatePropriedadeData) => {
        return prisma.propriedade.create({
            data,
        })
    },

    update: async ({ codPropriedade, ...data }: UpdatePropriedadeData) => {
        return prisma.propriedade.update({
            where: { codPropriedade },
            data,
        })
    },

    delete: async (codPropriedade: number) => {
        return prisma.propriedade.delete({
            where: { codPropriedade },
        })
    },

    findAll: async () => {
        return prisma.propriedade.findMany()
    },
}
