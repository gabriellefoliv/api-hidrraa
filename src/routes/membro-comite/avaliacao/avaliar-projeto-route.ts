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
          dataIni: z.date(),
          dataFim: z.date(),
          bc_aprovado: z.boolean(),
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
          }),
          500: z.object({
            error: z.string(),
          }),
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
          bc_aprovado,
          bc_valorPagto,
          itens,
        } = request.body

        const { codAvaliacao, mediaPonderada } = await avaliarProjeto({
          codProjeto,
          codAvaliador,
          dataIni,
          dataFim,
          bc_aprovado,
          bc_valorPagto,
          itens,
        })

        return reply.status(201).send({ codAvaliacao, mediaPonderada })
      } catch (error) {
        return reply.status(500).send({ error: 'Erro ao avaliar projeto.' })
      }
    }
  )
}
