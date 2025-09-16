import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { excluirProjeto } from '../../../functions/membro-comite/projeto/excluir-projeto'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const excluirProjetoRoute: FastifyPluginAsync = async app => {
  app.delete(
    '/api/projetos/:codProjeto',
    {
      preHandler: verificarPermissao([Perfil.MEMBRO_COMITE]),
      schema: {
        summary: 'Excluir projeto salvo',
        tags: ['Projeto'],
        params: z.object({
          codProjeto: z.coerce.number(),
        }),
        response: {
          200: z.object({
            mensagem: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { codProjeto } = request.params as { codProjeto: number }

      const resultado = await excluirProjeto(codProjeto)

      return reply.status(200).send(resultado)
    }
  )
}
