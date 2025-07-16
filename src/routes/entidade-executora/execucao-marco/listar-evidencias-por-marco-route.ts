import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarEvidenciasPorMarco } from '../../../functions/entidade-executora/execucao-marco/listar-evidencias-por-marco'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const listarEvidenciasRoute: FastifyPluginAsyncZod = async app => {
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
              execucao_marco: z.object({
                dataConclusaoEfetiva: z.coerce.date().nullable(),
              }),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const { codProjeto, codExecucaoMarco } = request.params

      const evidencias = await listarEvidenciasPorMarco({
        codProjeto,
        codExecucaoMarco,
      })
      return reply.send(evidencias)
    }
  )
}
