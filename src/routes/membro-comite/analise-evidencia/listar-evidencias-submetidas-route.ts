import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarEvidenciasSubmetidas } from '../../../functions/membro-comite/analise-evidencia/listar-evidencias-submetidas'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const listarEvidenciasSubmetidasRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/api/evidencias/:codProjeto/submetidas',
      {
        preHandler: verificarPermissao([
          Perfil.MEMBRO_COMITE,
          Perfil.ENTIDADE_EXECUTORA,
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
              })
            ),
          },
        },
      },
      async (request, reply) => {
        const { codProjeto } = request.params

        const execucoes = await listarEvidenciasSubmetidas({ codProjeto })

        const formattedExecucoes = execucoes.map(execucao => ({
          ...execucao,
          descricao: execucao.descricao ?? '',
        }))

        return reply.send(formattedExecucoes)
      }
    )
  }
