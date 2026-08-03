import {
    type CreatePropriedadeData,
    propriedadeRepository,
    type UpdatePropriedadeData,
} from './propriedade.repository'

export const propriedadeService = {
    create: async (data: CreatePropriedadeData) => {
        const propriedade = await propriedadeRepository.create(data)
        return { propriedadeId: propriedade.codPropriedade }
    },

    update: async (data: UpdatePropriedadeData) => {
        const novaPropriedade = await propriedadeRepository.update(data)
        return { novaPropriedade }
    },

    delete: async (codPropriedade: number) => {
        await propriedadeRepository.delete(codPropriedade)
    },

    findAll: async () => {
        return propriedadeRepository.findAll()
    },
}
