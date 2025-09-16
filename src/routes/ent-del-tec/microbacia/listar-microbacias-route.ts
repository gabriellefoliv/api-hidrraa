import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarMicrobacias } from '../../../functions/ent-del-tec/microbacia/listar-microbacias'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const listarMicrobaciasRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/api/microbacias',
    {
      preHandler: verificarPermissao([
        Perfil.ENT_DEL_TEC,
        Perfil.ENTIDADE_EXECUTORA,
      ]),
      schema: {
        summary: 'Listar microbacias',
        tags: ['Microbacia'],
        response: {
          200: z.array(
            z.object({
              CodMicroBacia: z.number(),
              Nome: z.string(),
              CodCBH: z.number(),
            })
          ),
          409: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const microbacias = await listarMicrobacias()

      return reply.status(201).send(microbacias)
    }
  )
}
