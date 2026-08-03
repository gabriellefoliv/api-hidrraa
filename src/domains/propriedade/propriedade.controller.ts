import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { propriedadeSchemas } from './propriedade.schema'
import { propriedadeService } from './propriedade.service'

export const propriedadeController: FastifyPluginAsyncZod = async app => {
}

export const createPropriedadeHandler = async (request: any, reply: any) => {
    const result = await propriedadeService.create(request.body)
    return reply.status(201).send(result)
}

export const updatePropriedadeHandler = async (request: any, reply: any) => {
    const { codPropriedade } = request.params
    const result = await propriedadeService.update({
        codPropriedade,
        ...request.body,
    })
    return reply.status(201).send({ propriedade: result.novaPropriedade })
}

export const deletePropriedadeHandler = async (request: any, reply: any) => {
    const { codPropriedade } = request.params
    await propriedadeService.delete(codPropriedade)
    return reply
        .status(201)
        .send({ message: 'Propriedade deletada com sucesso!' })
}

export const listPropriedadesHandler = async (request: any, reply: any) => {
    const propriedades = await propriedadeService.findAll()
    return reply.status(201).send(propriedades)
}
