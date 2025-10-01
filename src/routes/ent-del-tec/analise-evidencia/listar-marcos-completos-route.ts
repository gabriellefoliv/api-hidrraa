import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarMarcosCompletos } from '../../../functions/ent-del-tec/analise-evidencia/listar-marco-completo'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const listarMarcosCompletosRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/api/marcos/:codProjeto/submetidos',
    {
      preHandler: verificarPermissao([
        Perfil.ENTIDADE_EXECUTORA,
        Perfil.ENT_DEL_TEC,
      ]),
      schema: {
        summary:
          'Listar execuções de marco com evidências submetidas por projeto',
        tags: ['Evidência'],
        params: z.object({
          codProjeto: z.coerce.number(),
        }),
        response: {
          200: z.array(
            z.object({
              codExecucaoMarco: z.number(),
              descricao: z.string(),
              bc_statusValidacaoCBH: z.string().nullable(),
              dataConclusaoEfetiva: z.coerce.date().nullable(),
              evidencia_apresentada: z.array(
                z.object({
                  codEvidenciaApresentada: z.number(),
                  caminhoArquivo: z.string(),
                  dataUpload: z.coerce.date(),
                  codEvidenciaDemandada: z.number(),
                })
              ),
              relatorio_gerenciadora: z.array(
                z.object({
                  codRelGer: z.number(),
                  caminhoArquivo: z.string(),
                  dataUpload: z.coerce.date(),
                })
              ),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const { codProjeto } = request.params

      const execucoes = await listarMarcosCompletos({ codProjeto })

      const formattedExecucoes = execucoes.map(execucao => ({
        ...execucao,
        descricao: execucao.descricao ?? '',
      }))

      return reply.send(formattedExecucoes)
    }
  )
}
