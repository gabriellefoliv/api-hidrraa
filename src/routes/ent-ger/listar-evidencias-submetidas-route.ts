import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarEvidenciasSubmetidas } from '../../functions/ent-ger/listar-evidencias-submetidas'
import { Perfil, verificarPermissao } from '../../middlewares/auth'

export const listarEvidenciasSubmetidasRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/api/evidencias/:codProjeto/submetidas/:codExecucaoMarco',
      {
        preHandler: verificarPermissao([
          Perfil.ENTIDADE_EXECUTORA,
          Perfil.ENT_GER,
        ]),
        schema: {
          summary:
            'Listar execuções de marco com evidências submetidas por projeto',
          tags: ['Evidência'],
          params: z.object({
            codProjeto: z.coerce.number(),
            codExecucaoMarco: z.coerce.number(),
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
        const { codProjeto, codExecucaoMarco } = request.params

        const execucoes = await listarEvidenciasSubmetidas({
          codProjeto,
          codExecucaoMarco,
        })

        const formattedExecucoes = execucoes.map(execucao => ({
          ...execucao,
          descricao: execucao.descricao ?? '',
        }))

        return reply.send(formattedExecucoes)
      }
    )
  }
