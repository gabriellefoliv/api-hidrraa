import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarEvidenciasAvaliadas } from '../../../functions/entidade-executora/execucao-marco/listar-evidencias-avaliadas'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const listarEvidenciasAvaliadasRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/api/evidencias/:codProjeto/avaliadas',
      {
        preHandler: verificarPermissao([
          Perfil.ENTIDADE_EXECUTORA,
          Perfil.ENT_GER,
          Perfil.ENT_DEL_FIN,
        ]),
        schema: {
          summary:
            'Listar execuções de marco com evidências avaliadas por projeto',
          tags: ['Evidência'],
          params: z.object({
            codProjeto: z.coerce.number(),
          }),
          response: {
            200: z.object({
              titulo: z.string(),
              objetivo: z.string(),
              cronograma: z.string().nullable(),
              acoes: z.string().nullable(),
              orcamento: z.string().nullable(),
              dataSubmissao: z.coerce.date().nullable(),
              execucao_marco: z.array(
                z.object({
                  codExecucaoMarco: z.number(),
                  descricao: z.string().nullable(),
                  valorEstimado: z.number().nullable(),
                  bc_statusValidacaoCBH: z.string().nullable(),
                  descrDetAjustes: z.string().nullable(),
                  dataConclusaoEfetiva: z.coerce.date().nullable(),
                  evidencia_apresentada: z.array(
                    z.object({
                      codEvidenciaApresentada: z.number(),
                      caminhoArquivo: z.string(),
                      dataUpload: z.coerce.date(),
                      codEvidenciaDemandada: z.number(),
                    })
                  ),
                  relatorio_gerenciadora: z
                    .array(
                      z.object({
                        codRelGer: z.number(),
                        caminhoArquivo: z.string(),
                        dataUpload: z.coerce.date(),
                      })
                    )
                    .nullable(),
                })
              ),
            }),

            404: z.object({
              error: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { codProjeto } = request.params

        const projeto = await listarEvidenciasAvaliadas({ codProjeto })

        if (!projeto) {
          return reply.status(404).send({ error: 'Projeto não encontrado.' })
        }

        const formattedProjeto = {
          titulo: projeto.titulo ?? '',
          objetivo: projeto.objetivo ?? '',
          cronograma: projeto.cronograma ?? null,
          acoes: projeto.acoes ?? null,
          orcamento:
            projeto.orcamento !== null && projeto.orcamento !== undefined
              ? String(projeto.orcamento)
              : null,
          dataSubmissao: projeto.dataSubmissao ?? null,
          execucao_marco: Array.isArray(projeto.execucao_marco)
            ? projeto.execucao_marco.map(marco => ({
                codExecucaoMarco: marco.codExecucaoMarco ?? 0,
                descricao: marco.descricao ?? null,
                valorEstimado: marco.valorEstimado ?? null,
                bc_statusValidacaoCBH: marco.bc_statusValidacaoCBH ?? null,
                descrDetAjustes: marco.descrDetAjustes ?? null,
                dataConclusaoEfetiva: marco.dataConclusaoEfetiva ?? null,
                evidencia_apresentada: Array.isArray(
                  marco.evidencia_apresentada
                )
                  ? marco.evidencia_apresentada.map(evidencia => ({
                      codEvidenciaApresentada:
                        evidencia.codEvidenciaApresentada ?? 0,
                      caminhoArquivo: evidencia.caminhoArquivo ?? '',
                      dataUpload: evidencia.dataUpload ?? new Date(0),
                      codEvidenciaDemandada:
                        evidencia.codEvidenciaDemandada ?? 0,
                    }))
                  : [],
                relatorio_gerenciadora: Array.isArray(
                  marco.relatorio_gerenciadora
                )
                  ? marco.relatorio_gerenciadora.map(relatorio => ({
                      codRelGer: relatorio.codRelGer ?? 0,
                      caminhoArquivo: relatorio.caminhoArquivo ?? '',
                      dataUpload: relatorio.dataUpload ?? new Date(0),
                    }))
                  : null,
              }))
            : [],
        }

        return reply.send(formattedProjeto)
      }
    )
  }
