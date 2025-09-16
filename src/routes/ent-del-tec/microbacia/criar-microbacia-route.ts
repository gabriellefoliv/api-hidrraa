import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { criarMicrobacia } from '../../../functions/ent-del-tec/microbacia/criar-microbacia'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const criarMicrobaciaRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/microbacias',
    {
      preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
      schema: {
        summary: 'Criar microbacia',
        tags: ['Microbacia'],
        body: z.object({
          Nome: z.string(),
          CodCBH: z.number(),
        }),
        response: {
          201: z.object({
            microbaciaId: z.number(),
          }),
          409: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { Nome, CodCBH } = request.body

      const { microbaciaId } = await criarMicrobacia({
        Nome,
        CodCBH,
      })
      return reply.status(201).send({ microbaciaId })
    }
  )
}
