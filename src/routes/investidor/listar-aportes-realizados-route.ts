import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarAportesRealizados } from '../../functions/investidor/listar-aportes-realizados'
import { Perfil, verificarPermissao } from '../../middlewares/auth'

export const listarAportesRealizadosRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/api/aportes/:codInvestidor',
      {
        preHandler: verificarPermissao(Perfil.INVESTIDOR),
        schema: {
          summary: 'Listar aportes realizados por Investidor',
          tags: ['Aporte'],
          params: z.object({
            codInvestidor: z.coerce.number(),
          }),
          response: {
            200: z.array(
              z.object({
                codAporte: z.number(),
                dataInvestimento: z.date(),
                bc_valor: z.number(),
                validadoAGEVAP: z.boolean(),
                codCBH: z.number(),
              })
            ),
            409: z.object({
              error: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { codInvestidor } = request.params

        const aportes = await listarAportesRealizados({
          codInvestidor,
        })
        return reply.status(200).send(aportes)
      }
    )
  }
