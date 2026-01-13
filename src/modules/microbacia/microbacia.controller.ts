import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { microbaciaSchemas } from './microbacia.schema'
import { microbaciaService } from './microbacia.service'

export const microbaciaController: FastifyPluginAsyncZod = async app => {
}

export const createMicrobaciaHandler = async (request: any, reply: any) => {
    const { Nome, CodCBH } = request.body
    const result = await microbaciaService.create({ Nome, CodCBH })
    return reply.status(201).send(result)
}

export const updateMicrobaciaHandler = async (request: any, reply: any) => {
    const { CodMicroBacia } = request.params
    const { Nome, CodCBH } = request.body
    const result = await microbaciaService.update({ CodMicroBacia, Nome, CodCBH })
    return reply.status(201).send({ microbacia: result.novaMicrobacia })
}

export const deleteMicrobaciaHandler = async (request: any, reply: any) => {
    const { CodMicroBacia } = request.params
    await microbaciaService.delete(CodMicroBacia)
    return reply.status(201).send({ message: 'Microbacia deletada com sucesso!' })
}

export const listMicrobaciasHandler = async (request: any, reply: any) => {
    const microbacias = await microbaciaService.findAll()
    return reply.status(201).send(microbacias)
}
