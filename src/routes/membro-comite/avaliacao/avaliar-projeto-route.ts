import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { avaliarProjeto } from '../../../functions/membro-comite/avaliacao/avaliar-projeto'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const avaliarProjetoRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/avaliacoes',
    {
      preHandler: verificarPermissao(Perfil.MEMBRO_COMITE),
      schema: {
        summary: 'Avaliação de projeto',
        tags: ['Avaliação'],
        body: z.object({
          codProjeto: z.number(),
          codAvaliador: z.number(),
          dataIni: z.string().transform(str => new Date(str)),
          dataFim: z.string().transform(str => new Date(str)),
          bc_valorPagto: z.number(),
          itens: z
            .array(
              z.object({
                codCriterioAval: z.number(),
                nota: z.number().min(0).max(10),
                parecer: z.string().min(1),
              })
            )
            .min(1),
        }),
        response: {
          201: z.object({
            codAvaliacao: z.number(),
            mediaPonderada: z.number(),
            aprovado: z.boolean(),
          }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const {
          codProjeto,
          codAvaliador,
          dataIni,
          dataFim,
          bc_valorPagto,
          itens,
        } = request.body

        const { codAvaliacao, mediaPonderada, aprovado } = await avaliarProjeto(
          {
            codProjeto,
            codAvaliador,
            dataIni,
            dataFim,
            bc_valorPagto,
            itens,
          }
        )

        return reply.status(201).send({
          codAvaliacao,
          mediaPonderada,
          aprovado,
        })
      } catch (error) {
        return reply.status(500).send({
          error: 'Erro ao avaliar projeto.',
        })
      }
    }
  )
}
