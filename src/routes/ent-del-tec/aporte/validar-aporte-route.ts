import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { validarAporte } from '../../../functions/ent-del-tec/aporte/validar-aporte'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const validarAporteRoute: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/api/aportes/:codAporte',
    {
      preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
      schema: {
        summary: 'Validar aporte',
        tags: ['Aporte'],
        params: z.object({
          codAporte: z.coerce.number(),
        }),
        response: {
          200: z.object({
            codAporte: z.number(),
            validadoAGEVAP: z.boolean(),
          }),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { codAporte } = request.params

      try {
        const result = await validarAporte({ codAporte })
        return reply.status(200).send(result)
      } catch (error) {
        return reply.status(404).send({ error: 'Aporte não encontrado.' })
      }
    }
  )
}
