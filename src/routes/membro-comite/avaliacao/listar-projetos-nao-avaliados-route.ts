import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarProjetosNaoAvaliados } from '../../../functions/membro-comite/avaliacao/listar-projetos-nao-avaliados'

export const listarProjetosNaoAvaliadosRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/api/avaliacao/projetos',
      {
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
                tipo_projeto: z.object({
                  nome: z.string(),
                  descricao: z.string(),
                  marco_recomendado: z.array(
                    z.object({
                      descricao: z.string(),
                      valorEstimado: z.number(),
                    })
                  ),
                }),
                entidadeexecutora: z.object({
                  nome: z.string(),
                }),
                microbacia: z.object({
                  Nome: z.string(),
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
          return reply.status(200).send(projetos)
        } catch (error) {
          return reply.status(500).send({ error: 'Erro ao listar projetos' })
        }
      }
    )
  }
