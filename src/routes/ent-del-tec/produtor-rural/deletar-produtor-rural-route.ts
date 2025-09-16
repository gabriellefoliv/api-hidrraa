import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { deletarProdutorRural } from '../../../functions/ent-del-tec/produtor-rural/deletar-produtor-rural'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const deletarProdutorRuralRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/api/produtores/:codProdutor',
    {
      preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
      schema: {
        summary: 'Deletar produtor rural',
        tags: ['Produtor Rural'],
        params: z.object({
          codProdutor: z.coerce.number(), // aceita "123" como string na URL
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
      const { codProdutor } = request.params

      await deletarProdutorRural({
        codProdutor,
      })
      return reply
        .status(201)
        .send({ message: 'Produtor Rural deletado com sucesso!' })
    }
  )
}
