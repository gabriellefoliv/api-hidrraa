import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { submeterEvidencias } from '../../../functions/entidade-executora/execucao-marco/submeter-evidencias'

export const submeterEvidenciasRoute: FastifyPluginAsyncZod = async app => {
  app.put(
    '/api/evidencias/submeter',
    {
      schema: {
        summary: 'Submeter Evidências',
        tags: ['Evidências'],
        body: z.object({
          codExecucaoMarco: z.coerce.number(),
        }),
        response: {
          200: z.object({
            mensagem: z.string(),
          }),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { codExecucaoMarco } = request.body

      const { mensagem } = await submeterEvidencias({ codExecucaoMarco })
      return reply.status(200).send({ mensagem })
    }
  )
}
