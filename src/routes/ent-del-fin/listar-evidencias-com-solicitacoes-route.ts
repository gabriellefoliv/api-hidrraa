import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarEvidenciasComSolicitacoes } from '../../functions/ent-del-fin/listar-evidencias-com-solicitacoes'
import { Perfil, verificarPermissao } from '../../middlewares/auth'

const pagtoServicoSchema = z.object({
  codPagtoServico: z.number(),
  valor: z.number(),
  docNF: z.string(),
  data: z.coerce.date(),
})

export const listarEvidenciasComSolicitacoesRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/api/pagamentos/:codProjeto',
      {
        preHandler: verificarPermissao([
          Perfil.ENTIDADE_EXECUTORA,
          Perfil.ENT_GER,
          Perfil.ENT_DEL_FIN,
        ]),
        schema: {
          summary:
            'Listar execuções de marcos que apresentam solicitações de pagamento',
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
              execucao_marco: z
                .array(
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
                    pagto_marco_concluido: z.array(
                      z.object({
                        codPagtoMarco: z.number(),
                        bc_data: z.date(),
                        bc_valor: z.number(),
                        codExecucaoMarco: z.number(),
                        CodEntExec: z.number().nullable(),
                        transacoes: z
                          .array(
                            z.object({
                              codTransacao: z.number(),
                              hash: z.string(),
                              status: z.string(),
                              valor: z.number(),
                              data: z.date(),
                            })
                          )
                          .optional(),
                      })
                    ),
                    pagto_servico: z.array(pagtoServicoSchema),
                  })
                )
                .nullable(),
            }),
            404: z.object({
              error: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { codProjeto } = request.params

        const projeto = await listarEvidenciasComSolicitacoes({ codProjeto })

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
          execucao_marco:
            projeto.execucao_marco?.map(marco => ({
              codExecucaoMarco: marco.codExecucaoMarco ?? 0,
              descricao: marco.descricao ?? null,
              valorEstimado: marco.valorEstimado ?? null,
              bc_statusValidacaoCBH: marco.bc_statusValidacaoCBH ?? null,
              descrDetAjustes: marco.descrDetAjustes ?? null,
              dataConclusaoEfetiva: marco.dataConclusaoEfetiva ?? null,
              evidencia_apresentada: marco.evidencia_apresentada.map(
                evidencia => ({
                  codEvidenciaApresentada:
                    evidencia.codEvidenciaApresentada ?? 0,
                  caminhoArquivo: evidencia.caminhoArquivo ?? '',
                  dataUpload: evidencia.dataUpload ?? new Date(0),
                  codEvidenciaDemandada: evidencia.codEvidenciaDemandada ?? 0,
                })
              ),
              relatorio_gerenciadora:
                marco.relatorio_gerenciadora?.map(relatorio => ({
                  codRelGer: relatorio.codRelGer ?? 0,
                  caminhoArquivo: relatorio.caminhoArquivo ?? '',
                  dataUpload: relatorio.dataUpload ?? new Date(0),
                })) ?? null,
              pagto_marco_concluido:
                marco.pagto_marco_concluido?.map(pagto => ({
                  codPagtoMarco: pagto.codPagtoMarco ?? 0,
                  bc_data: pagto.bc_data ?? new Date(0),
                  bc_valor: pagto.bc_valor ?? 0,
                  codExecucaoMarco: pagto.codExecucaoMarco ?? 0,
                  CodEntExec: pagto.CodEntExec ?? null,
                  transacoes:
                    pagto.transacoes?.map(tx => ({
                      codTransacao: tx.codTransacao ?? 0,
                      hash: tx.hash ?? '',
                      status: tx.status ?? 'pendente',
                      valor: tx.valor ?? 0,
                      data: tx.data ?? new Date(0),
                    })) ?? [],
                })) ?? [],
              pagto_servico:
                marco.pagto_servico?.map(servico => ({
                  codPagtoServico: servico.codPagtoServico ?? 0,
                  valor: servico.valor ?? 0,
                  docNF: servico.docNF ?? '',
                  data: servico.data ?? new Date(0),
                })) ?? [],
            })) ?? [],
        }

        return reply.send(formattedProjeto)
      }
    )
  }
