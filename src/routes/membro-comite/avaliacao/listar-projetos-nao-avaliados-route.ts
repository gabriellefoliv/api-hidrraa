import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarProjetosNaoAvaliados } from '../../../functions/membro-comite/avaliacao/listar-projetos-nao-avaliados'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const listarProjetosNaoAvaliadosRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/api/avaliacoes',
      {
        preHandler: verificarPermissao(Perfil.MEMBRO_COMITE),
        schema: {
          summary: 'Listar projetos com informações completas para avaliação',
          tags: ['Avaliação'],
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
                dataSubmissao: z.date(),
                tipo_projeto: z.object({
                  codTipoProjeto: z.number(),
                  nome: z.string(),
                  descricao: z.string(),
                  execucao_marcos: z.array(
                    z.object({
                      descricao: z.string(),
                      valorEstimado: z.number(),
                      dataConclusao: z.date(),
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
          const projetos = await listarProjetosNaoAvaliados()
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          const formatted = projetos.map((proj: any) => ({
            codProjeto: proj.codProjeto,
            titulo: proj.titulo ?? '',
            objetivo: proj.objetivo ?? '',
            acoes: proj.acoes ?? '',
            cronograma: proj.cronograma ?? '',
            orcamento: proj.orcamento ?? 0,
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
                          dataConclusao: em.dataConclusao
                            ? new Date(em.dataConclusao)
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
