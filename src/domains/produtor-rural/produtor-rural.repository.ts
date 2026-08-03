import prisma from '../../lib/prisma'

export interface CreateProdutorData {
    nome: string
    cpf: string
    contato: string
    codCBH: number
}

export interface UpdateProdutorData {
    codProdutor: number
    nome: string
    cpf: string
    contato: string
    codCBH: number
}

export const produtorRuralRepository = {
    create: async (data: CreateProdutorData) => {
        return prisma.produtor_rural.create({
            data,
        })
    },

    update: async ({ codProdutor, ...data }: UpdateProdutorData) => {
        return prisma.produtor_rural.update({
            where: { codProdutor },
            data,
        })
    },

    delete: async (codProdutor: number) => {
        return prisma.produtor_rural.delete({
            where: { codProdutor },
        })
    },

    findAll: async () => {
        return prisma.produtor_rural.findMany()
    },
}
