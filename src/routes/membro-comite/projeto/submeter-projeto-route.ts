import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { submeterProjeto } from '../../../functions/membro-comite/projeto/submeter-projeto'

export const submeterProjetoRoute: FastifyPluginAsyncZod = async app => {
  app.put(
    '/api/projetos/submeter',
    {
      schema: {
        summary: 'Submeter Projeto',
        tags: ['Projeto'],
        body: z.object({
          codProjeto: z.coerce.number(),
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
      const { codProjeto } = request.body

      const { mensagem } = await submeterProjeto({ codProjeto })
      return reply.status(200).send({ mensagem })
    }
  )
}
