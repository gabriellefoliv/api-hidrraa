import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { produtorRuralSchemas } from './produtor-rural.schema'
import { produtorRuralService } from './produtor-rural.service'

export const produtorRuralController: FastifyPluginAsyncZod = async app => {
}

export const createProdutorHandler = async (request: any, reply: any) => {
    const { nome, cpf, contato, codCBH } = request.body
    const result = await produtorRuralService.create({
        nome,
        cpf,
        contato,
        codCBH,
    })
    return reply.status(201).send(result)
}

export const updateProdutorHandler = async (request: any, reply: any) => {
    const { codProdutor } = request.params
    const { nome, cpf, contato, codCBH } = request.body
    const result = await produtorRuralService.update({
        codProdutor,
        nome,
        cpf,
        contato,
        codCBH,
    })
    return reply.status(201).send({ produtor: result.novoProdutor })
}

export const deleteProdutorHandler = async (request: any, reply: any) => {
    const { codProdutor } = request.params
    await produtorRuralService.delete(codProdutor)
    return reply
        .status(201)
        .send({ message: 'Produtor Rural deletado com sucesso!' })
}

export const listProdutoresHandler = async (request: any, reply: any) => {
    const produtores = await produtorRuralService.findAll()
    return reply.status(201).send(produtores)
}
