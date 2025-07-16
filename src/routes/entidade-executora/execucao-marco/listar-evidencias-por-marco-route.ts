import type { FastifyPluginAsync } from 'fastify'
import z from 'zod'
import { verificarPermissao, Perfil } from '../../../middlewares/auth'
import { listarEvidenciasPorMarco } from '../../../functions/entidade-executora/projeto/listar-evidencias-por-marco'

export const listarEvidenciasRoute: FastifyPluginAsync = async app => {
  app.get(
    '/api/evidencias/:codProjeto/:codExecucaoMarco',
    {
      preHandler: verificarPermissao([Perfil.ENTIDADE_EXECUTORA]),
      schema: {
        summary: 'Listar evidências por projeto e execução de marco',
        tags: ['Evidência'],
        params: z.object({
          codProjeto: z.coerce.number(),
          codExecucaoMarco: z.coerce.number(),
        }),
        response: {
          200: z.array(
            z.object({
              codEvidenciaApresentada: z.number(),
              caminhoArquivo: z.string(),
              dataUpload: z.coerce.date(),
              codEvidenciaDemandada: z.number(),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const { codProjeto, codExecucaoMarco } = request.params as { codProjeto: number; codExecucaoMarco: number }
      const evidencias = await listarEvidenciasPorMarco({ codProjeto, codExecucaoMarco })
      return reply.send(evidencias)
    }
  )
}
