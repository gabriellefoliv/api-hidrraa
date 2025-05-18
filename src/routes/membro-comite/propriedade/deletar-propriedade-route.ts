import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { deletarMicrobacia } from '../../../functions/membro-comite/microbacia/deletar-microbacia'
import { deletarPropriedade } from '../../../functions/membro-comite/propriedade/deletar-produtor-rural'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const deletarPropriedadeRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/api/propriedades/:codPropriedade',
    {
      preHandler: verificarPermissao(Perfil.MEMBRO_COMITE),
      schema: {
        summary: 'Deletar propriedade',
        tags: ['Propriedade'],
        params: z.object({
          codPropriedade: z.coerce.number(), // aceita "123" como string na URL
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
      const { codPropriedade } = request.params

      await deletarPropriedade({
        codPropriedade,
      })
      return reply
        .status(201)
        .send({ message: 'Microbacia deletada com sucesso!' })
    }
  )
}
