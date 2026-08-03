import {
    type CreateProdutorData,
    produtorRuralRepository,
    type UpdateProdutorData,
} from './produtor-rural.repository'

export const produtorRuralService = {
    create: async (data: CreateProdutorData) => {
        const produtor = await produtorRuralRepository.create(data)
        return { produtorRuralId: produtor.codProdutor }
    },

    update: async (data: UpdateProdutorData) => {
        const novoProdutor = await produtorRuralRepository.update(data)
        return { novoProdutor }
    },

    delete: async (codProdutor: number) => {
        await produtorRuralRepository.delete(codProdutor)
    },

    findAll: async () => {
        return produtorRuralRepository.findAll()
    },
}
