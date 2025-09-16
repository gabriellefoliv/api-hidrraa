import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { excluirEvidencia } from '../../../functions/entidade-executora/execucao-marco/excluir-evidencia'
import { excluirProjeto } from '../../../functions/membro-comite/projeto/excluir-projeto'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const excluirEvidenciaRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/api/evidencias/:codEvidenciaApresentada',
    {
      preHandler: verificarPermissao([Perfil.ENTIDADE_EXECUTORA]),
      schema: {
        summary: 'Excluir evidência apresentada',
        tags: ['Projeto'],
        params: z.object({
          codEvidenciaApresentada: z.coerce.number(),
        }),
        response: {
          200: z.object({
            mensagem: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { codEvidenciaApresentada } = request.params

      const resultado = await excluirEvidencia(codEvidenciaApresentada)

      return reply.status(200).send(resultado)
    }
  )
}
