import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarProjetosAvaliados } from '../../../functions/membro-comite/avaliacao/listar-projetos-avaliados'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const listarProjetosAvaliadosRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/api/avaliacoes/avaliados',
      {
        preHandler: verificarPermissao(Perfil.MEMBRO_COMITE),
        schema: {
          summary: 'Listar projetos já avaliados com média final',
          tags: ['Avaliação'],
          response: {
            200: z.array(
              z.object({
                codProjeto: z.number(),
                titulo: z.string(),
                mediaPonderada: z.number().nullable(),
                descricao: z.string(),
                marco_recomendado: z.array(
                  z.object({
                    execucao_marco: z.array(
                      z.object({
                        descricao: z.string(),
                        valorEstimado: z.number(),
                        dataConclusao: z.date(),
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
          const avaliados = await listarProjetosAvaliados()

          // Map camelCase to snake_case for API response
          const formatted = avaliados.map(projeto => ({
            codProjeto: projeto.codProjeto,
            titulo: projeto.titulo,
            mediaPonderada: projeto.mediaPonderada,
            descricao: projeto.descricao,
            marco_recomendado: (projeto.marcoRecomendado || []).map(marco => ({
              execucao_marco: (marco.execucaoMarco || []).map(execucao => ({
                descricao: execucao.descricao,
                valorEstimado: execucao.valorEstimado,
                dataConclusao: execucao.dataConclusao,
              })),
            })),
          }))

          return reply.status(200).send(formatted)
        } catch (error) {
          return reply
            .status(500)
            .send({ error: 'Erro ao listar projetos avaliados' })
        }
      }
    )
  }
