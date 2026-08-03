import {
    type CreateMicrobaciaData,
    microbaciaRepository,
    type UpdateMicrobaciaData,
} from './microbacia.repository'

export const microbaciaService = {
    create: async (data: CreateMicrobaciaData) => {
        const microbacia = await microbaciaRepository.create(data)
        return { microbaciaId: microbacia.CodMicroBacia }
    },

    update: async (data: UpdateMicrobaciaData) => {
        const novaMicrobacia = await microbaciaRepository.update(data)
        return { novaMicrobacia }
    },

    delete: async (CodMicroBacia: number) => {
        await microbaciaRepository.delete(CodMicroBacia)
    },

    findAll: async () => {
        return microbaciaRepository.findAll()
    },
}
