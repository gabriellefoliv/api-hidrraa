import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarAportes } from '../../../functions/ent-del-tec/aporte/listar-aportes'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const listarAportesRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/api/aportes',
    {
      preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
      schema: {
        summary: 'Listar aportes',
        tags: ['Aporte'],

        response: {
          200: z.array(
            z.object({
              codAporte: z.number(),
              dataInvestimento: z.date(),
              bc_valor: z.number(),
              validadoAGEVAP: z.boolean(),
              codInvestidor: z.number(),
              codCBH: z.number(),
              investidor_esg: z.object({
                razaoSocial: z.string(),
              }),
            })
          ),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const aportes = await listarAportes()
        return reply.status(200).send(aportes)
      } catch (error) {
        return reply.status(404).send({ error: 'Aporte não encontrado.' })
      }
    }
  )
}
