import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarProjetosComSolicitacoes } from '../../functions/ent-del-fin/listar-projetos-com-solicitacao'
import { Perfil, verificarPermissao } from '../../middlewares/auth'

export const listarProjetosComSolicitacoesRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/api/pagamentos/projetos-com-solicitacoes',
      {
        preHandler: verificarPermissao([Perfil.ENT_DEL_FIN]),
        schema: {
          summary:
            'Lista projetos que possuem solicitações de pagamento em aberto',
          tags: ['Pagamentos'],
          response: {
            200: z.array(
              z.object({
                codProjeto: z.number(),
                titulo: z.string(),
                orcamento: z.number(),
                objetivo: z.string().nullable(),
                acoes: z.string().nullable(),
                cronograma: z.string().nullable(),

                execucao_marco: z.array(
                  z.object({
                    codExecucaoMarco: z.number(),
                    descricao: z.string(),
                    valorEstimado: z.number(),
                    dataConclusaoEfetiva: z.date().nullable(),
                    pagto_marco_concluido: z.array(
                      z.object({
                        codPagtoMarco: z.number(),
                        CodEntExec: z.number(),
                        bc_data: z.date().nullable(),
                      })
                    ),
                  })
                ),
              })
            ),
            500: z.object({
              error: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        try {
          const projetos = await listarProjetosComSolicitacoes()
          const formattedProjetos = projetos.map(proj => ({
            codProjeto: proj.codProjeto,
            titulo: proj.titulo ?? '',
            orcamento: proj.orcamento ?? 0,
            objetivo: proj.objetivo ?? null,
            acoes: proj.acoes ?? null,
            cronograma: proj.cronograma ?? null,
            execucao_marco: Array.isArray(proj.execucao_marco)
              ? proj.execucao_marco.map(marco => ({
                  codExecucaoMarco: marco.codExecucaoMarco,
                  descricao: marco.descricao ?? '',
                  valorEstimado: marco.valorEstimado ?? 0,
                  dataConclusaoEfetiva: marco.dataConclusaoEfetiva ?? null,
                  pagto_marco_concluido: Array.isArray(
                    marco.pagto_marco_concluido
                  )
                    ? marco.pagto_marco_concluido.map(pm => ({
                        codPagtoMarco: pm.codPagtoMarco,
                        CodEntExec: pm.CodEntExec ?? 0,
                        bc_data: pm.bc_data ?? null,
                      }))
                    : [],
                }))
              : [],
          }))
          return reply.status(200).send(formattedProjetos)
        } catch (error) {
          return reply.status(500).send({ error: (error as Error).message })
        }
      }
    )
  }
