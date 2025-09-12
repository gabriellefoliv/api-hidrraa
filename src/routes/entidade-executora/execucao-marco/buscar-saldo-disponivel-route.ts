import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { buscarSaldoDisponivel } from '../../../functions/entidade-executora/execucao-marco/buscar-saldo-disponivel'

export const buscarSaldoDisponivelRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/api/projetos/:codProjeto/saldo',
    {
      schema: {
        summary: 'Busca o saldo de financiamento disponível para um projeto',
        tags: ['Financiamento'],
        params: z.object({
          codProjeto: z.coerce.number(),
        }),
        response: {
          200: z.object({
            saldoDisponivel: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { codProjeto } = request.params
      const { saldoDisponivel } = await buscarSaldoDisponivel({ codProjeto })
      return reply.send({ saldoDisponivel })
    }
  )
}
