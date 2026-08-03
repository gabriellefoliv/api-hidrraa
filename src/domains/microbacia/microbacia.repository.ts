import prisma from '../../lib/prisma'

export interface CreateMicrobaciaData {
    Nome: string
    CodCBH: number
}

export interface UpdateMicrobaciaData {
    CodMicroBacia: number
    Nome: string
    CodCBH: number
}

export const microbaciaRepository = {
    create: async (data: CreateMicrobaciaData) => {
        return prisma.microbacia.create({
            data,
        })
    },

    update: async ({ CodMicroBacia, ...data }: UpdateMicrobaciaData) => {
        return prisma.microbacia.update({
            where: { CodMicroBacia },
            data,
        })
    },

    delete: async (CodMicroBacia: number) => {
        return prisma.microbacia.delete({
            where: { CodMicroBacia },
        })
    },

    findAll: async () => {
        return prisma.microbacia.findMany()
    },
}
