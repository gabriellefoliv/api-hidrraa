import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { criarCriterio } from '../../../functions/membro-comite/avaliacao/criar-criterio'

export const criarCriterioRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/avaliacao/criterio',
    {
      schema: {
        summary: 'Criar Critério de Avaliação',
        tags: ['Avaliação'],
        body: z.object({
          descricao: z.string().min(1),
          peso: z.number().min(1),
        }),
        response: {
          201: z.object({
            codCriterioAval: z.number(),
            descricao: z.string(),
            peso: z.number(),
          }),
          409: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { descricao, peso } = request.body
        const novoCriterio = await criarCriterio({ descricao, peso })
        return reply.status(201).send(novoCriterio)
      } catch (error) {
        if (error instanceof Error && error.message === 'Critério já existe.') {
          return reply.status(409).send({ error: error.message })
        }

        return reply
          .status(500)
          .send({ error: 'Erro ao criar critério de avaliação.' })
      }
    }
  )
}
