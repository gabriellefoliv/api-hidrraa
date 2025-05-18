import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { atualizarMicrobacia } from '../../../functions/membro-comite/microbacia/atualizar-microbacia'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const atualizarMicrobaciaRoute: FastifyPluginAsyncZod = async app => {
  app.put(
    '/api/microbacias/:CodMicroBacia',
    {
      preHandler: verificarPermissao(Perfil.MEMBRO_COMITE),
      schema: {
        summary: 'Atualizar microbacia',
        tags: ['Microbacia'],
        params: z.object({
          CodMicroBacia: z.coerce.number(), // aceita "123" como string na URL
        }),
        body: z.object({
          Nome: z.string(),
          CodCBH: z.number(),
        }),
        response: {
          200: z.object({
            microbacia: z.object({
              CodMicroBacia: z.number(),
              Nome: z.string(),
              CodCBH: z.number(),
            }),
          }),
          409: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { CodMicroBacia } = request.params
      const { Nome, CodCBH } = request.body

      const { novaMicrobacia } = await atualizarMicrobacia({
        CodMicroBacia,
        Nome,
        CodCBH,
      })
      return reply.status(201).send({ microbacia: novaMicrobacia })
    }
  )
}
