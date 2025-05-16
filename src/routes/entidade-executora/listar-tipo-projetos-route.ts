import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarTiposProjeto } from '../../functions/entidade-executora/listar-tipos-projeto'
import { Perfil, verificarPermissao } from '../../middlewares/auth'

export const listarTiposProjetoRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/api/tipos-projeto',
    {
      preHandler: verificarPermissao(Perfil.ENTIDADE_EXECUTORA),
      schema: {
        summary: 'Listar tipos de projeto',
        tags: ['Tipos de Projeto'],
        response: {
          200: z.array(
            z.object({
              id: z.number(),
              nome: z.string(),
              descricao: z.string(),
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
        const { tiposProjeto } = await listarTiposProjeto()
        const formattedTiposProjeto = tiposProjeto.map(tp => ({
          id: tp.codTipoProjeto,
          nome: tp.nome,
          descricao: tp.descricao,
        }))
        return reply.status(200).send(formattedTiposProjeto)
      } catch (error) {
        if (error instanceof Error) {
          return reply.status(500).send({ error: error.message })
        }
        return reply.status(500).send({ error: 'Erro do servidor.' })
      }
    }
  )
}
