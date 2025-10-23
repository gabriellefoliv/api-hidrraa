import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarProjetosComEvidencias } from '../../../functions/ent-del-tec/analise-evidencia/listar-projetos-com-evidencias'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const listarProjetosComEvidenciasRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/api/projetos-com-evidencias',
      {
        preHandler: verificarPermissao([
          Perfil.ENT_DEL_TEC,
          Perfil.ENT_DEL_FIN,
        ]),
        schema: {
          summary: 'Listar projetos com evidências submetidas',
          tags: ['Evidências'],
          response: {
            200: z.array(
              z.object({
                codProjeto: z.number(),
                titulo: z.string(),
                objetivo: z.string(),
                acoes: z.string(),
                cronograma: z.string(),
                orcamento: z.number(),
                codPropriedade: z.number(),
                CodMicroBacia: z.number(),
                caminhoArquivo: z.string().nullable(),
                dataSubmissao: z.date(),
                tipo_projeto: z.object({
                  codTipoProjeto: z.number(),
                  nome: z.string(),
                  descricao: z.string(),
                  execucao_marcos: z.array(
                    z.object({
                      descricao: z.string(),
                      valorEstimado: z.number(),
                      dataConclusaoPrevista: z.date(),
                    })
                  ),
                }),
                microbacia: z.object({
                  codMicroBacia: z.number(),
                  nome: z.string(),
                }),
                entidadeexecutora: z.object({
                  codEntidadeExecutora: z.number(),
                  nome: z.string(),
                }),
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
          const projetos = await listarProjetosComEvidencias()
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          const formatted = projetos.map((proj: any) => ({
            codProjeto: proj.codProjeto,
            titulo: proj.titulo ?? '',
            objetivo: proj.objetivo ?? '',
            acoes: proj.acoes ?? '',
            cronograma: proj.cronograma ?? '',
            orcamento: proj.orcamento ?? 0,
            caminhoArquivo: proj.caminhoArquivo ?? null,
            codPropriedade: proj.codPropriedade ?? 0,
            CodMicroBacia: proj.CodMicroBacia ?? 0,
            dataSubmissao: proj.dataSubmissao ?? new Date(0),
            tipo_projeto: {
              codTipoProjeto: proj.tipo_projeto?.codTipoProjeto ?? 0,
              nome: proj.tipo_projeto?.nome ?? '',
              descricao: proj.tipo_projeto?.descricao ?? '',
              execucao_marcos: Array.isArray(
                proj.tipo_projeto?.marco_recomendado
              )
                ? // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                  proj.tipo_projeto.marco_recomendado.flatMap((marco: any) =>
                    Array.isArray(marco.execucao_marco)
                      ? // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        marco.execucao_marco.map((em: any) => ({
                          descricao: em.descricao ?? '',
                          valorEstimado: em.valorEstimado ?? 0,
                          dataConclusaoPrevista: em.dataConclusaoPrevista
                            ? new Date(em.dataConclusaoPrevista)
                            : new Date(0),
                        }))
                      : []
                  )
                : [],
            },
            microbacia: {
              codMicroBacia: proj.microbacia?.CodMicroBacia ?? null,
              nome: proj.microbacia?.Nome ?? null,
            },
            entidadeexecutora: {
              codEntidadeExecutora: proj.entidadeexecutora?.codEntExec ?? null,
              nome: proj.entidadeexecutora?.nome ?? null,
            },
          }))
          return reply.status(200).send(formatted)
        } catch (error) {
          return reply.status(500).send({ error: 'Erro ao listar projetos' })
        }
      }
    )
  }
