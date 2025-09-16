import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { deletarMicrobacia } from '../../../functions/ent-del-tec/microbacia/deletar-microbacia'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const deletarMicrobaciaRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/api/microbacias/:CodMicroBacia',
    {
      preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
      schema: {
        summary: 'Deletar microbacia',
        tags: ['Microbacia'],
        params: z.object({
          CodMicroBacia: z.coerce.number(), // aceita "123" como string na URL
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
          409: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { CodMicroBacia } = request.params

      await deletarMicrobacia({
        CodMicroBacia,
      })
      return reply
        .status(201)
        .send({ message: 'Microbacia deletada com sucesso!' })
    }
  )
}
