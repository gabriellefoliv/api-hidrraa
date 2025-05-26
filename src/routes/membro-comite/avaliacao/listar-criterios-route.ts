import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarCriterios } from '../../../functions/membro-comite/avaliacao/listar-criterios'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const listarCriteriosRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/api/avaliacoes/criterios',
    {
      preHandler: verificarPermissao(Perfil.MEMBRO_COMITE),

      schema: {
        summary: 'Listar Critérios de Avaliação',
        tags: ['Avaliação'],
        response: {
          200: z.array(
            z.object({
              codCriterioAval: z.number(),
              descricao: z.string(),
              peso: z.number(),
            })
          ),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (_request, reply) => {
      try {
        const criterios = await listarCriterios()
        return reply.status(200).send(criterios)
      } catch (error) {
        return reply
          .status(500)
          .send({ error: 'Erro ao buscar critérios de avaliação.' })
      }
    }
  )
}
