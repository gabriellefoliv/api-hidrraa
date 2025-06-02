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
      const { bc_valor } = request.body

      const { codUsuario } = request.user as { codUsuario: number }
      if (!codUsuario) {
        return reply.status(401).send({ error: 'Usuário não autenticado' })
      }

      try {
        const { aporteId } = await realizarAporte({
          codUsuario,
          bc_valor,
        })

        return reply.status(201).send({ aporteId })
      } catch (error) {
        return reply.status(409).send({ error: (error as Error).message })
      }
    }
  )
}
