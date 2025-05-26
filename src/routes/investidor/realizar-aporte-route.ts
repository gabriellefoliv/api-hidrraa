import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { realizarAporte } from '../../functions/investidor/realizar-aporte'
import { Perfil, verificarPermissao } from '../../middlewares/auth'

export const realizarAporteRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/aportes',
    {
      preHandler: verificarPermissao(Perfil.INVESTIDOR),
      schema: {
        summary: 'Realizar Aporte',
        tags: ['Aporte'],
        body: z.object({
          codInvestidor: z.number(),
          codCBH: z.number(),
          bc_valor: z.number(),
        }),
        response: {
          201: z.object({
            aporteId: z.number(),
          }),
          409: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { codInvestidor, codCBH, bc_valor } = request.body

      const { aporteId } = await realizarAporte({
        codInvestidor,
        codCBH,
        bc_valor,
      })
      return reply.status(201).send({ aporteId })
    }
  )
}
