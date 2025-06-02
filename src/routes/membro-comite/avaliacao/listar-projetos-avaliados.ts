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
          return reply.status(200).send(avaliados)
        } catch (error) {
          return reply
            .status(500)
            .send({ error: 'Erro ao listar projetos avaliados' })
        }
      }
    )
  }
